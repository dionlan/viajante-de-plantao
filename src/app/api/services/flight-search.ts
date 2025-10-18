// lib/flight-search.ts
import { FlightSearch, TokenData, LatamApiResponse, Flight, LatamFlightOffer } from '@/lib/types';
import { TokenManager, UrlBuilder } from '@/lib/api-utils';
import { HttpClient } from '@/lib/http-client';

interface RequestHeaders {
    [key: string]: string;
}

export class FlightSearchService {
    private static readonly USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

    /**
     * Obtém o token de busca da LATAM
     */
    static async getUrlSearchToken(searchParams: FlightSearch): Promise<string> {
        console.log('🔄 Obtendo novo searchToken...');

        try {
            UrlBuilder.validateSearchParams(searchParams);
        } catch (error) {
            console.error('❌ Parâmetros inválidos:', error);
            throw error;
        }

        const searchUrl = UrlBuilder.buildSearchUrl(searchParams);
        console.log('🔗 URL de busca para token:', searchUrl);

        try {
            const token = await HttpClient.latamRequest(searchUrl, {
                extractToken: true,
                headers: {
                    'Accept-Encoding': 'gzip, deflate, br',
                },
                timeout: 15000
            });

            if (!token) {
                throw new Error('Token não encontrado na resposta');
            }

            console.log('✅ SearchToken obtido:', token.substring(0, 50) + '...');
            TokenManager.setToken(token);
            return token;

        } catch (error) {
            console.error('❌ Erro ao obter token:', error);
            throw new Error(`Falha ao obter token: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
    }

    /**
     * Busca voos com os parâmetros fornecidos
     */
    static async searchFlights(searchParams: FlightSearch): Promise<Flight[]> {
        console.log('✈️ Iniciando busca de voos...', {
            origin: searchParams.origin,
            destination: searchParams.destination,
            departureDate: searchParams.departureDate,
            tripType: searchParams.tripType
        });

        try {
            UrlBuilder.validateSearchParams(searchParams);
        } catch (error) {
            console.error('❌ Parâmetros inválidos:', error);
            throw error;
        }

        // Verifica se há token válido antes de tentar renovar
        const existingToken = TokenManager.getToken();
        if (existingToken && !TokenManager.isTokenExpired(existingToken)) {
            console.log('🔑 Usando token existente...');
            try {
                return await this.getFlightApiOffersWithFetch(searchParams, existingToken.searchToken);
            } catch (error) {
                console.log('🔄 Token existente falhou, obtendo novo...');
                TokenManager.clearToken();
            }
        }

        console.log('🔄 Obtendo novo token...');
        await this.getUrlSearchToken(searchParams);

        const tokenData = TokenManager.getToken();
        if (!tokenData) {
            throw new Error('Não foi possível obter o token de busca');
        }

        return await this.getFlightApiOffersWithFetch(searchParams, tokenData.searchToken);
    }

    /**
     * Busca ofertas de voos usando a API da LATAM
     */
    private static async getFlightApiOffersWithFetch(searchParams: FlightSearch, searchToken: string): Promise<Flight[]> {
        console.log('🔍 Buscando ofertas com token...');

        const offersUrl = UrlBuilder.buildApiOffersUrl(searchParams);
        const expId = this.generateUUID();
        const refererUrl = UrlBuilder.getRefererUrl(searchParams, expId);

        console.log('🔗 URL de ofertas:', offersUrl);

        // Gera todos os IDs necessários
        const sessionId = this.generateUUID();
        const requestId = this.generateUUID();
        const trackId = this.generateUUID();

        // Adiciona exp_id ao referer URL
        const refererWithExpId = `${refererUrl}&exp_id=${expId}`;

        // Headers completos para a API LATAM
        const headers: RequestHeaders = {
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'priority': 'u=1, i',
            'referer': refererWithExpId,
            'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': this.USER_AGENT,
            'x-latam-action-name': 'search-result.flightselection.offers-search',
            'x-latam-app-session-id': sessionId,
            'x-latam-application-country': 'BR',
            'x-latam-application-lang': 'pt',
            'x-latam-application-name': 'web-air-offers',
            'x-latam-application-oc': 'br',
            'x-latam-client-name': 'web-air-offers',
            'x-latam-device-width': '1920',
            'x-latam-request-id': requestId,
            'x-latam-search-token': searchToken,
            'x-latam-track-id': trackId,
            'Cookie': this.generateCookies()
        };

        console.log('📋 Headers configurados para ofertas');

        try {
            const data = await HttpClient.request(offersUrl, {
                method: 'GET',
                headers: headers,
                timeout: 20000,
                retries: 1
            });

            console.log('✅ Busca de ofertas concluída com sucesso');
            return this.parseOffersResponse(data);

        } catch (error) {
            console.error('❌ Erro na busca de ofertas:', error);

            // Verifica se é erro de autenticação
            const errorMessage = error instanceof Error ? error.message : String(error);
            if (errorMessage.includes('token') || errorMessage.includes('auth') ||
                errorMessage.includes('400') || errorMessage.includes('401') ||
                errorMessage.includes('403')) {
                console.log('🔄 Token inválido ou expirado, renovando...');
                TokenManager.clearToken();
                return this.searchFlights(searchParams);
            }

            throw new Error(`Erro na busca de ofertas: ${errorMessage}`);
        }
    }

    /**
     * Parseia a resposta da API LATAM
     */
    private static parseOffersResponse(data: unknown): Flight[] {
        try {
            // Aceita string ou objeto; valida em tempo de execução antes de forçar a tipagem
            let parsed: unknown;
            if (typeof data === 'string') {
                parsed = JSON.parse(data);
            } else {
                parsed = data;
            }

            if (!parsed || typeof parsed !== 'object') {
                console.warn('⚠️ Resposta da API LATAM não é um objeto válido');
                return [];
            }

            const parsedData = parsed as LatamApiResponse;

            console.log('📊 Resposta da API LATAM:', {
                hasContent: !!parsedData.content,
                contentCount: parsedData.content?.length || 0,
                totalElements: parsedData.totalElements,
                totalPages: parsedData.totalPages
            });

            if (parsedData.content && Array.isArray(parsedData.content)) {
                const flights = parsedData.content
                    .map((offer: LatamFlightOffer, index: number) => this.transformToFlight(offer, index))
                    .filter((flight): flight is Flight => flight !== null);

                console.log(`✅ ${flights.length} voos transformados de content`);
                return flights;
            }

            console.warn('⚠️ Estrutura de resposta não reconhecida ou conteúdo vazio');
            return [];

        } catch (error) {
            console.error('❌ Erro ao parsear resposta:', error);
            // Protege contra data que não seja string ao tentar substring
            if (typeof data === 'string') {
                console.error('📦 Dados que causaram erro:', data.substring(0, 500));
            } else {
                console.error('📦 Dados que causaram erro: Objeto não string');
            }
            return [];
        }
    }

    /**
     * Transforma oferta da LATAM em Flight
     */
    private static transformToFlight(offer: LatamFlightOffer, index: number): Flight | null {
        try {
            const summary = offer.summary;

            if (!summary || !summary.origin || !summary.destination) {
                console.warn(`⚠️ Oferta ${index} com estrutura inválida`);
                return null;
            }

            // Calcula preços corretamente
            const milesPrice = summary.brands?.[0]?.price?.amount ?? 0;
            const cashPrice = (summary.brands?.[0]?.priceWithOutTax?.amount ?? 0) +
                (summary.brands?.[0]?.taxes?.amount ?? 0);

            // Calcula número de paradas
            const stopOvers = summary.stopOvers || 0;

            // Formata duração
            const totalDurationFormatted = this.formatDuration(summary.duration);

            // Extrai horários
            const departureTime = summary.origin.departureTime ||
                this.extractTime(summary.origin.departure || '');
            const arrivalTime = summary.destination.arrivalTime ||
                this.extractTime(summary.destination.arrival || '');

            // Determina classe e airline
            const flightClass = offer.brands?.[0]?.cabin?.label || 'Econômica';
            const airline = this.convertAirlineType(summary.airline || 'LATAM');

            // Gera sellers
            const sellers = this.generateMockSellers(index);

            const flight: Flight = {
                id: `flight-${index}-${Date.now()}`,
                airline,
                stopOvers,
                flightNumber: summary.flightCode || `LA${index}`,
                origin: summary.origin.iataCode || '',
                originCity: summary.origin.city || '',
                destination: summary.destination.iataCode || '',
                destinationCity: summary.destination.city || '',
                departure: summary.origin.departure || '',
                arrival: summary.destination.arrival || '',
                departureTime,
                arrivalTime,
                duration: totalDurationFormatted,
                durationMinutes: summary.duration || 0,
                class: flightClass,
                milesPrice,
                cashPrice,
                program: 'latam',
                sellers,
                summary: summary,
                itinerary: offer.itinerary,
                brands: offer.brands,
                totalDurationFormatted
            };

            return flight;

        } catch (error) {
            console.error(`❌ Erro ao transformar oferta ${index}:`, error);
            return null;
        }
    }

    /**
     * Gera cookies simulados
     */
    private static generateCookies(): string {
        const abck = this.generateRandomString(500);
        const xpExpId = this.generateUUID();
        const bmSz = this.generateRandomString(100);
        const xpSession = `s%3A${this.generateRandomString(50)}.${this.generateRandomString(100)}`;

        return `_abck=${abck}; _xp_exp_id=${xpExpId}; bm_sz=${bmSz}; _xp_session=${xpSession}`;
    }

    private static generateRandomString(length: number): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~-';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    private static generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    private static extractTime(dateTimeString: string): string {
        if (!dateTimeString) return '';
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } catch {
            return '';
        }
    }

    private static formatDuration(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours > 0 && mins > 0) {
            return `${hours}h ${mins}m`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else {
            return `${mins}m`;
        }
    }

    private static generateMockSellers(flightIndex: number): string[] {
        const availableSellerIds = [
            "seller-0-0", "seller-0-1", "seller-1-0", "seller-2-0",
            "seller-2-1", "seller-2-2", "seller-3-0", "seller-3-1",
            "seller-4-0", "seller-4-1", "seller-4-2", "seller-4-3"
        ];

        const sellerCounts = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3];
        const count = sellerCounts[flightIndex % sellerCounts.length] || 1;

        const selectedSellers: string[] = [];
        for (let i = 0; i < count && i < availableSellerIds.length; i++) {
            const sellerIndex = (flightIndex + i) % availableSellerIds.length;
            const sellerId = availableSellerIds[sellerIndex];
            if (!selectedSellers.includes(sellerId)) {
                selectedSellers.push(sellerId);
            }
        }

        if (selectedSellers.length === 0 && availableSellerIds.length > 0) {
            selectedSellers.push(availableSellerIds[0]);
        }

        return selectedSellers;
    }

    private static convertAirlineType(airline: string): 'LATAM' | 'GOL' | 'AZUL' {
        const upperAirline = airline.toUpperCase();
        if (upperAirline.includes('GOL')) return 'GOL';
        if (upperAirline.includes('AZUL')) return 'AZUL';
        return 'LATAM';
    }

    /**
     * Método para debug - busca token e ofertas em sequência
     */
    static async debugSearch(searchParams: FlightSearch): Promise<{ token: string; flights: Flight[] }> {
        console.log('🐛 DEBUG: Iniciando busca completa...');

        try {
            const token = await this.getUrlSearchToken(searchParams);
            console.log('✅ DEBUG: Token obtido com sucesso');

            const flights = await this.getFlightApiOffersWithFetch(searchParams, token);
            console.log('✅ DEBUG: Ofertas obtidas com sucesso');

            return { token, flights };

        } catch (error) {
            console.error('❌ DEBUG: Erro na busca completa:', error);
            throw error;
        }
    }

    /**
     * Health check do serviço
     */
    static async healthCheck(): Promise<{ healthy: boolean; message: string }> {
        try {
            const health = await HttpClient.healthCheck();
            return {
                healthy: health.success,
                message: health.message
            };
        } catch (error) {
            return {
                healthy: false,
                message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    /**
     * Limpa cache e tokens
     */
    static clearCache(): void {
        TokenManager.clearToken();
        console.log('🗑️ Cache limpo com sucesso');
    }
}