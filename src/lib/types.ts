import { LucideIcon } from "lucide-react";

export interface FlightSearch {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate: string;
    passengers: number;
    program: 'all' | 'latam' | 'gol' | 'azul';
    tripType: 'oneway' | 'roundtrip';
    passengerDetails: {
        adults: number;
        children: number;
        babies: number;
    }
}

export interface Flight {
    id: string;
    airline: 'LATAM' | 'GOL' | 'AZUL';
    stopOvers: number;
    flightNumber: string;
    origin: string;
    originCity: string;
    destination: string;
    destinationCity: string;
    departure: string;
    arrival: string;
    duration: string; // formato "Xh Ym"
    durationMinutes: number;
    class: string;
    milesPrice: number;
    cashPrice: number;
    program: 'latam' | 'gol' | 'azul';
    sellers: string[];
    summary?: FlightSummary;
    itinerary?: FlightSegment[];
    brands?: Brand[];
    // Novos campos calculados
    departureTime?: string;
    arrivalTime?: string;
    totalDurationFormatted?: string;
}

export interface Seller {
    id: string;
    name: string;
    rating: number;
    totalSales: number;
    memberSince: string;
    responseTime: string;
    completionRate: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    verified: boolean;
    contact: {
        whatsapp: string;
        phone: string;
        email: string;
    };
    reviews: Review[];
}

export interface Review {
    id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Program {
    id: string;
    name: string;
    description: string;
    image: string;
    conversionRate: number;
    features: string[];
}

export interface PassengerCount {
    adults: number
    children: number
    babies: number
}

// types/profile.ts
export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    memberSince: string;
    lastActive: string;
    totalTransactions: number;
    successfulTransactions: number;
    totalMilesSold: number;
    totalMilesBought: number;
    rating: number;
    verification: VerificationStatus;
    level: UserLevel;
    badges: Badge[];
    testimonials: Testimonial[];
    quickStats: QuickStat[];
}

export interface VerificationStatus {
    identity: boolean;
    address: boolean;
    phone: boolean;
    facial: boolean;
    document: boolean;
    completed: boolean;
}

export interface UserLevel {
    level: "iniciante" | "intermediário" | "avançado" | "expert";
    points: number;
    nextLevel: number;
    progress: number;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    achievedAt: string;
}

export interface Testimonial {
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
    transactionValue: number;
    verified: boolean;
}

export interface QuickStat {
    label: string;
    value: string;
    change?: string;
    trend?: "up" | "down" | "neutral";
}

export interface LoyaltyProgram {
    id: string;
    name: string;
    program: "latam" | "gol" | "azul";
    totalMiles: number;
    lastUpdate: string;
    connected: boolean;
    credentials?: {
        username: string;
        password: string;
    };
    transactions: MileTransaction[];
}

export interface MileTransaction {
    id: string;
    date: string;
    description: string;
    miles: number;
    type: "earned" | "redeemed" | "transfer";
    partner?: string;
    buyer?: string;
}

export interface TokenData {
    [x: string]: string | number;
    searchToken: string;
    exp: number;
}

export interface FlightOffer {
    id: string;
    airline: string;
    flightNumber: string;
    origin: string;
    destination: string;
    departure: string;
    arrival: string;
    duration: string;

    milesPrice: number;
    cashPrice: number;
    sellers: string[];
    segments?: LatamSegment[];
    price?: {
        total: number;
        currency: string;
        miles?: number;
        amount?: string;
    };
}

export interface ApiSearchParams {
    origin: string;
    destination: string;
    outbound: string;
    inbound?: string;
    adt: number;
    chd: number;
    inf: number;
    trip: "RT" | "OW";
    cabin: string;
    redemption: boolean;
    sort: string;
}

export interface LatamOffer {
    id: string;
    airline: string;
    flightNumber: string;
    origin: string;
    destination: string;
    departure: string;
    arrival: string;
    duration: string;
    milesPrice: number;
    cashPrice: number;
    sellers: string[];
    // Campos específicos da LATAM que podem vir na resposta
    itineraries?: LatamItinerary[];
    price?: {
        total: number;
        currency: string;
        miles?: number;
    };
    segments?: LatamSegment[];
}

export interface LatamItinerary {
    id: string;
    duration: string;
    segments: LatamSegment[];
}

export interface LatamSegment {
    id: string;
    origin: string;
    destination: string;
    departure: string;
    arrival: string;
    duration: string;
    flightNumber: string;
    airline: string;
    aircraft?: string;
    operatingAirline?: string;
}

export interface LatamApiResponse {
    content: LatamFlightOffer[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface LatamFlightOffer {
    summary: FlightSummary;
    itinerary: FlightSegment[];
    brands: Brand[];
    newPrices?: string[]; // Mantido para compatibilidade
}

export type PriceInfo = object; // Estrutura de preços adicionais se necessário

export interface FlightSummary {
    stopOvers: number;
    duration: number; // em minutos
    flightCode: string;
    origin: AirportInfo;
    destination: AirportInfo;
    brands: Brand[];
    airline: string;
}

export interface AirportInfo {
    departure?: string;
    departureTime?: string;
    arrival?: string;
    arrivalTime?: string;
    iataCode: string;
    airport: string;
    city: string;
}

export interface FlightSegment {
    codeShare: boolean;
    interLine: boolean;
    duration: number; // em minutos
    equipment: string;
    aircraftLeaseText: string;
    flight: {
        flightNumber: number;
        airlineCode: string;
        operatingAirlineCode: string;
        flightOperator: string;
        departureTerminal: string | null;
        arrivalTerminal: string | null;
    };
    origin: string;
    destination: string;
    departure: string;
    arrival: string;
    bookingClass?: string | null;
    fareBasis?: string | null;
    type?: string | null;
}

export interface Brand {
    cabin: {
        id: string;
        label: string;
    };
    price: {
        currency: string;
        amount: number;
        displayCurrency: string;
        displayAmount: string;
        display: string;
        srLabel?: string;
        currencyAnalytics?: string;
    };
    priceWithOutTax: {
        currency: string;
        amount: number;
        displayCurrency: string;
        displayAmount: string;
        display: string;
    };
    taxes: {
        currency: string;
        amount: number;
        displayCurrency: string;
        displayAmount: string;
        display: string;
    };
}

// Tipo para ofertas agrupadas por tarifa (se aplicável)
export interface LatamBrandedFare {
    brand: string;
    cabin: string;
    offers: LatamOffer[];
    attributes: {
        baggage: {
            carryOn: number;
            checked: number;
        };
        seatSelection: boolean;
        flexibility: boolean;
        refund: boolean;
    };
}

// Interfaces para os tipos
export interface VerificationStepProps {
    step?: number;
    completed: boolean;
    label: string;
    description: string;
    icon: LucideIcon;
}

export interface BadgeIconProps {
    icon: string;
    color: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    achievedAt: string;
}

export interface QuickStat {
    label: string;
    value: string;
    change?: string;
    trend?: "up" | "down" | "neutral";
}