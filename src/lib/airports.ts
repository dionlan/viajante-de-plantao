export interface Airport {
    code: string
    name: string
    city: string
    country: string
}

export const brazilianAirports: Airport[] = [
    { code: 'GRU', name: 'Aeroporto Internacional de São Paulo/Guarulhos', city: 'São Paulo', country: 'BR' },
    { code: 'CGH', name: 'Aeroporto de Congonhas', city: 'São Paulo', country: 'BR' },
    { code: 'GIG', name: 'Aeroporto Internacional do Rio de Janeiro/Galeão', city: 'Rio de Janeiro', country: 'BR' },
    { code: 'SDU', name: 'Aeroporto Santos Dumont', city: 'Rio de Janeiro', country: 'BR' },
    { code: 'BSB', name: 'Aeroporto Internacional de Brasília', city: 'Brasília', country: 'BR' },
    { code: 'CNF', name: 'Aeroporto Internacional de Belo Horizonte/Confins', city: 'Belo Horizonte', country: 'BR' },
    { code: 'SSA', name: 'Aeroporto Internacional de Salvador/Deputado Luís Eduardo Magalhães', city: 'Salvador', country: 'BR' },
    { code: 'FOR', name: 'Aeroporto Internacional de Fortaleza/Pinto Martins', city: 'Fortaleza', country: 'BR' },
    { code: 'REC', name: 'Aeroporto Internacional do Recife/Guararapes', city: 'Recife', country: 'BR' },
    { code: 'POA', name: 'Aeroporto Internacional de Porto Alegre/Salgado Filho', city: 'Porto Alegre', country: 'BR' },
    { code: 'FLN', name: 'Aeroporto Internacional de Florianópolis/Hercílio Luz', city: 'Florianópolis', country: 'BR' },
    { code: 'CWB', name: 'Aeroporto Internacional de Curitiba/Afonso Pena', city: 'Curitiba', country: 'BR' },
    { code: 'VCP', name: 'Aeroporto Internacional de Viracopos/Campinas', city: 'Campinas', country: 'BR' },
    { code: 'BEL', name: 'Aeroporto Internacional de Belém/Val de Cans', city: 'Belém', country: 'BR' },
    { code: 'MAO', name: 'Aeroporto Internacional de Manaus/Eduardo Gomes', city: 'Manaus', country: 'BR' },
    { code: 'NAT', name: 'Aeroporto Internacional de Natal/Augusto Severo', city: 'Natal', country: 'BR' },
    { code: 'CGB', name: 'Aeroporto Internacional de Cuiabá/Marechal Rondon', city: 'Cuiabá', country: 'BR' },
    { code: 'GYN', name: 'Aeroporto de Goiânia/Santa Genoveva', city: 'Goiânia', country: 'BR' },
    { code: 'AJU', name: 'Aeroporto de Aracaju/Santa Maria', city: 'Aracaju', country: 'BR' },
    { code: 'JPA', name: 'Aeroporto Internacional de João Pessoa/Presidente Castro Pinto', city: 'João Pessoa', country: 'BR' },
    { code: 'MCZ', name: 'Aeroporto de Maceió/Zumbi dos Palmares', city: 'Maceió', country: 'BR' },
    { code: 'PVH', name: 'Aeroporto Internacional de Porto Velho/Governador Jorge Teixeira', city: 'Porto Velho', country: 'BR' },
    { code: 'RBR', name: 'Aeroporto Internacional de Rio Branco/Plácido de Castro', city: 'Rio Branco', country: 'BR' },
    { code: 'SLZ', name: 'Aeroporto Internacional de São Luís/Marechal Cunha Machado', city: 'São Luís', country: 'BR' },
    { code: 'THE', name: 'Aeroporto de Teresina/Senador Petrônio Portella', city: 'Teresina', country: 'BR' },
    { code: 'VIX', name: 'Aeroporto de Vitória/Eurico de Aguiar Salles', city: 'Vitória', country: 'BR' },
    { code: 'FEN', name: 'Aeroporto de Fernando de Noronha', city: 'Fernando de Noronha', country: 'BR' },
    { code: 'PMW', name: 'Aeroporto de Palmas/Brigadeiro Lysias Rodrigues', city: 'Palmas', country: 'BR' },
    { code: 'BVB', name: 'Aeroporto de Boa Vista/Atlas Brasil Cantanhede', city: 'Boa Vista', country: 'BR' },
    { code: 'CPV', name: 'Aeroporto de Campina Grande/Presidente João Suassuna', city: 'Campina Grande', country: 'BR' }
]

export const searchAirports = (query: string): Airport[] => {
    if (!query) return []

    const lowerQuery = query.toLowerCase()
    return brazilianAirports.filter(airport =>
        airport.code.toLowerCase().includes(lowerQuery) ||
        airport.name.toLowerCase().includes(lowerQuery) ||
        airport.city.toLowerCase().includes(lowerQuery)
    ).slice(0, 8) // Limitar resultados
}