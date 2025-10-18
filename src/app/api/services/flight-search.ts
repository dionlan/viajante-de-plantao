// flight-search.ts - CLASSE COMPLETA ATUALIZADA
import { FlightSearch, TokenData, LatamApiResponse, Flight, LatamFlightOffer } from '@/lib/types';
import { TokenManager, UrlBuilder } from '@/lib/api-utils';
import { HttpClient } from '@/lib/http-client';

// Interface para headers
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

        const searchUrl = UrlBuilder.buildSearchUrl(searchParams);
        console.log('🔗 URL de busca para token:', searchUrl);

        try {
            const token = await HttpClient.latamRequest(searchUrl, {
                extractToken: true,
                headers: {
                    'Accept-Encoding': 'gzip, deflate, br',
                }
            });

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
        console.log('✈️ Iniciando busca de voos...', searchParams);

        let tokenData = TokenManager.getToken();

        // Sempre obtém novo token para garantir frescor
        console.log('🔄 Obtendo novo token...');
        await this.getUrlSearchToken(searchParams);
        tokenData = TokenManager.getToken();

        if (!tokenData) {
            throw new Error('Não foi possível obter o token de busca');
        }

        return await this.getFlightApiOffersWithFetch(searchParams, tokenData.searchToken);
    }

    /**
     * Busca ofertas de voos usando a API da LATAM
     */
    private static async getFlightApiOffersWithFetch(searchParams: FlightSearch, searchToken: string): Promise<Flight[]> {
        console.log('🔍 Buscando ofertas com fetch...');

        const offersUrl = UrlBuilder.buildApiOffersUrl(searchParams);
        const expId = this.generateUUID();
        const refererUrl = UrlBuilder.getRefererUrl(searchParams, expId);

        console.log('🔗 URL de ofertas:', offersUrl);
        console.log('🔗 Referer URL com exp_id:', refererUrl);

        // Gera todos os IDs necessários
        const sessionId = this.generateUUID();
        const requestId = this.generateUUID();
        const trackId = this.generateUUID();

        // Adiciona exp_id ao referer URL
        const refererWithExpId = `${refererUrl}&exp_id=${expId}`;

        // Headers completos baseados no exemplo do curl
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
            'x-latam-device-width': '1746',
            'x-latam-request-id': requestId,
            'x-latam-search-token': searchToken,
            'x-latam-track-id': trackId,
            'Cookie': this.generateCookies()
        };

        console.log('📋 Headers configurados:', Object.keys(headers).length, 'headers');

        try {
            const data = await HttpClient.request(offersUrl, {
                method: 'GET',
                headers: headers,
                timeout: 15000,
            });

            console.log('✅ Busca concluída com sucesso');
            // HttpClient.request returns unknown, so cast to the expected union before parsing
            return this.parseOffersResponse(data as LatamApiResponse | string);

        } catch (error) {
            console.error('❌ Erro na busca de ofertas:', error);

            // Tentativa de renovar token se houver erro de autenticação
            if (error instanceof Error && (
                error.message.includes('token') ||
                error.message.includes('auth') ||
                error.message.includes('400') ||
                error.message.includes('401')
            )) {
                console.log('🔄 Possível problema com token, tentando renovar...');
                TokenManager.clearToken();
                return this.searchFlights(searchParams);
            }

            throw new Error(`Erro na busca de ofertas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
    }

    /**
     * Gera cookies simulados baseados no exemplo
     */
    private static generateCookies(): string {
        const abck = this.generateRandomString(500);
        const xpExpId = this.generateUUID();
        const bmSz = this.generateRandomString(100);
        const xpSession = `s%3A${this.generateRandomString(50)}.${this.generateRandomString(100)}`;

        return `_abck=${abck}; _xp_exp_id=${xpExpId}; bm_sz=${bmSz}; _xp_session=${xpSession}`;
    }

    /**
     * Gera string aleatória
     */
    private static generateRandomString(length: number): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~-';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Gera UUID v4
     */
    private static generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Verifica se o token está expirado
     */
    private static isTokenExpired(tokenData: TokenData): boolean {
        return TokenManager.isTokenExpired(tokenData);
    }

    /**
     * Parseia a resposta da API LATAM
     */
    private static parseOffersResponse(data: LatamApiResponse | string): Flight[] {
        try {
            // Se data já é um objeto, usa diretamente
            const parsedData: LatamApiResponse = typeof data === 'string' ? JSON.parse(data) : data;

            console.log('📊 Resposta da API LATAM:', {
                hasContent: !!parsedData.content,
                contentCount: parsedData.content?.length || 0,
                totalElements: parsedData.totalElements,
                totalPages: parsedData.totalPages
            });

            // Processa o array content
            if (parsedData.content && Array.isArray(parsedData.content)) {
                const flights = parsedData.content.map((offer: LatamFlightOffer, index: number) =>
                    this.transformToFlight(offer, index)
                );
                console.log(`✅ ${flights.length} voos transformados de content`);
                return flights;
            }

            console.warn('⚠️ Estrutura de resposta não reconhecida:', parsedData);
            return [];

        } catch (error) {
            console.error('❌ Erro ao parsear resposta:', error);
            console.error('📦 Dados que causaram erro:', typeof data === 'string' ? data.substring(0, 500) : 'Objeto não string');
            return [];
        }
    }

    /**
     * Transforma oferta da LATAM em Flight
     */
    private static transformToFlight(offer: LatamFlightOffer, index: number): Flight {
        const summary = offer.summary;

        console.log('📋 PROCESSANDO SUMMARY:', {
            airline: summary.airline,
            flightCode: summary.flightCode,
            origin: summary.origin?.iataCode,
            destination: summary.destination?.iataCode,
            duration: summary.duration,
            brands: summary.brands?.length
        });

        // Calcula preços corretamente
        const milesPrice = summary.brands?.[0]?.price?.amount ?? 0;
        const cashPrice = (summary.brands?.[0]?.priceWithOutTax?.amount ?? 0) + (summary.brands?.[0]?.taxes?.amount ?? 0);

        console.log('💰 PREÇOS CALCULADOS:', { milesPrice, cashPrice });

        // Calcula número de paradas baseado no itinerary
        const stopOvers = offer.summary.stopOvers || 0;

        // Formata duração do summary
        const totalDurationFormatted = this.formatDuration(summary.duration);

        // Extrai horários do summary
        const departureTime = summary.origin?.departureTime ||
            this.extractTime(summary.origin?.departure || '');
        const arrivalTime = summary.destination?.arrivalTime ||
            this.extractTime(summary.destination?.arrival || '');

        // Determina a classe baseada na primeira brand
        const flightClass = offer.brands?.[0]?.cabin?.label || 'Econômica';

        // Determina a airline
        const airline = this.convertAirlineType(summary.airline || 'LATAM');

        // Gera sellers mockados
        const sellers = this.generateMockSellers(index);

        const flight: Flight = {
            id: `flight-${index}-${Date.now()}`,
            airline,
            stopOvers,
            flightNumber: summary.flightCode,
            origin: summary.origin?.iataCode || '',
            originCity: summary.origin?.city || '',
            destination: summary.destination?.iataCode || '',
            destinationCity: summary.destination?.city || '',
            departure: summary.origin?.departure || '',
            arrival: summary.destination?.arrival || '',
            departureTime,
            arrivalTime,
            duration: totalDurationFormatted,
            durationMinutes: summary.duration,
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

        console.log(`✈️ VOO ${index} CRIADO:`, {
            id: flight.id,
            airline: flight.airline,
            route: `${flight.origin} → ${flight.destination}`,
            price: flight.cashPrice
        });

        return flight;
    }

    /**
     * Extrai horário da string de data
     */
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

    /**
     * Formata duração em minutos para string legível
     */
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

    /**
     * Gera sellers mockados usando os sellers reais do mockData
     */
    private static generateMockSellers(flightIndex: number): string[] {
        // Lista de IDs de sellers disponíveis do mockData
        const availableSellerIds = [
            "seller-0-0", "seller-0-1", "seller-1-0", "seller-2-0",
            "seller-2-1", "seller-2-2", "seller-3-0", "seller-3-1",
            "seller-4-0", "seller-4-1", "seller-4-2", "seller-4-3"
        ];

        // Define quantos sellers este voo terá (1-3)
        const sellerCounts = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3];
        const count = sellerCounts[flightIndex % sellerCounts.length] || 1;

        // Seleciona sellers baseado no índice do voo
        const selectedSellers: string[] = [];

        for (let i = 0; i < count && i < availableSellerIds.length; i++) {
            const sellerIndex = (flightIndex + i) % availableSellerIds.length;
            const sellerId = availableSellerIds[sellerIndex];

            if (!selectedSellers.includes(sellerId)) {
                selectedSellers.push(sellerId);
            }
        }

        // Garante pelo menos 1 seller
        if (selectedSellers.length === 0 && availableSellerIds.length > 0) {
            selectedSellers.push(availableSellerIds[0]);
        }

        return selectedSellers;
    }

    /**
     * Converte string de airline para tipo específico
     */
    private static convertAirlineType(airline: string): 'LATAM' | 'GOL' | 'AZUL' {
        const upperAirline = airline.toUpperCase();
        if (upperAirline.includes('GOL')) return 'GOL';
        if (upperAirline.includes('AZUL')) return 'AZUL';
        return 'LATAM'; // Default para LATAM
    }

    /**
     * Método auxiliar para debug - busca token e ofertas em sequência
     */
    static async debugSearch(searchParams: FlightSearch): Promise<{ token: string; flights: Flight[] }> {
        console.log('🐛 DEBUG: Iniciando busca completa...');

        try {
            // 1. Obter token
            const token = await this.getUrlSearchToken(searchParams);
            console.log('✅ DEBUG: Token obtido com sucesso');

            // 2. Buscar ofertas
            const flights = await this.getFlightApiOffersWithFetch(searchParams, token);
            console.log('✅ DEBUG: Ofertas obtidas com sucesso');

            return { token, flights };

        } catch (error) {
            console.error('❌ DEBUG: Erro na busca completa:', error);
            throw error;
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