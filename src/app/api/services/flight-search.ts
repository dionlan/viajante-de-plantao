import { FlightSearch, TokenData, LatamApiResponse, Flight, LatamFlightOffer } from '@/lib/types';
import { TokenManager, UrlBuilder } from '@/lib/api-utils';

export class FlightSearchService {

    static async searchFlights(searchParams: FlightSearch): Promise<Flight[]> {
        console.log('✈️ Iniciando busca via Railway...', searchParams);

        try {
            // Extrair códigos dos aeroportos
            const extractCode = (location: string): string => {
                if (!location) return '';
                const match = location.match(/\(([A-Z]{3})\)/);
                return match ? match[1] : location;
            };

            const originCode = extractCode(searchParams.origin);
            const destinationCode = extractCode(searchParams.destination);

            if (!originCode || !destinationCode) {
                throw new Error('Códigos de aeroporto inválidos');
            }

            // Preparar parâmetros para Railway
            const railwayParams = {
                origin: originCode,
                destination: destinationCode,
                outbound: searchParams.departureDate,
                inbound: searchParams.returnDate || searchParams.departureDate,
                adults: searchParams.passengerDetails?.adults || 1,
                children: searchParams.passengerDetails?.children || 0,
                babies: searchParams.passengerDetails?.babies || 0
            };

            console.log('📨 Enviando para Railway...', railwayParams);

            // Fazer requisição para o proxy Railway
            const response = await fetch('/api/railway-proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(railwayParams),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erro na resposta do Railway:', response.status, errorText);
                throw new Error(`Erro no servidor: ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                console.error('❌ Erro do Railway:', result.error);
                throw new Error(result.error || 'Erro na busca de voos');
            }

            console.log('✅ Dados recebidos do Railway');
            console.log('📊 Tipo de dados:', result.metadata?.dataType);

            const flights = this.parseOffersResponse(result.data);

            return flights;

        } catch (error) {
            console.error('💥 Erro na busca:', error);
            throw error;
        }
    }

    private static parseOffersResponse(data: LatamApiResponse): Flight[] {
        try {
            const parsedData: LatamApiResponse = data;

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