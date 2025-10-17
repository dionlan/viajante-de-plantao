import { FlightSearch, TokenData, LatamApiResponse, Flight, LatamFlightOffer } from '@/lib/types';
import { TokenManager, UrlBuilder } from '@/lib/api-utils';

// Interface para headers
interface RequestHeaders {
    [key: string]: string;
}

export class FlightSearchService {
    private static readonly USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36';

    static async getUrlSearchToken(searchParams: FlightSearch): Promise<string> {
        console.log('🔄 Obtendo novo searchToken...');

        const searchUrl = UrlBuilder.buildSearchUrl(searchParams);
        console.log('🔗 URL de busca para token:', searchUrl);

        const headers: RequestHeaders = {
            'User-Agent': this.USER_AGENT,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
        };

        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: searchUrl,
                    method: 'GET',
                    headers: headers,
                    useFetch: true, // ⬅️ GARANTIR que está true
                    extractToken: true
                }),
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Erro desconhecido na requisição');
            }

            const token = result.data;
            console.log('✅ SearchToken obtido:', token.substring(0, 50) + '...');

            TokenManager.setToken(token);
            return token;
        } catch (error) {
            console.error('❌ Erro ao obter token:', error);
            throw new Error(`Falha ao obter token: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
    }

    static async searchFlights(searchParams: FlightSearch): Promise<Flight[]> {
        console.log('✈️ Iniciando busca de voos...', searchParams);

        try {
            let tokenData = TokenManager.getToken();

            // Sempre obtém novo token para garantir frescor
            console.log('🔄 Obtendo novo token...');
            await this.getUrlSearchToken(searchParams);
            tokenData = TokenManager.getToken();

            if (!tokenData) {
                throw new Error('Não foi possível obter o token de busca');
            }

            return await this.getFlightApiOffersWithFetch(searchParams, tokenData.searchToken);
        } catch (error) {
            console.error('❌ Erro na busca de voos:', error);
            throw error;
        }
    }

    private static async getFlightApiOffersWithFetch(searchParams: FlightSearch, searchToken: string): Promise<Flight[]> {
        console.log('🔍 Buscando ofertas com fetch...');

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

        // Headers simplificados - REMOVA COOKIES PROBLEMÁTICOS
        const headers: RequestHeaders = {
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'priority': 'u=1, i',
            'referer': refererWithExpId,
            'sec-ch-ua': '"Google Chrome";v="141", "Not-A.Brand";v="8", "Chromium";v="141"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
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
            // REMOVA cookies problemáticos inicialmente
            // 'Cookie': this.generateCookies()
        };

        console.log('📋 Headers configurados:', Object.keys(headers).length, 'headers');

        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: offersUrl,
                    method: 'GET',
                    headers: headers,
                    useFetch: true // ⬅️ CRÍTICO para Vercel
                }),
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();

            if (!result.success) {
                console.error('❌ Erro na resposta da API:', result.error);

                // Tenta renovar token se houver problema de auth
                if (result.error?.includes('token') || result.error?.includes('auth') || result.error?.includes('400') || result.error?.includes('401')) {
                    console.log('🔄 Possível problema com token, tentando renovar...');
                    TokenManager.clearToken();
                    // Tenta apenas uma vez para evitar loop
                    return this.searchFlights(searchParams);
                }

                throw new Error(result.error || 'Erro na busca de ofertas');
            }

            console.log('✅ Busca concluída com sucesso');

            if (!result.data) {
                throw new Error('Resposta vazia da API');
            }

            return this.parseOffersResponse(result.data);

        } catch (error) {
            console.error('❌ Erro na busca de ofertas:', error);

            // Se for erro de token, tenta renovar uma vez
            if (error instanceof Error && (
                error.message.includes('token') ||
                error.message.includes('auth') ||
                error.message.includes('401') ||
                error.message.includes('400')
            )) {
                console.log('🔄 Tentando renovar token após erro...');
                TokenManager.clearToken();
                return this.searchFlights(searchParams);
            }

            throw error;
        }
    }

    // REMOVA cookies problemáticos inicialmente
    /*
    private static generateCookies(): string {
        const abck = this.generateRandomString(500);
        const xpExpId = this.generateUUID();
        const bmSz = this.generateRandomString(100);
        const xpSession = `s%3A${this.generateRandomString(50)}.${this.generateRandomString(100)}`;

        return `_abck=${abck}; _xp_exp_id=${xpExpId}; bm_sz=${bmSz}; _xp_session=${xpSession}`;
    }
    */

    private static generateRandomString(length: number): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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

    private static isTokenExpired(tokenData: TokenData): boolean {
        return TokenManager.isTokenExpired(tokenData);
    }

    private static parseOffersResponse(data: string): Flight[] {
        try {
            // Verifica se data é válida
            if (!data || typeof data !== 'string') {
                console.warn('⚠️ Dados de resposta inválidos');
                return [];
            }

            const parsedData: LatamApiResponse = JSON.parse(data);

            console.log('📊 Resposta da API LATAM:', {
                hasContent: !!parsedData.content,
                contentCount: parsedData.content?.length || 0,
                totalElements: parsedData.totalElements,
                totalPages: parsedData.totalPages
            });

            // Processa o array content
            if (parsedData.content && Array.isArray(parsedData.content)) {
                const flights = parsedData.content
                    .map((offer: LatamFlightOffer, index: number) => this.transformToFlight(offer, index))
                    .filter(flight => flight !== null); // Filtra voos inválidos

                console.log(`✅ ${flights.length} voos transformados de content`);
                return flights;
            }

            console.warn('⚠️ Estrutura de resposta não reconhecida ou sem conteúdo');
            return [];

        } catch (error) {
            console.error('❌ Erro ao parsear resposta:', error);
            console.error('📦 Dados que causaram erro:', data?.substring(0, 500) || 'Dados vazios');
            return [];
        }
    }

    private static transformToFlight(offer: LatamFlightOffer, index: number): Flight | null {
        try {
            const summary = offer.summary;

            if (!summary) {
                console.warn(`⚠️ Offer ${index} sem summary`);
                return null;
            }

            // Calcula preços corretamente
            const milesPrice = summary.brands?.[0]?.price?.amount ?? 0;
            const cashPrice = (summary.brands?.[0]?.priceWithOutTax?.amount ?? 0) + (summary.brands?.[0]?.taxes?.amount ?? 0);

            // Calcula número de paradas baseado no itinerary
            const stopOvers = offer.summary.stopOvers || 0;

            // Formata duração do summary
            const totalDurationFormatted = this.formatDuration(summary.duration);

            // Extrai horários do summary
            const departureTime = summary.origin.departureTime ||
                this.extractTime(summary.origin.departure || '');
            const arrivalTime = summary.destination.arrivalTime ||
                this.extractTime(summary.destination.arrival || '');

            // Determina a classe baseada na primeira brand
            const flightClass = offer.brands?.[0]?.cabin?.label || 'Econômica';

            // Determina a airline
            const airline = this.convertAirlineType(summary.airline || 'LATAM');

            // Gera sellers mockados
            const sellers = this.generateMockSellers(index);

            return {
                id: `flight-${index}-${Date.now()}`,
                airline,
                stopOvers,
                flightNumber: summary.flightCode || `UNKNOWN-${index}`,
                origin: summary.origin?.iataCode || 'UNK',
                originCity: summary.origin?.city || 'Cidade desconhecida',
                destination: summary.destination?.iataCode || 'UNK',
                destinationCity: summary.destination?.city || 'Cidade desconhecida',
                departure: summary.origin?.departure || '',
                arrival: summary.destination?.arrival || '',
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
                itinerary: offer.itinerary || [],
                brands: offer.brands || [],
                totalDurationFormatted
            };
        } catch (error) {
            console.error(`❌ Erro ao transformar voo ${index}:`, error);
            return null;
        }
    }

    // ... mantém os métodos extractTime, formatDuration, generateMockSellers, convertAirlineType
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
}