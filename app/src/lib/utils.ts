import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value)
}

export function formatMiles(value: number): string {
    return new Intl.NumberFormat('pt-BR').format(value)
}

export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR')
}

export function formatDuration(minutes: number): string {
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

export function formatTime(dateTimeString: string): string {
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

export function getTimeDifference(start: string, end: string): string {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diff = endDate.getTime() - startDate.getTime()

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

export function getSellerLevelColor(level: string): string {
    switch (level) {
        case 'beginner':
            return 'bg-yellow-100 text-yellow-800'
        case 'intermediate':
            return 'bg-blue-100 text-blue-800'
        case 'advanced':
            return 'bg-green-100 text-green-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

// Adicione esta função ao seu arquivo @/lib/utils
export function calculateSavings(cashPrice: number, milesPrice: number): number {
    if (!cashPrice || cashPrice <= 0) return 0;

    // Simula um valor em reais equivalente às milhas para cálculo de economia
    // Você pode ajustar essa lógica conforme sua regra de negócio
    const milesEquivalentValue = milesPrice * 0.02; // Exemplo: 1 milha = R$ 0,02
    const savings = ((cashPrice - milesEquivalentValue) / cashPrice) * 100;

    return Math.max(0, Math.min(100, Math.round(savings)));
}

export const formatConnectionTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
        return `${hours}h ${mins}m`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else {
        return `${mins}m`;
    }
};

// Função para obter informações do aeroporto
export const getAirportInfo = (iataCode: string): { city: string; name: string } => {
    const airports: Record<string, { city: string; name: string }> = {
        'BSB': { city: 'Brasília', name: 'Brasília International' },
        'GRU': { city: 'São Paulo', name: 'Guarulhos International' },
        'GIG': { city: 'Rio de Janeiro', name: 'Galeão International' },
        'SSA': { city: 'Salvador', name: 'Deputado Luís Eduardo Magalhães International' },
        'REC': { city: 'Recife', name: 'Guararapes International' },
        'FOR': { city: 'Fortaleza', name: 'Pinto Martins International' },
        'BEL': { city: 'Belém', name: 'Val de Cans International' },
        'VIX': { city: 'Vitória', name: 'Eurico de Aguiar Salles' },
        'CWB': { city: 'Curitiba', name: 'Afonso Pena International' },
        'POA': { city: 'Porto Alegre', name: 'Salgado Filho International' },
        'MAO': { city: 'Manaus', name: 'Eduardo Gomes International' },
        'CNF': { city: 'Belo Horizonte', name: 'Tancredo Neves International' },
        'FLN': { city: 'Florianópolis', name: 'Hercílio Luz International' },
        'SLZ': { city: 'São Luís', name: 'Marechal Cunha Machado International' },
        'NAT': { city: 'Natal', name: 'Augusto Severo International' },
        'JPA': { city: 'João Pessoa', name: 'Presidente Castro Pinto International' },
        'MCZ': { city: 'Maceió', name: 'Zumbi dos Palmares International' },
        'AJU': { city: 'Aracaju', name: 'Santa Maria International' },
        'PVH': { city: 'Porto Velho', name: 'Governador Jorge Teixeira de Oliveira International' },
        'RBR': { city: 'Rio Branco', name: 'Plácido de Castro International' },
        'CGB': { city: 'Cuiabá', name: 'Marechal Rondon International' },
        'CGR': { city: 'Campo Grande', name: 'Campo Grande International' },
        'THE': { city: 'Teresina', name: 'Senador Petrônio Portella' },
        'IOS': { city: 'Ilhéus', name: 'Ilhéus Jorge Amado' },
        'FEN': { city: 'Fernando de Noronha', name: 'Fernando de Noronha' },
        'JDO': { city: 'Juazeiro do Norte', name: 'Orlando Bezerra de Menezes' },
        'IMP': { city: 'Imperatriz', name: 'Prefeito Renato Moreira' },
        'XAP': { city: 'Chapecó', name: 'Serafin Enoss Bertaso' },
        'JOI': { city: 'Joinville', name: 'Lauro Carneiro de Loyola' },
        'NVT': { city: 'Navegantes', name: 'Ministro Victor Konder International' },
        'CFB': { city: 'Cabo Frio', name: 'Cabo Frio International' },
        'BPS': { city: 'Porto Seguro', name: 'Porto Seguro' },
        'IGU': { city: 'Foz do Iguaçu', name: 'Cataratas International' },
    };

    return airports[iataCode] || { city: iataCode, name: iataCode };
};

export interface MileCalculation {
    calculatedValue: number;
    discountPercentage: number;
    mileRate: number;
}

export function calculateMileValue(milesPrice: number, program: string): MileCalculation {
    // Definição dos valores do milheiro por programa
    const mileRates = {
        latam: 24, // R$ 24,00 por milheiro
        gol: 15,   // R$ 15,00 por milheiro
        azul: 11   // R$ 11,00 por milheiro
    };

    const mileRate = mileRates[program as keyof typeof mileRates] || 20;

    // Cálculo: (milhas / 1000) * valor do milheiro
    const calculatedValue = (milesPrice / 1000) * mileRate;

    // Para calcular o desconto, precisaríamos do preço original em dinheiro
    // Como não temos isso diretamente, vamos usar um valor base para comparação
    const baseCashPrice = calculatedValue * 1.5; // Simulação de preço original

    const discountPercentage = Math.max(0, Math.round(((baseCashPrice - calculatedValue) / baseCashPrice) * 100));

    return {
        calculatedValue,
        discountPercentage,
        mileRate
    };
}