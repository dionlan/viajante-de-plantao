// lib/api-utils.ts
import { FlightSearch, SearchType } from './types';

export class UrlBuilder {

    /**
     * Formata data como início do dia BRT (00:00 BRT = 03:00 UTC).
     * Para milhas, a LATAM usa 12:00 UTC no referer — vamos manter 03:00 UTC
     * para ambas, porque a URL de destino é a mesma.
     */
    private static toLatamDate(dateStr: string, hour = 3): string {
        const dateOnly = dateStr.split('T')[0];
        return `${dateOnly}T${String(hour).padStart(2, '0')}:00:00.000Z`;
    }

    /**
     * ✅ Gera a URL da página de busca (/oferta-voos).
     * O `redemption` muda conforme o tipo de busca.
     */
    static buildSearchUrl(searchParams: FlightSearch): string {
        const baseUrl = 'https://www.latamairlines.com/br/pt/oferta-voos';
        const { origin, destination, departureDate, returnDate, tripType, passengerDetails } = searchParams;

        const searchType: SearchType = searchParams.searchType ?? 'cash';
        const isMiles = searchType === 'miles';

        //const originCity = this.extractCityCode(origin);
        //const destinationCity = this.extractCityCode(destination);

        if (!origin || !destination) throw new Error('Códigos inválidos');

        const outbound = this.toLatamDate(departureDate);
        const isRoundTrip = tripType === 'roundtrip' && !!returnDate;
        const inbound = isRoundTrip ? this.toLatamDate(returnDate!) : 'null';

        const params: Record<string, string> = {
            origin: origin,
            outbound,
            destination: destination,
            inbound,
            adt: String(passengerDetails.adults ?? 1),
            chd: String(passengerDetails.children ?? 0),
            inf: String(passengerDetails.babies ?? 0),
            trip: isRoundTrip ? 'RT' : 'OW',
            cabin: 'Economy',
            // ✅ sempre false, pois ele navegará para a área que não requer autenticação
            redemption: 'false',
            sort: 'RECOMMENDED',
        };

        return `${baseUrl}?${new URLSearchParams(params).toString()}`;
    }

    /**
     * ✅ Gera a URL do BFF (/offers/search OU /offers/search/redemption).
     * O path muda conforme o tipo de busca.
     *
     * ⚠️ Usa essa URL apenas para debug ou para o `impers`.
     * O fluxo principal captura a resposta do Chromium, não chama isso.
     */
    static buildApiOffersUrl(searchParams: FlightSearch): string {
        const { origin, destination, departureDate, returnDate, tripType, passengerDetails } = searchParams;

        const searchType: SearchType = searchParams.searchType ?? 'cash';
        const isMiles = searchType === 'miles';

        //const originCity = this.extractCityCode(origin);
        //const destinationCity = this.extractCityCode(destination);
        const isRoundTrip = tripType === 'roundtrip' && !!returnDate;

        const params: Record<string, string> = {
            kayakclickid: 'undefined',
            utm_term: 'undefined',
            destination: destination,
            utm_source: 'undefined',
            inFrom: isRoundTrip ? returnDate! : 'null',
            adult: String(passengerDetails.adults ?? 1),
            infant: String(passengerDetails.babies ?? 0),
            idMetasearch: 'undefined',
            child: String(passengerDetails.children ?? 0),
            locale: 'pt-br',
            utm_medium: 'undefined',
            outFlightDate: 'null',
            outFrom: departureDate.split('T')[0],
            sort: 'RECOMMENDED',
            outOfferId: 'null',
            inFlightDate: 'null',
            utm_campaign: 'undefined',
            origin: origin,
            utm_content: 'undefined',
            // ✅ AQUI: redemption muda
            redemption: isMiles ? 'true' : 'false',
            cabinType: 'Economy',
            inOfferId: 'null',
        };

        // ✅ AQUI: path muda
        const path = isMiles
            ? '/bff/air-offers/v2/offers/search/redemption'
            : '/bff/air-offers/v2/offers/search';

        return `https://www.latamairlines.com${path}?${new URLSearchParams(params).toString()}`;
    }

    static getRefererUrl(searchParams: FlightSearch): string {
        return this.buildSearchUrl(searchParams);
    }
}