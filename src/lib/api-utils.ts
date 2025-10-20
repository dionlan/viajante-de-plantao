// lib/api-utils.ts
import { TokenData, ApiSearchParams, FlightSearch } from './types';

// Storage em memória para o servidor
const tokenStorage = new Map<string, TokenData>();

export class TokenManager {
    private static readonly TOKEN_KEY = 'latam_search_token';

    static getToken(): TokenData | null {
        if (typeof window === 'undefined') {
            return tokenStorage.get(this.TOKEN_KEY) || null;
        } else {
            const tokenStr = localStorage.getItem(this.TOKEN_KEY);
            return tokenStr ? JSON.parse(tokenStr) : null;
        }
    }

    static setToken(token: string): void {
        const tokenData: TokenData = {
            searchToken: token,
            exp: Math.floor(Date.now() / 1000) + 3500 // 58 minutos
        };

        if (typeof window === 'undefined') {
            tokenStorage.set(this.TOKEN_KEY, tokenData);
        } else {
            localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokenData));
        }
    }

    static isTokenExpired(tokenData: TokenData): boolean {
        const now = Math.floor(Date.now() / 1000);
        return tokenData.exp < now;
    }

    static clearToken(): void {
        if (typeof window === 'undefined') {
            tokenStorage.delete(this.TOKEN_KEY);
        } else {
            localStorage.removeItem(this.TOKEN_KEY);
        }
    }
}

export class UrlBuilder {
    static validateSearchParams(searchParams: FlightSearch) {
        throw new Error('Method not implemented.');
    }
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

        const params: ApiSearchParams = {
            origin: originCode,
            outbound: `${departureDate}T15:00:00.000Z`,
            destination: destinationCode,
            adt: passengerDetails.adults,
            chd: passengerDetails.children,
            inf: passengerDetails.babies,
            trip: tripType === 'roundtrip' ? 'RT' : 'OW',
            cabin: 'Economy',
            redemption: false,
            sort: 'DEPARTURE_DATE'
        };

        if (tripType === 'roundtrip' && returnDate) {
            params.inbound = `${returnDate}T15:00:00.000Z`;
        }

        return params;
    }

    static buildApiOffersUrl(searchParams: FlightSearch): string {
        const { origin, destination, departureDate, returnDate, tripType, passengerDetails } = searchParams;

        const extractCode = (location: string): string => {
            if (!location) return '';
            const match = location.match(/\(([A-Z]{3})\)/);
            return match ? match[1] : (/^[A-Z]{3}$/.test(location) ? location : location.slice(-3));
        };

        const originCode = extractCode(origin);
        const destinationCode = extractCode(destination);

        const params = {
            inOfferId: 'null',
            origin: originCode,
            outFrom: departureDate,
            inFlightDate: 'null',
            outFlightDate: 'null',
            adult: passengerDetails.adults || 1,
            redemption: 'true',
            outOfferId: 'null',
            infant: passengerDetails.babies || 0,
            inFrom: tripType === 'roundtrip' && returnDate ? returnDate : 'null',
            sort: 'DEPARTURE_DATE',
            cabinType: 'Economy',
            child: passengerDetails.children || 0,
            destination: destinationCode
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
        return expId ? `${baseUrl}&exp_id=${expId}` : baseUrl;
    }
}