import { FlightSearch, TokenData, LatamApiResponse, Flight, LatamFlightOffer } from '@/lib/types';
import { TokenManager, UrlBuilder } from '@/lib/api-utils';

// Interface para headers
interface RequestHeaders {
    [key: string]: string;
}

export class FlightSearchService {
    private static readonly USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

    /**
     * Obtém o token de busca da LATAM usando GET simples
     */
    static async getUrlSearchToken(searchParams: FlightSearch): Promise<string> {
        console.log('🔄 Obtendo novo searchToken...');

        try {
            // Valida parâmetros antes de construir URL
            UrlBuilder.validateSearchParams(searchParams);
        } catch (error) {
            console.error('❌ Parâmetros inválidos:', error);
            throw error;
        }

        // Constrói URL com parâmetros para GET
        const searchParamsUrl = this.buildSearchParamsUrl(searchParams);
        console.log('🔗 Buscando token via GET:', searchParamsUrl);

        try {
            const response = await fetch(searchParamsUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': this.USER_AGENT,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const token = await response.text();

            if (!token || token.startsWith('ERROR:')) {
                throw new Error(token || 'Token não retornado');
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

        let tokenData = TokenManager.getToken();

        // Verifica se tem token válido antes de tentar renovar
        if (tokenData && !TokenManager.isTokenExpired(tokenData)) {
            console.log('🔑 Usando token existente...');
            try {
                return await this.getFlightApiOffers(searchParams, tokenData.searchToken);
            } catch (error) {
                console.log('🔄 Token existente falhou, obtendo novo...');
                TokenManager.clearToken();
            }
        }

        console.log('🔄 Obtendo novo token...');
        await this.getUrlSearchToken(searchParams);

        tokenData = TokenManager.getToken();
        if (!tokenData) {
            throw new Error('Não foi possível obter o token de busca');
        }

        return await this.getFlightApiOffers(searchParams, tokenData.searchToken);
    }

    /**
     * Busca ofertas de voos usando a API da LATAM
     */
    private static async getFlightApiOffers(searchParams: FlightSearch, searchToken: string): Promise<Flight[]> {
        console.log('🔍 Buscando ofertas com token...');

        const offersUrl = UrlBuilder.buildApiOffersUrl(searchParams);
        const expId = this.generateUUID();
        const refererUrl = UrlBuilder.getRefererUrl(searchParams, expId);

        console.log('🔗 URL de ofertas:', offersUrl);

        // Headers otimizados para API LATAM
        const headers: RequestHeaders = {
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'priority': 'u=1, i',
            'referer': `${refererUrl}&exp_id=${expId}`,
            'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': this.USER_AGENT,
            'x-latam-action-name': 'search-result.flightselection.offers-search',
            'x-latam-app-session-id': this.generateUUID(),
            'x-latam-application-country': 'BR',
            'x-latam-application-lang': 'pt',
            'x-latam-application-name': 'web-air-offers',
            'x-latam-application-oc': 'br',
            'x-latam-client-name': 'web-air-offers',
            'x-latam-device-width': '1920',
            'x-latam-request-id': this.generateUUID(),
            'x-latam-search-token': searchToken,
            'x-latam-track-id': this.generateUUID(),
            'Cookie': this.generateCookies()
        };

        console.log('📋 Headers configurados para ofertas');

        try {
            // Usa o proxy para a requisição das ofertas
            const data = await this.makeApiRequest(offersUrl, {
                method: 'GET',
                headers: headers,
                timeout: 20000,
            });

            console.log('✅ Busca de ofertas concluída com sucesso');
            return this.parseOffersResponse(data);

        } catch (error) {
            console.error('❌ Erro na busca de ofertas:', error);

            // Verifica se é erro de autenticação
            const errorMessage = error instanceof Error ? error.message : String(error);
            if (this.isAuthError(errorMessage)) {
                console.log('🔄 Token inválido ou expirado, renovando...');
                TokenManager.clearToken();
                return this.searchFlights(searchParams);
            }

            throw new Error(`Erro na busca de ofertas: ${errorMessage}`);
        }
    }

    /**
     * Faz requisições API através do proxy
     */
    private static async makeApiRequest(url: string, options: {
        method?: string;
        headers?: Record<string, string>;
        body?: any;
        timeout?: number;
    } = {}): Promise<any> {

        const payload = {
            url,
            method: options.method || 'GET',
            headers: options.headers || {},
            body: options.body,
            timeout: options.timeout || 15000
        };

        try {
            const response = await fetch('/api/proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Proxy error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Request failed');
            }

            return result.data;

        } catch (error) {
            console.error('❌ Erro na requisição via proxy:', error);
            throw error;
        }
    }

    /**
     * Constrói URL de parâmetros para GET
     */
    private static buildSearchParamsUrl(searchParams: FlightSearch): string {
        const baseUrl = this.getApiBaseUrl();
        const params = new URLSearchParams();

        // Extrai códigos dos aeroportos
        const extractCode = (location: string): string => {
            if (!location) return '';
            const match = location.match(/\(([A-Z]{3})\)/);
            return match ? match[1] : (/^[A-Z]{3}$/.test(location) ? location : location.slice(-3).toUpperCase());
        };

        params.set('origin', extractCode(searchParams.origin));
        params.set('destination', extractCode(searchParams.destination));
        params.set('outbound', `${searchParams.departureDate}T15:00:00.000Z`);
        params.set('adt', searchParams.passengerDetails.adults.toString());
        params.set('chd', searchParams.passengerDetails.children.toString());
        params.set('inf', searchParams.passengerDetails.babies.toString());
        params.set('trip', searchParams.tripType === 'roundtrip' ? 'RT' : 'OW');
        params.set('cabin', 'Economy');
        params.set('redemption', 'false');
        params.set('sort', 'RECOMMENDED');

        if (searchParams.tripType === 'roundtrip' && searchParams.returnDate) {
            params.set('inbound', `${searchParams.returnDate}T15:00:00.000Z`);
        }

        return `${baseUrl}/api/search?${params.toString()}`;
    }

    /**
     * Obtém base URL dinamicamente
     */
    private static getApiBaseUrl(): string {
        if (typeof window !== 'undefined') {
            return '';
        }
        return process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000';
    }

    /**
     * Verifica se é erro de autenticação
     */
    private static isAuthError(errorMessage: string): boolean {
        return errorMessage.includes('token') ||
            errorMessage.includes('auth') ||
            errorMessage.includes('401') ||
            errorMessage.includes('403') ||
            errorMessage.includes('400');
    }

    // ... (MÉTODOS AUXILIARES - mantém os existentes)

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

    private static parseOffersResponse(data: any): Flight[] {
        try {
            const parsedData: LatamApiResponse = typeof data === 'string' ? JSON.parse(data) : data;

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
            return [];
        }
    }

    private static transformToFlight(offer: LatamFlightOffer, index: number): Flight | null {
        try {
            const summary = offer.summary;

            if (!summary || !summary.origin || !summary.destination) {
                console.warn(`⚠️ Oferta ${index} com estrutura inválida`);
                return null;
            }

            const milesPrice = summary.brands?.[0]?.price?.amount ?? 0;
            const cashPrice = (summary.brands?.[0]?.priceWithOutTax?.amount ?? 0) +
                (summary.brands?.[0]?.taxes?.amount ?? 0);

            const flight: Flight = {
                id: `flight-${index}-${Date.now()}`,
                airline: this.convertAirlineType(summary.airline || 'LATAM'),
                stopOvers: summary.stopOvers || 0,
                flightNumber: summary.flightCode || `LA${index}`,
                origin: summary.origin.iataCode || '',
                originCity: summary.origin.city || '',
                destination: summary.destination.iataCode || '',
                destinationCity: summary.destination.city || '',
                departure: summary.origin.departure || '',
                arrival: summary.destination.arrival || '',
                departureTime: summary.origin.departureTime || this.extractTime(summary.origin.departure || ''),
                arrivalTime: summary.destination.arrivalTime || this.extractTime(summary.destination.arrival || ''),
                duration: this.formatDuration(summary.duration),
                durationMinutes: summary.duration || 0,
                class: offer.brands?.[0]?.cabin?.label || 'Econômica',
                milesPrice,
                cashPrice,
                program: 'latam',
                sellers: this.generateMockSellers(index),
                summary: summary,
                itinerary: offer.itinerary,
                brands: offer.brands,
                totalDurationFormatted: this.formatDuration(summary.duration)
            };

            return flight;

        } catch (error) {
            console.error(`❌ Erro ao transformar oferta ${index}:`, error);
            return null;
        }
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
     * Health check do serviço
     */
    static async healthCheck(): Promise<{ healthy: boolean; message: string }> {
        try {
            const testUrl = `${this.getApiBaseUrl()}/api/search?origin=BSB&destination=GRU&adt=1`;
            const response = await fetch(testUrl, { method: 'GET' });

            return {
                healthy: response.ok,
                message: response.ok ? 'Service healthy' : `HTTP ${response.status}`
            };
        } catch (error) {
            return {
                healthy: false,
                message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    /**
     * Limpa cache
     */
    static clearCache(): void {
        TokenManager.clearToken();
        console.log('🗑️ Cache limpo com sucesso');
    }
}