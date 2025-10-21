import { Flight, Seller, Program } from './types'

export const mockSellers: Seller[] = [
    {
        id: "seller-0-0",
        name: "Ana Silva",
        rating: 4.9,
        totalSales: 245,
        memberSince: "2022-03-15",
        responseTime: "5 min",
        completionRate: 98,
        level: "advanced" as const,
        verified: true,
        contact: {
            whatsapp: "+5511999990001",
            phone: "+5511999990001",
            email: "ana.silva@email.com"
        },
        reviews: [
            {
                id: "1",
                user: "Carlos Mendes",
                rating: 5,
                comment: "Excelente atendimento! Transação rápida e segura.",
                date: "2024-01-15"
            }
        ]
    },
    {
        id: "seller-0-1",
        name: "Roberto Santos",
        rating: 4.8,
        totalSales: 187,
        memberSince: "2022-08-22",
        responseTime: "8 min",
        completionRate: 96,
        level: "intermediate" as const,
        verified: true,
        contact: {
            whatsapp: "+5511999990002",
            phone: "+5511999990002",
            email: "roberto.santos@email.com"
        },
        reviews: [
            {
                id: "2",
                user: "Mariana Costa",
                rating: 5,
                comment: "Muito profissional, recomendo!",
                date: "2024-01-10"
            }
        ]
    },
    {
        id: "seller-1-0",
        name: "Juliana Silva",
        rating: 4.7,
        totalSales: 132,
        memberSince: "2023-01-10",
        responseTime: "12 min",
        completionRate: 94,
        level: "intermediate" as const,
        verified: true,
        contact: {
            whatsapp: "+5511999990003",
            phone: "+5511999990003",
            email: "juliana.oliveira@email.com"
        },
        reviews: [
            {
                id: "3",
                user: "Pedro Almeida",
                rating: 4,
                comment: "Boa comunicação, processo tranquilo.",
                date: "2024-01-08"
            }
        ]
    },
    {
        id: "seller-2-0",
        name: "Fernando Lima",
        rating: 5.0,
        totalSales: 321,
        memberSince: "2021-11-05",
        responseTime: "3 min",
        completionRate: 99,
        level: "advanced" as const,
        verified: true,
        contact: {
            whatsapp: "+5511999990004",
            phone: "+5511999990004",
            email: "fernando.lima@email.com"
        },
        reviews: [
            {
                id: "4",
                user: "Patricia Santos",
                rating: 5,
                comment: "Melhor vendedor da plataforma! Super rápido.",
                date: "2024-01-12"
            }
        ]
    },
    {
        id: "seller-2-1",
        name: "Camila Rodrigues",
        rating: 4.6,
        totalSales: 89,
        memberSince: "2023-05-20",
        responseTime: "15 min",
        completionRate: 92,
        level: "beginner" as const,
        verified: true,
        contact: {
            whatsapp: "+5511999990005",
            phone: "+5511999990005",
            email: "camila.rodrigues@email.com"
        },
        reviews: [
            {
                id: "5",
                user: "Ricardo Ferreira",
                rating: 5,
                comment: "Atendimento muito bom, preço justo.",
                date: "2024-01-05"
            }
        ]
    },
    {
        id: "seller-2-2",
        name: "Lucas Alves",
        rating: 4.8,
        totalSales: 156,
        memberSince: "2022-12-01",
        responseTime: "7 min",
        completionRate: 95,
        level: "intermediate" as const,
        verified: true,
        contact: {
            whatsapp: "+5511999990006",
            phone: "+5511999990006",
            email: "lucas.alves@email.com"
        },
        reviews: [
            {
                id: "6",
                user: "Amanda Costa",
                rating: 5,
                comment: "Muito confiável, já fiz várias transações.",
                date: "2024-01-03"
            }
        ]
    },
    {
        id: "seller-3-0",
        name: "Beatriz Souza",
        rating: 4.9,
        totalSales: 278,
        memberSince: "2022-06-14",
        responseTime: "4 min",
        completionRate: 97,
        level: "advanced" as const,
        verified: true,
        contact: {
            whatsapp: "+5511999990007",
            phone: "+5511999990007",
            email: "beatriz.souza@email.com"
        },
        reviews: [
            {
                id: "7",
                user: "Gabriel Martins",
                rating: 5,
                comment: "Profissionalismo total! Recomendo muito.",
                date: "2024-01-14"
            }
        ]
    },
    {
        id: "seller-3-1",
        name: "Rafael Costa",
        rating: 4.5,
        totalSales: 67,
        memberSince: "2023-08-30",
        responseTime: "20 min",
        completionRate: 90,
        level: "beginner" as const,
        verified: true,
        contact: {
            whatsapp: "+5511999990008",
            phone: "+5511999990008",
            email: "rafael.costa@email.com"
        },
        reviews: [
            {
                id: "8",
                user: "Tatiane Silva",
                rating: 4,
                comment: "Bom vendedor, preço competitivo.",
                date: "2024-01-07"
            }
        ]
    },
    {
        id: "seller-4-0",
        name: "Isabela Fernandes",
        rating: 4.7,
        totalSales: 198,
        memberSince: "2022-09-18",
        responseTime: "6 min",
        completionRate: 96,
        level: "intermediate" as const,
        verified: true,
        contact: {
            whatsapp: "+5511999990009",
            phone: "+5511999990009",
            email: "isabela.fernandes@email.com"
        },
        reviews: [
            {
                id: "9",
                user: "Daniel Oliveira",
                rating: 5,
                comment: "Excelente experiência de compra!",
                date: "2024-01-11"
            }
        ]
    },
    {
        id: "seller-4-1",
        name: "Marcos Santos",
        rating: 4.8,
        totalSales: 223,
        memberSince: "2022-04-25",
        responseTime: "5 min",
        completionRate: 98,
        level: "advanced" as const,
        verified: true,
        contact: {
            whatsapp: "+5511999990010",
            phone: "+5511999990010",
            email: "marcos.santos@email.com"
        },
        reviews: [
            {
                id: "10",
                user: "Larissa Mendes",
                rating: 5,
                comment: "Muito confiável e atencioso.",
                date: "2024-01-09"
            }
        ]
    },
    {
        id: "seller-4-2",
        name: "Patricia Lima",
        rating: 4.6,
        totalSales: 145,
        memberSince: "2023-02-14",
        responseTime: "10 min",
        completionRate: 93,
        level: "intermediate" as const,
        verified: true,
        contact: {
            whatsapp: "+5511999990011",
            phone: "+5511999990011",
            email: "patricia.lima@email.com"
        },
        reviews: [
            {
                id: "11",
                user: "Bruno Costa",
                rating: 4,
                comment: "Bom atendimento, recomendo.",
                date: "2024-01-06"
            }
        ]
    },
    {
        id: "seller-4-3",
        name: "Thiago Almeida",
        rating: 4.9,
        totalSales: 312,
        memberSince: "2021-12-08",
        responseTime: "2 min",
        completionRate: 99,
        level: "advanced" as const,
        verified: true,
        contact: {
            whatsapp: "+5511999990012",
            phone: "+5511999990012",
            email: "thiago.almeida@email.com"
        },
        reviews: [
            {
                id: "12",
                user: "Vanessa Rodrigues",
                rating: 5,
                comment: "O mais rápido que já comprei!",
                date: "2024-01-13"
            }
        ]
    }
];

