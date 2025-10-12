import { Flight, Seller, Program } from './types'

export const mockSellers: Seller[] = [
    {
        id: '1',
        name: 'Ana Silva',
        rating: 4.9,
        totalSales: 1250,
        memberSince: '2022-01-15',
        responseTime: '5 min',
        completionRate: 98,
        level: 'advanced',
        verified: true,
        contact: {
            whatsapp: '+5511999999999',
            phone: '+5511888888888',
            email: 'ana.silva@email.com'
        },
        reviews: [
            {
                id: '1',
                user: 'João Santos',
                rating: 5,
                comment: 'Excelente vendedora! Processo muito rápido e seguro.',
                date: '2024-01-15'
            }
        ]
    },
    {
        id: '2',
        name: 'Carlos Oliveira',
        rating: 4.7,
        totalSales: 800,
        memberSince: '2022-08-20',
        responseTime: '10 min',
        completionRate: 95,
        level: 'intermediate',
        verified: true,
        contact: {
            whatsapp: '+5511977777777',
            phone: '+5511866666666',
            email: 'carlos.oliveira@email.com'
        },
        reviews: [
            {
                id: '2',
                user: 'Maria Costa',
                rating: 4,
                comment: 'Muito prestativo, recomendo!',
                date: '2024-01-10'
            }
        ]
    },
    {
        id: '3',
        name: 'Fernanda Lima',
        rating: 4.8,
        totalSales: 2100,
        memberSince: '2021-03-10',
        responseTime: '3 min',
        completionRate: 99,
        level: 'advanced',
        verified: true,
        contact: {
            whatsapp: '+5511955555555',
            phone: '+5511844444444',
            email: 'fernanda.lima@email.com'
        },
        reviews: [
            {
                id: '3',
                user: 'Roberto Alves',
                rating: 5,
                comment: 'Melhor vendedora do app! Sempre com os melhores preços.',
                date: '2024-01-20'
            }
        ]
    },
    {
        id: '4',
        name: 'Ricardo Santos',
        rating: 4.5,
        totalSales: 450,
        memberSince: '2023-02-28',
        responseTime: '15 min',
        completionRate: 92,
        level: 'beginner',
        verified: true,
        contact: {
            whatsapp: '+5511933333333',
            phone: '+5511822222222',
            email: 'ricardo.santos@email.com'
        },
        reviews: [
            {
                id: '4',
                user: 'Patrícia Mendes',
                rating: 4,
                comment: 'Atendimento muito bom, recomendo!',
                date: '2024-01-18'
            }
        ]
    },
    {
        id: '5',
        name: 'Juliana Costa',
        rating: 4.9,
        totalSales: 1800,
        memberSince: '2021-11-05',
        responseTime: '2 min',
        completionRate: 99,
        level: 'advanced',
        verified: true,
        contact: {
            whatsapp: '+5511911111111',
            phone: '+5511800000000',
            email: 'juliana.costa@email.com'
        },
        reviews: [
            {
                id: '5',
                user: 'Lucas Ferreira',
                rating: 5,
                comment: 'Rápida e eficiente! Consegui minhas milhas em minutos.',
                date: '2024-01-22'
            }
        ]
    },
    {
        id: '6',
        name: 'Bruno Oliveira',
        rating: 4.6,
        totalSales: 600,
        memberSince: '2022-12-15',
        responseTime: '8 min',
        completionRate: 94,
        level: 'intermediate',
        verified: true,
        contact: {
            whatsapp: '+5511922222222',
            phone: '+5511811111111',
            email: 'bruno.oliveira@email.com'
        },
        reviews: [
            {
                id: '6',
                user: 'Camila Rodrigues',
                rating: 4,
                comment: 'Muito profissional, explica tudo com clareza.',
                date: '2024-01-14'
            }
        ]
    },
    {
        id: '7',
        name: 'Patrícia Almeida',
        rating: 4.7,
        totalSales: 950,
        memberSince: '2022-05-20',
        responseTime: '6 min',
        completionRate: 96,
        level: 'intermediate',
        verified: true,
        contact: {
            whatsapp: '+5511944444444',
            phone: '+5511833333333',
            email: 'patricia.almeida@email.com'
        },
        reviews: [
            {
                id: '7',
                user: 'Diego Souza',
                rating: 5,
                comment: 'Excelente atendimento, muito paciente com minhas dúvidas.',
                date: '2024-01-19'
            }
        ]
    }
]

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
        direct: true,
        stops: 0,
        class: 'Economy',
        milesPrice: 15000,
        cashPrice: 890.00,
        program: 'latam',
        sellers: ['1', '2', '3']
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
        direct: false,
        stops: 1,
        class: 'Economy',
        milesPrice: 12000,
        cashPrice: 750.00,
        program: 'gol',
        sellers: ['1', '4']
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
        direct: true,
        stops: 0,
        class: 'Economy',
        milesPrice: 8500,
        cashPrice: 520.00,
        program: 'azul',
        sellers: ['3', '5']
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
        direct: true,
        stops: 0,
        class: 'Economy',
        milesPrice: 6500,
        cashPrice: 380.00,
        program: 'latam',
        sellers: ['2', '6']
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
        direct: true,
        stops: 0,
        class: 'Premium Economy',
        milesPrice: 22000,
        cashPrice: 1250.00,
        program: 'gol',
        sellers: ['1', '3', '7']
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
        direct: true,
        stops: 0,
        class: 'Economy',
        milesPrice: 11000,
        cashPrice: 680.00,
        program: 'azul',
        sellers: ['4', '5']
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
        direct: true,
        stops: 0,
        class: 'Business',
        milesPrice: 35000,
        cashPrice: 2100.00,
        program: 'latam',
        sellers: ['3', '7']
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
        direct: false,
        stops: 1,
        class: 'Economy',
        milesPrice: 9500,
        cashPrice: 590.00,
        program: 'gol',
        sellers: ['2', '6']
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
        direct: true,
        stops: 0,
        class: 'Economy',
        milesPrice: 12500,
        cashPrice: 740.00,
        program: 'azul',
        sellers: ['1', '5']
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
        direct: false,
        stops: 1,
        class: 'Premium Economy',
        milesPrice: 18000,
        cashPrice: 980.00,
        program: 'latam',
        sellers: ['3', '4', '7']
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
        direct: true,
        stops: 0,
        class: 'Economy',
        milesPrice: 14000,
        cashPrice: 820.00,
        program: 'gol',
        sellers: ['2', '5']
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
        direct: true,
        stops: 0,
        class: 'Business',
        milesPrice: 28000,
        cashPrice: 1650.00,
        program: 'azul',
        sellers: ['1', '3', '6']
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