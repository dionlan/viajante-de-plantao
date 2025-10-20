import { TokenManager, UrlBuilder } from "../lib/api-utils";
import { FlightSearch, Flight, LatamApiResponse, LatamFlightOffer } from "../lib/types";


// Interface para headers
interface RequestHeaders {
    [key: string]: string;
}

export class FlightSearchService {
    private static readonly USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36';
    private static readonly RAILWAY_PROXY_URL = process.env.NEXT_PUBLIC_RAILWAY_PROXY_URL;

    // MÉTODO PRINCIPAL - USA RAILWAY POR PADRÃO
    static async searchFlights(searchParams: FlightSearch): Promise<Flight[]> {
        console.log('🚀 Iniciando busca de voos...');
        console.log('📋 Parâmetros recebidos:', searchParams);

        // DEBUG: Log das variáveis de ambiente
        console.log('🔍 DEBUG - Variáveis de ambiente:');
        console.log('   NEXT_PUBLIC_RAILWAY_PROXY_URL:', process.env.NEXT_PUBLIC_RAILWAY_PROXY_URL);
        console.log('   NODE_ENV:', process.env.NODE_ENV);

        // PRIORIDADE: Usa Railway Proxy se estiver configurado
        if (this.RAILWAY_PROXY_URL) {
            console.log('📡 Usando Railway Proxy:', this.RAILWAY_PROXY_URL);
            try {
                const results = await this.searchFlightsWithRailway(searchParams);
                console.log(`✅ Railway retornou ${results.length} voos`);
                return results;
            } catch (error) {
                console.error('❌ Erro no Railway Proxy:', error);
                console.log('🔄 Fallback para busca direta...');
                // Fallback para busca direta
                return await this.searchFlightsDirect(searchParams);
            }
        } else {
            // Fallback: busca direta se Railway não estiver configurado
            console.log('🌐 Railway não configurado, usando busca direta');
            return await this.searchFlightsDirect(searchParams);
        }
    }

    // BUSCA VIA RAILWAY PROXY (MÉTODO PRINCIPAL) - AJUSTADO
    private static async searchFlightsWithRailway(searchParams: FlightSearch): Promise<Flight[]> {
        console.log('📨 Enviando busca para Railway Proxy...');

        const { origin, destination, departureDate, returnDate, passengerDetails } = searchParams;

        // Extrai códigos dos aeroportos
        const extractCode = (location: string): string => {
            if (!location) return '';
            const match = location.match(/\(([A-Z]{3})\)/);
            return match ? match[1] : (/^[A-Z]{3}$/.test(location) ? location : location.slice(-3));
        };

        const originCode = extractCode(origin);
        const destinationCode = extractCode(destination);

        if (!originCode || !destinationCode) {
            throw new Error('Códigos de aeroporto inválidos');
        }

        // Constrói query string para GET
        const queryParams = new URLSearchParams({
            adult: (passengerDetails.adults || 1).toString(),
            infant: (passengerDetails.babies || 0).toString(),
            cabinType: 'Economy',
            outFlightDate: 'null',
            outOfferId: 'null',
            inFlightDate: 'null',
            inOfferId: 'null',
            redemption: 'true',
            destination: destinationCode,
            outFrom: departureDate,
            origin: originCode,
            sort: 'RECOMMENDED',
            inFrom: returnDate || 'null',
            child: (passengerDetails.children || 0).toString()
        });

        const railwayUrl = `${this.RAILWAY_PROXY_URL}/api/search/bff/air-offers/v2/offers/search?${queryParams}`;

        console.log('🔗 Railway URL completa:', railwayUrl);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos para as duas etapas

        try {
            console.log('🌐 Fazendo request GET para Railway...');
            const response = await fetch(railwayUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            console.log('📊 Status do Railway:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erro do Railway:', response.status, errorText);
                throw new Error(`Railway retornou ${response.status}: ${errorText.substring(0, 200)}`);
            }

            const result = await response.json();
            console.log('✅ Resposta do Railway recebida com sucesso');

            if (result.success && result.content) {
                console.log('🎯 Processando dados do Railway...');
                if (Array.isArray(result.content)) {
                    console.log(`✅ ${result.content.length} voos recebidos do Railway`);
                    return result.content;
                } else {
                    throw new Error('Formato de dados inválido do Railway');
                }
            }

            console.error('❌ Erro na resposta do Railway:', result.error);
            throw new Error(result.error || 'Erro na resposta do Railway');

        } catch (error) {
            clearTimeout(timeoutId);

            if (error === 'AbortError') {
                console.error('⏰ Timeout na conexão com o Railway (60s)');
                throw new Error('Timeout na conexão com o Railway');
            }

            console.error('💥 Erro na comunicação com Railway:', error);
            throw error;
        }
    }

