// src/services/flight-search.ts
import { UrlBuilder } from '@/lib/api-utils';
import {
    FlightSearch,
    Flight,
    LatamApiResponse,
    LatamFlightOffer,
    SearchType,
} from '@/lib/types';

export class FlightSearchService {
    // ============================================================
    // MÉTODO PRINCIPAL
    // ============================================================
    static async searchFlights(searchParams: FlightSearch): Promise<Flight[]> {

        const searchType: SearchType = searchParams.searchType ?? 'miles';

        console.log('🚀 Iniciando busca de voos...');

        const pageUrl = UrlBuilder.buildSearchUrl(searchParams);
        console.log('🔗 URL de busca:', pageUrl);

        // ✅ Chama a API interna — o farm + impers rodam no servidor
        const response = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: pageUrl,
                searchOffers: true,
                searchType
            }),
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Erro desconhecido na busca');
        }

        console.log('✅ JSON do BFF recebido, tamanho:', result.data.length);
        return this.parseOffersResponse(result.data);
    }

    // ============================================================
    // PARSE DA RESPOSTA
    // ============================================================
    private static parseOffersResponse(data: string): Flight[] {
        try {
            const parsed: LatamApiResponse = JSON.parse(data);

            console.log('📊 Resposta da API LATAM:', {
                hasContent: !!parsed.content,
                contentCount: parsed.content?.length || 0,
                totalElements: parsed.totalElements,
            });

            // ✅ Log dos primeiros 500 caracteres do JSON cru (string)
            console.log(data.substring(0, 10000));

            if (parsed.content && Array.isArray(parsed.content)) {
                const flights = parsed.content.map((offer, index) =>
                    this.transformToFlight(offer, index),
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

    private static transformToFlight(
        offer: LatamFlightOffer,
        index: number,
    ): Flight {
        const summary = offer.summary;

        const milesPrice = summary.brands?.[0]?.price?.amount ?? 0;
        const cashPrice =
            (summary.brands?.[0]?.priceWithOutTax?.amount ?? 0) +
            (summary.brands?.[0]?.taxes?.amount ?? 0);
        const stopOvers = offer.summary.stopOvers || 0;
        const totalDurationFormatted = this.formatDuration(summary.duration);

        const departureTime =
            summary.origin.departureTime ||
            this.extractTime(summary.origin.departure || '');
        const arrivalTime =
            summary.destination.arrivalTime ||
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
            summary,
            itinerary: offer.itinerary,
            brands: offer.brands,
            totalDurationFormatted,
        };
    }

    private static extractTime(dateTimeString: string): string {
        if (!dateTimeString) return '';
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            });
        } catch {
            return '';
        }
    }

    private static formatDuration(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
        if (hours > 0) return `${hours}h`;
        return `${mins}m`;
    }

    private static generateMockSellers(flightIndex: number): string[] {
        const availableSellerIds = [
            'seller-0-0', 'seller-0-1', 'seller-1-0', 'seller-2-0',
            'seller-2-1', 'seller-2-2', 'seller-3-0', 'seller-3-1',
            'seller-4-0', 'seller-4-1', 'seller-4-2', 'seller-4-3',
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

    private static convertAirlineType(
        airline: string,
    ): 'LATAM' | 'GOL' | 'AZUL' {
        const upperAirline = airline.toUpperCase();
        if (upperAirline.includes('GOL')) return 'GOL';
        if (upperAirline.includes('AZUL')) return 'AZUL';
        return 'LATAM';
    }
}