export interface FlightSearch {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate: string;
    passengers: number;
    program: 'all' | 'latam' | 'gol' | 'azul';
    tripType: 'oneway' | 'roundtrip';
}

export interface Flight {
    id: string;
    airline: 'LATAM' | 'GOL' | 'AZUL';
    flightNumber: string;
    origin: string;
    originCity: string;
    destination: string;
    destinationCity: string;
    departure: string;
    arrival: string;
    duration: string;
    direct: boolean;
    stops: number;
    class: string;
    milesPrice: number;
    cashPrice: number;
    program: 'latam' | 'gol' | 'azul';
    sellers: string[];
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

export interface FlightSearch {
    origin: string
    destination: string
    departureDate: string
    returnDate: string
    passengers: number
    passengerDetails?: PassengerCount
    program: 'all' | 'latam' | 'gol' | 'azul'
    tripType: 'oneway' | 'roundtrip'
}