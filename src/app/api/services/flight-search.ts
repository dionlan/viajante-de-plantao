import { FlightSearch, TokenData, LatamApiResponse, Flight, LatamFlightOffer } from '@/lib/types';
import { TokenManager, UrlBuilder } from '@/lib/api-utils';

interface RequestHeaders {
    [key: string]: string;
}

export class FlightSearchService {
    private static readonly USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

    static async getUrlSearchToken(searchParams: FlightSearch): Promise<string> {
        console.log('🔄 Obtendo novo searchToken...');

        const searchUrl = UrlBuilder.buildSearchUrl(searchParams);
        console.log('🔗 URL de busca para token:', searchUrl);

        const headers: RequestHeaders = {
            'User-Agent': this.USER_AGENT,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        };

        const response = await fetch('/api/proxy', {
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
            const errorText = await response.text();
            console.error('❌ Erro na requisição do token:', response.status, errorText);
            throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
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

    static async searchFlights(searchParams: FlightSearch): Promise<Flight[]> {
        console.log('✈️ Iniciando busca de voos...', searchParams);

        // Sempre obtém novo token para garantir frescor
        await this.getUrlSearchToken(searchParams);
        const tokenData = TokenManager.getToken();

        if (!tokenData) {
            throw new Error('Não foi possível obter o token de busca');
        }

        return await this.getFlightApiOffersWithFetch(searchParams, tokenData.searchToken);
    }

    private static async getFlightApiOffersWithFetch(searchParams: FlightSearch, searchToken: string): Promise<Flight[]> {
        console.log('🔍 Buscando ofertas com fetch...');

        const offersUrl = UrlBuilder.buildApiOffersUrl(searchParams);
        const expId = this.generateUUID();
        const refererUrl = UrlBuilder.getRefererUrl(searchParams, expId);

        console.log('🔗 URL de ofertas:', offersUrl);

        const sessionId = this.generateUUID();
        const requestId = this.generateUUID();
        const trackId = this.generateUUID();

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
            'Cache-Control': 'no-cache'
        };

        console.log('📋 Headers configurados:', Object.keys(headers).length, 'headers');

        const response = await fetch('/api/proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: offersUrl,
                method: 'GET',
                headers: headers
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Erro na busca de ofertas:', response.status, errorText);

            if (response.status === 400 || response.status === 403) {
                console.log('🔄 Possível problema com token, tentando renovar...');
                TokenManager.clearToken();
                return this.searchFlights(searchParams);
            }

            throw new Error(`Erro na busca de ofertas: ${response.status} - ${errorText}`);
        }

        const result = await response.json();

        if (!result.success) {
            console.error('❌ Erro na resposta da API:', result.error);

            if (result.error?.includes('token') || result.error?.includes('auth') || result.error?.includes('400')) {
                console.log('🔄 Possível problema com token, tentando renovar...');
                TokenManager.clearToken();
                return this.searchFlights(searchParams);
            }

            throw new Error(result.error || 'Erro na busca de ofertas');
        }

        console.log('✅ Busca concluída com sucesso');
        return this.parseOffersResponse(result.data);
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
                console.log(`✅ ${flights.length} voos transformados de content`);
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