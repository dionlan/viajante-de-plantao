// lib/api-utils.ts
import { TokenData, ApiSearchParams, FlightSearch } from './types';

// Storage em memória para o servidor
const tokenStorage = new Map<string, TokenData>();

export class TokenManager {
    private static readonly TOKEN_KEY = 'latam_search_token';
    private static readonly TOKEN_TTL = 58 * 60 * 1000; // 58 minutos

    static getToken(): TokenData | null {
        if (typeof window === 'undefined') {
            return tokenStorage.get(this.TOKEN_KEY) || null;
        } else {
            try {
                const tokenStr = localStorage.getItem(this.TOKEN_KEY);
                return tokenStr ? JSON.parse(tokenStr) : null;
            } catch {
                return null;
            }
        }
    }

    static setToken(token: string): void {
        // build tokenData and assert type to satisfy TokenData signature
        const tokenData = {
            searchToken: token,
            timestamp: Date.now(),
            exp: Date.now() + this.TOKEN_TTL
        } as unknown as TokenData;

        if (typeof window === 'undefined') {
            tokenStorage.set(this.TOKEN_KEY, tokenData);
        } else {
            try {
                localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokenData));
            } catch (error) {
                console.warn('Falha ao salvar token no localStorage:', error);
                // Fallback para sessionStorage
                try {
                    sessionStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokenData));
                } catch {
                    // Último fallback: memory storage
                    tokenStorage.set(this.TOKEN_KEY, tokenData);
                }
            }
        }
    }

    static isTokenExpired(tokenData: TokenData): boolean {
        return Date.now() > tokenData.exp;
    }

    static clearToken(): void {
        if (typeof window === 'undefined') {
            tokenStorage.delete(this.TOKEN_KEY);
        } else {
            try {
                localStorage.removeItem(this.TOKEN_KEY);
                sessionStorage.removeItem(this.TOKEN_KEY);
            } catch (error) {
                console.warn('Falha ao remover token:', error);
            }
            tokenStorage.delete(this.TOKEN_KEY);
        }
    }

    static getTokenAge(tokenData: TokenData): number {
        const ts = Number(tokenData.timestamp ?? 0);
        return Date.now() - ts;
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

        const extractCode = (location: string): string => {
            if (!location) return '';

            const match = location.match(/\(([A-Z]{3})\)/);
            if (match) return match[1];

            if (/^[A-Z]{3}$/.test(location)) return location;

            return location.length >= 3 ? location.slice(-3).toUpperCase() : location.toUpperCase();
        };

        const originCode = extractCode(origin);
        const destinationCode = extractCode(destination);

        if (!originCode || originCode.length !== 3) {
            throw new Error(`Código de origem inválido: ${origin}`);
        }

        if (!destinationCode || destinationCode.length !== 3) {
            throw new Error(`Código de destino inválido: ${destination}`);
        }

        const params: ApiSearchParams = {
            origin: originCode,
            outbound: this.formatDateForApi(departureDate),
            destination: destinationCode,
            adt: Math.max(1, passengerDetails.adults || 1),
            chd: Math.max(0, passengerDetails.children || 0),
            inf: Math.max(0, passengerDetails.babies || 0),
            trip: tripType === 'roundtrip' ? 'RT' : 'OW',
            cabin: 'Economy',
            redemption: false,
            sort: 'DEPARTURE_DATE'
        };

        if (tripType === 'roundtrip' && returnDate) {
            params.inbound = this.formatDateForApi(returnDate);
        }

        return params;
    }

    static buildApiOffersUrl(searchParams: FlightSearch): string {
        const { origin, destination, departureDate, returnDate, tripType, passengerDetails } = searchParams;

        const extractCode = (location: string): string => {
            if (!location) return '';
            const match = location.match(/\(([A-Z]{3})\)/);
            return match ? match[1] : (/^[A-Z]{3}$/.test(location) ? location : location.slice(-3).toUpperCase());
        };

        const originCode = extractCode(origin);
        const destinationCode = extractCode(destination);

        const params = {
            inOfferId: 'null',
            origin: originCode,
            outFrom: this.formatDateForSearch(departureDate),
            inFlightDate: 'null',
            outFlightDate: 'null',
            adult: Math.max(1, passengerDetails.adults || 1),
            redemption: 'true',
            outOfferId: 'null',
            infant: Math.max(0, passengerDetails.babies || 0),
            inFrom: tripType === 'roundtrip' && returnDate ? this.formatDateForSearch(returnDate) : 'null',
            sort: 'DEPARTURE_DATE',
            cabinType: 'Economy',
            child: Math.max(0, passengerDetails.children || 0),
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

    private static formatDateForApi(dateString: string): string {
        if (!dateString) return '';

        try {
            // Tenta parsear a data
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                // Se não conseguir parsear, assume formato YYYY-MM-DD
                return dateString.includes('T') ? dateString : `${dateString}T15:00:00.000Z`;
            }
            return date.toISOString();
        } catch {
            return dateString.includes('T') ? dateString : `${dateString}T15:00:00.000Z`;
        }
    }

    private static formatDateForSearch(dateString: string): string {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString; // Retorna como está se não for uma data válida
            }
            return date.toISOString().split('T')[0]; // YYYY-MM-DD
        } catch {
            return dateString.includes('T') ? dateString.split('T')[0] : dateString;
        }
    }

    static validateSearchParams(searchParams: FlightSearch): void {
        const errors: string[] = [];

        if (!searchParams.origin) errors.push('Origem é obrigatória');
        if (!searchParams.destination) errors.push('Destino é obrigatório');
        if (!searchParams.departureDate) errors.push('Data de ida é obrigatória');

        if (searchParams.tripType === 'roundtrip' && !searchParams.returnDate) {
            errors.push('Data de volta é obrigatória para voos de ida e volta');
        }

        const totalPassengers = (searchParams.passengerDetails.adults || 0) +
            (searchParams.passengerDetails.children || 0) +
            (searchParams.passengerDetails.babies || 0);

        if (totalPassengers === 0) errors.push('Pelo menos um passageiro é obrigatório');
        if (totalPassengers > 9) errors.push('Máximo de 9 passageiros permitido');

        if (errors.length > 0) {
            throw new Error(`Parâmetros inválidos: ${errors.join(', ')}`);
        }
    }
}