export const mockFlights: Flight[] = [
    {
        id: '1',
        airline: 'LATAM',
        flightNumber: 'LA1234',
        origin: 'GRU',
        destination: 'SSA',
        originCity: 'São Paulo',
        destinationCity: 'Salvador',
        departure: '2024-02-15T08:00:00',
        arrival: '2024-02-15T11:30:00',
        duration: '03:30',
        class: 'Economy',
        milesPrice: 15000,
        cashPrice: 890.00,
        program: 'latam',
        sellers: ['1', '2', '3'],
        durationMinutes: 0,
        stopOvers: 0
    },
    {
        id: '2',
        airline: 'GOL',
        flightNumber: 'G5678',
        origin: 'GRU',
        destination: 'SSA',
        originCity: 'São Paulo',
        destinationCity: 'Salvador',
        departure: '2024-02-15T10:00:00',
        arrival: '2024-02-15T14:20:00',
        duration: '04:20',
        class: 'Economy',
        milesPrice: 12000,
        cashPrice: 750.00,
        program: 'gol',
        sellers: ['1', '4'],
        durationMinutes: 0,
        stopOvers: 0
    },
    {
        id: '3',
        airline: 'AZUL',
        flightNumber: 'AD4567',
        origin: 'GIG',
        destination: 'FLN',
        originCity: 'Rio de Janeiro',
        destinationCity: 'Florianópolis',
        departure: '2024-02-16T07:30:00',
        arrival: '2024-02-16T09:45:00',
        duration: '02:15',
        class: 'Economy',
        milesPrice: 8500,
        cashPrice: 520.00,
        program: 'azul',
        sellers: ['3', '5'],
        durationMinutes: 0,
        stopOvers: 0
    },
    {
        id: '4',
        airline: 'LATAM',
        flightNumber: 'LA3345',
        origin: 'BSB',
        destination: 'CGH',
        originCity: 'Brasília',
        destinationCity: 'São Paulo',
        departure: '2024-02-17T14:00:00',
        arrival: '2024-02-17T15:30:00',
        duration: '01:30',
        class: 'Economy',
        milesPrice: 6500,
        cashPrice: 380.00,
        program: 'latam',
        sellers: ['2', '6'],
        durationMinutes: 0,
        stopOvers: 0
    },
    {
        id: '5',
        airline: 'GOL',
        flightNumber: 'G7890',
        origin: 'GRU',
        destination: 'FOR',
        originCity: 'São Paulo',
        destinationCity: 'Fortaleza',
        departure: '2024-02-18T06:00:00',
        arrival: '2024-02-18T09:15:00',
        duration: '03:15',
        class: 'Premium Economy',
        milesPrice: 22000,
        cashPrice: 1250.00,
        program: 'gol',
        sellers: ['1', '3', '7'],
        durationMinutes: 0,
        stopOvers: 0
    },
    {
        id: '6',
        airline: 'AZUL',
        flightNumber: 'AD2345',
        origin: 'CNF',
        destination: 'REC',
        originCity: 'Belo Horizonte',
        destinationCity: 'Recife',
        departure: '2024-02-19T11:20:00',
        arrival: '2024-02-19T14:45:00',
        duration: '03:25',
        class: 'Economy',
        milesPrice: 11000,
        cashPrice: 680.00,
        program: 'azul',
        sellers: ['4', '5'],
        durationMinutes: 0,
        stopOvers: 0
    },
    {
        id: '7',
        airline: 'LATAM',
        flightNumber: 'LA4456',
        origin: 'POA',
        destination: 'GRU',
        originCity: 'Porto Alegre',
        destinationCity: 'São Paulo',
        departure: '2024-02-20T16:30:00',
        arrival: '2024-02-20T18:15:00',
        duration: '01:45',
        class: 'Business',
        milesPrice: 35000,
        cashPrice: 2100.00,
        program: 'latam',
        sellers: ['3', '7'],
        durationMinutes: 0,
        stopOvers: 0
    },
    {
        id: '8',
        airline: 'GOL',
        flightNumber: 'G5566',
        origin: 'SSA',
        destination: 'GIG',
        originCity: 'Salvador',
        destinationCity: 'Rio de Janeiro',
        departure: '2024-02-21T13:45:00',
        arrival: '2024-02-21T16:30:00',
        duration: '02:45',
        class: 'Economy',
        milesPrice: 9500,
        cashPrice: 590.00,
        program: 'gol',
        sellers: ['2', '6'],
        durationMinutes: 0,
        stopOvers: 0
    },
    {
        id: '9',
        airline: 'AZUL',
        flightNumber: 'AD6677',
        origin: 'FLN',
        destination: 'BSB',
        originCity: 'Florianópolis',
        destinationCity: 'Brasília',
        departure: '2024-02-22T09:15:00',
        arrival: '2024-02-22T12:00:00',
        duration: '02:45',
        class: 'Economy',
        milesPrice: 12500,
        cashPrice: 740.00,
        program: 'azul',
        sellers: ['1', '5'],
        durationMinutes: 0,
        stopOvers: 0
    },
    {
        id: '10',
        airline: 'LATAM',
        flightNumber: 'LA7788',
        origin: 'FOR',
        destination: 'CNF',
        originCity: 'Fortaleza',
        destinationCity: 'Belo Horizonte',
        departure: '2024-02-23T20:00:00',
        arrival: '2024-02-23T23:30:00',
        duration: '03:30',
        class: 'Premium Economy',
        milesPrice: 18000,
        cashPrice: 980.00,
        program: 'latam',
        sellers: ['3', '4', '7'],
        durationMinutes: 0,
        stopOvers: 0
    },
    {
        id: '11',
        airline: 'GOL',
        flightNumber: 'G8899',
        origin: 'REC',
        destination: 'POA',
        originCity: 'Recife',
        destinationCity: 'Porto Alegre',
        departure: '2024-02-24T05:45:00',
        arrival: '2024-02-24T09:30:00',
        duration: '03:45',
        class: 'Economy',
        milesPrice: 14000,
        cashPrice: 820.00,
        program: 'gol',
        sellers: ['2', '5'],
        durationMinutes: 0,
        stopOvers: 0
    },
    {
        id: '12',
        airline: 'AZUL',
        flightNumber: 'AD9900',
        origin: 'CGH',
        destination: 'SSA',
        originCity: 'São Paulo',
        destinationCity: 'Salvador',
        departure: '2024-02-25T15:20:00',
        arrival: '2024-02-25T18:10:00',
        duration: '02:50',
        class: 'Business',
        milesPrice: 28000,
        cashPrice: 1650.00,
        program: 'azul',
        sellers: ['1', '3', '6'],
        durationMinutes: 0,
        stopOvers: 0
    }
]

export const programs: Program[] = [
    {
        id: 'latam',
        name: 'LATAM Pass',
        description: 'Programa de milhas da LATAM Airlines',
        image: '/images/latam-pass.png',
        conversionRate: 1.4,
        features: ['Acumule em voos', 'Transferência de bancos', 'Diversos parceiros']
    },
    {
        id: 'gol',
        name: 'Smiles',
        description: 'Programa de milhas da GOL Linhas Aéreas',
        image: '/images/smiles.png',
        conversionRate: 1.2,
        features: ['Cartão Smiles', 'Promoções frequentes', 'Diversas opções']
    },
    {
        id: 'azul',
        name: 'TudoAzul',
        description: 'Programa de milhas da Azul Linhas Aéreas',
        image: '/images/tudoazul.png',
        conversionRate: 1.3,
        features: ['Flexibilidade', 'Voo + hotel', 'Programa familiar']
    }
]