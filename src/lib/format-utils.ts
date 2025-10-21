// lib/format-utils.ts
export const formatNumber = (number: number, locale: string = 'pt-BR') => {
    return new Intl.NumberFormat(locale).format(number);
};

export const formatCurrency = (amount: number, currency: string = 'BRL', locale: string = 'pt-BR') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

// Utilitário para uso seguro no client-side
export const useClientFormat = () => {
    if (typeof window === 'undefined') {
        // Server-side - usar formato padrão
        return {
            formatNumber: (num: number) => num.toLocaleString('pt-BR'),
            formatCurrency: (num: number) =>
                num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        };
    }

    // Client-side - usar Intl API
    return {
        formatNumber: (num: number) => formatNumber(num),
        formatCurrency: (num: number) => formatCurrency(num)
    };
};