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

export function formatTime(date: string): string {
    return new Date(date).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    })
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