    // BUSCA DIRETA (FALLBACK) - MANTIDO PARA COMPATIBILIDADE
    private static async searchFlightsDirect(searchParams: FlightSearch): Promise<Flight[]> {
        console.log('✈️ Usando busca direta (fallback)...');

        let tokenData = TokenManager.getToken();

        console.log('🔄 Obtendo novo token...');
        await this.getUrlSearchToken(searchParams);
        tokenData = TokenManager.getToken();

        if (!tokenData) {
            throw new Error('Não foi possível obter o token de busca');
        }

        return await this.getFlightApiOffersWithFetch(searchParams, tokenData.searchToken);
    }

    // ... (MANTENHA TODOS OS OUTROS MÉTODOS EXISTENTES - getUrlSearchToken, getFlightApiOffersWithFetch, etc.)
    // MÉTODOS ORIGINAIS (para fallback) - MANTIDOS
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

        const response = await fetch('/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: searchUrl,
                method: 'GET',
                headers: headers,
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
    }

    private static async getFlightApiOffersWithFetch(searchParams: FlightSearch, searchToken: string): Promise<Flight[]> {
        console.log('🔍 Buscando ofertas com fetch...');

        const offersUrl = UrlBuilder.buildApiOffersUrl(searchParams);
        const expId = this.generateUUID();
        const refererUrl = UrlBuilder.getRefererUrl(searchParams, expId);

        console.log('🔗 URL de ofertas:', offersUrl);
        console.log('🔗 Referer URL com exp_id:', refererUrl);

        const sessionId = this.generateUUID();
        const requestId = this.generateUUID();
        const trackId = this.generateUUID();

        const refererWithExpId = `${refererUrl}&exp_id=${expId}`;

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
            'Cookie': this.generateCookies()
        };

        console.log('📋 Headers configurados:', Object.keys(headers).length, 'headers');

        const response = await fetch('/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: offersUrl,
                method: 'GET',
                headers: headers,
                useFetch: true
            }),
        });

        if (!response.ok) {
            throw new Error(`Erro na busca de ofertas: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            console.error('❌ Erro na resposta da API:', result.error);

            if (result.error?.includes('token') || result.error?.includes('auth') || result.error?.includes('400')) {
                console.log('🔄 Possível problema com token, tentando renovar...');
                TokenManager.clearToken();
                return this.searchFlightsDirect(searchParams);
            }

            throw new Error(result.error || 'Erro na busca de ofertas');
        }

        console.log('✅ Busca direta concluída com sucesso');
        return this.parseOffersResponse(result.data);
    }

    // MÉTODOS AUXILIARES - MANTIDOS
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

    private static parseOffersResponse(data: string): Flight[] {
        try {
            const parsedData: LatamApiResponse = JSON.parse(data);

            console.log('📊 Resposta da API LATAM:', {
                hasContent: !!parsedData.content,
                contentCount: parsedData.content?.length || 0,
                totalElements: parsedData.totalElements,
                totalPages: parsedData.totalPages
            });

            if (parsedData.content && Array.isArray(parsedData.content)) {
                const flights = parsedData.content.map((offer: LatamFlightOffer, index: number) =>
                    this.transformToFlight(offer, index)
                );
                console.log(`✅ ${flights.length} voos transformados`);
                return flights;
            }

            console.warn('⚠️ Estrutura de resposta não reconhecida');
            return [];

        } catch (error) {
            console.error('❌ Erro ao parsear resposta:', error);
            console.error('📦 Dados que causaram erro:', data.substring(0, 500));
            return [];
        }
    }

    private static transformToFlight(offer: LatamFlightOffer, index: number): Flight {
        const summary = offer.summary;

        const milesPrice = summary.brands?.[0]?.price?.amount ?? 0;
        const cashPrice = (summary.brands?.[0]?.priceWithOutTax?.amount ?? 0) + (summary.brands?.[0]?.taxes?.amount ?? 0);
        const stopOvers = offer.summary.stopOvers || 0;
        const totalDurationFormatted = this.formatDuration(summary.duration);

        const departureTime = summary.origin.departureTime ||
            this.extractTime(summary.origin.departure || '');
        const arrivalTime = summary.destination.arrivalTime ||
            this.extractTime(summary.destination.arrival || '');

        const flightClass = offer.brands?.[0]?.cabin?.label || 'Econômica';
        const airline = this.convertAirlineType(summary.airline || 'LATAM');
        const sellers = this.generateMockSellers(index);

        return {
            id: `flight-${index}-${Date.now()}`,
            airline,
            stopOvers,
            flightNumber: summary.flightCode,
            origin: summary.origin.iataCode,
            originCity: summary.origin.city,
            destination: summary.destination.iataCode,
            destinationCity: summary.destination.city,
            departure: summary.origin.departure || '',
            arrival: summary.destination.arrival || '',
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
}