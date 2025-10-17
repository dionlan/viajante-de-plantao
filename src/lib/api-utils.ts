import { TokenData, ApiSearchParams, FlightSearch } from './types';

export class TokenManager {
    private static readonly TOKEN_KEY = 'latam_search_token';

    static getToken(): TokenData | null {
        if (typeof window === 'undefined') return null;
        const tokenStr = localStorage.getItem(this.TOKEN_KEY);
        if (!tokenStr) return null;
        try {
            return JSON.parse(tokenStr);
        } catch {
            return null;
        }
    }

    static setToken(token: string): void {
        if (typeof window === 'undefined') return;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const tokenData: TokenData = {
                searchToken: token,
                exp: payload.exp
            };
            localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokenData));
        } catch (error) {
            const tokenData: TokenData = {
                searchToken: token,
                exp: Math.floor(Date.now() / 1000) + 3600
            };
            localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokenData));
        }
    }

    static isTokenExpired(tokenData: TokenData): boolean {
        const now = Math.floor(Date.now() / 1000) + 60;
        return tokenData.exp < now;
    }

    static clearToken(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(this.TOKEN_KEY);
    }
}

export class UrlBuilder {
    static buildSearchUrl(searchParams: FlightSearch): string {
        const baseUrl = 'https://www.latamairlines.com/br/pt/oferta-voos';
        const params = this.buildUrlParams(searchParams);

        const queryString = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                if (value !== undefined && value !== null && value !== 'null') {
                    acc[key] = value.toString();
                }
                return acc;
            }, {} as Record<string, string>)
        ).toString();

        return `${baseUrl}?${queryString}`;
    }

    static buildUrlParams(searchParams: FlightSearch): ApiSearchParams {
        const { origin, destination, departureDate, returnDate, tripType, passengerDetails } = searchParams;

        // Extrai código do aeroporto
        const extractCode = (location: string) => {
            const match = location.match(/\(([A-Z]{3})\)/);
            return match ? match[1] : location;
        };

        // Formata data para o formato LATAM (com encoding correto)
        const formatDate = (dateString: string) => {
            const date = new Date(dateString);
            // Retorna no formato: 2025-10-17T15:00:00.000Z (será encodado automaticamente)
            return `${date.toISOString().split('T')[0]}T15:00:00.000Z`;
        };

        // CORREÇÃO: Usa os nomes exatos do exemplo
        const params: ApiSearchParams = {
            origin: extractCode(origin),
            outbound: formatDate(departureDate),
            destination: extractCode(destination),
            adt: passengerDetails.adults,
            chd: passengerDetails.children,
            inf: passengerDetails.babies,
            trip: tripType === 'roundtrip' ? 'RT' : 'OW',
            cabin: 'Economy',
            redemption: false,
            sort: 'DEPARTURE_DATE'
        };

        // CORREÇÃO: inbound em vez de returnDate
        if (tripType === 'roundtrip' && returnDate) {
            params.inbound = formatDate(returnDate);
        }

        return params;
    }

    static buildApiOffersUrl(searchParams: FlightSearch): string {
        const { origin, destination, departureDate, returnDate, tripType, passengerDetails } = searchParams;

        // Extrai código do aeroporto
        const extractCode = (location: string) => {
            const match = location.match(/\(([A-Z]{3})\)/);
            return match ? match[1] : location;
        };

        // Para a segunda requisição, usa apenas a data no formato YYYY-MM-DD
        const formatDateSimple = (dateString: string) => {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0]; // Apenas YYYY-MM-DD
        };

        const params = {
            inOfferId: 'null',
            origin: extractCode(origin),
            outFrom: formatDateSimple(departureDate), // Data de ida no formato YYYY-MM-DD
            inFlightDate: 'null',
            outFlightDate: 'null',
            adult: passengerDetails.adults,
            redemption: 'true',
            outOfferId: 'null',
            infant: passengerDetails.babies,
            inFrom: tripType === 'roundtrip' && returnDate ? formatDateSimple(returnDate) : 'null', // Data de volta ou 'null'
            sort: 'DEPARTURE_DATE',
            cabinType: 'Economy',
            child: passengerDetails.children,
            destination: extractCode(destination)
        };

        const queryString = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                acc[key] = value !== undefined && value !== null ? value.toString() : 'null';
                return acc;
            }, {} as Record<string, string>)
        ).toString();

        return `https://www.latamairlines.com/bff/air-offers/v2/offers/search?${queryString}`;
    }

    static getRefererUrl(searchParams: FlightSearch, expId?: string): string {
        const baseUrl = this.buildSearchUrl(searchParams);

        // Se fornecido um expId, adiciona ao referer (como no exemplo do curl)
        if (expId) {
            return `${baseUrl}&exp_id=${expId}`;
        }

        return baseUrl;
    }
}