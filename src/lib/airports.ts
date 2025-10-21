export interface Airport {
    code: string
    name: string
    city: string
    country: string
}

export const brazilianAirports: Airport[] = [
    // Aeroportos Brasileiros (mantidos)
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
    { code: 'CPV', name: 'Aeroporto de Campina Grande/Presidente João Suassuna', city: 'Campina Grande', country: 'BR' },

    // Novos aeroportos brasileiros adicionados
    { code: 'IGU', name: 'Aeroporto Internacional de Foz do Iguaçu', city: 'Foz do Iguaçu', country: 'BR' },
    { code: 'UDI', name: 'Aeroporto de Uberlândia/Ten. Cel. Av. César Bombonato', city: 'Uberlândia', country: 'BR' },
    { code: 'RAO', name: 'Aeroporto de Ribeirão Preto/Leite Lopes', city: 'Ribeirão Preto', country: 'BR' },
    { code: 'LDB', name: 'Aeroporto de Londrina', city: 'Londrina', country: 'BR' },
    { code: 'JOI', name: 'Aeroporto de Joinville/Lauro Carneiro de Loyola', city: 'Joinville', country: 'BR' },
    { code: 'NVT', name: 'Aeroporto de Navegantes/Min. Victor Konder', city: 'Navegantes', country: 'BR' },
    { code: 'BPS', name: 'Aeroporto de Porto Seguro', city: 'Porto Seguro', country: 'BR' },
    { code: 'IOS', name: 'Aeroporto de Ilhéus/Jorge Amado', city: 'Ilhéus', country: 'BR' },
    { code: 'MCP', name: 'Aeroporto Internacional de Macapá', city: 'Macapá', country: 'BR' },
    { code: 'TBT', name: 'Aeroporto Internacional de Tabatinga', city: 'Tabatinga', country: 'BR' },
    { code: 'RIA', name: 'Aeroporto de Santa Maria', city: 'Santa Maria', country: 'BR' },
    { code: 'SJK', name: 'Aeroporto de São José dos Campos/Prof. Urbano Ernesto Stumpf', city: 'São José dos Campos', country: 'BR' },
]

export const internationalAirports: Airport[] = [
    // AMÉRICA DO SUL
    { code: 'EZE', name: 'Aeroporto Internacional Ministro Pistarini', city: 'Buenos Aires', country: 'AR' },
    { code: 'AEP', name: 'Aeroporto Jorge Newbery', city: 'Buenos Aires', country: 'AR' },
    { code: 'SCL', name: 'Aeroporto Internacional Arturo Merino Benítez', city: 'Santiago', country: 'CL' },
    { code: 'LIM', name: 'Aeroporto Internacional Jorge Chávez', city: 'Lima', country: 'PE' },
    { code: 'BOG', name: 'Aeroporto Internacional El Dorado', city: 'Bogotá', country: 'CO' },
    { code: 'UIO', name: 'Aeroporto Internacional Mariscal Sucre', city: 'Quito', country: 'EC' },
    { code: 'GYE', name: 'Aeroporto Internacional José Joaquín de Olmedo', city: 'Guayaquil', country: 'EC' },
    { code: 'ASU', name: 'Aeroporto Internacional Silvio Pettirossi', city: 'Assunção', country: 'PY' },
    { code: 'MVD', name: 'Aeroporto Internacional de Carrasco', city: 'Montevidéu', country: 'UY' },
    { code: 'CCS', name: 'Aeroporto Internacional Simón Bolívar', city: 'Caracas', country: 'VE' },
    { code: 'LPB', name: 'Aeroporto Internacional El Alto', city: 'La Paz', country: 'BO' },
    { code: 'VVI', name: 'Aeroporto Internacional Viru Viru', city: 'Santa Cruz de la Sierra', country: 'BO' },
    { code: 'CUZ', name: 'Aeroporto Internacional Alejandro Velasco Astete', city: 'Cusco', country: 'PE' },
    { code: 'IQT', name: 'Aeroporto Internacional Coronel FAP Francisco Secada Vignetta', city: 'Iquitos', country: 'PE' },
    { code: 'MDE', name: 'Aeroporto Internacional José María Córdova', city: 'Medellín', country: 'CO' },
    { code: 'CLO', name: 'Aeroporto Internacional Alfonso Bonilla Aragón', city: 'Cali', country: 'CO' },

    // AMÉRICA DO NORTE
    { code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'US' },
    { code: 'MCO', name: 'Orlando International Airport', city: 'Orlando', country: 'US' },
    { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'US' },
    { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'US' },
    { code: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'US' },
    { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'US' },
    { code: 'ORD', name: 'O\'Hare International Airport', city: 'Chicago', country: 'US' },
    { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'US' },
    { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'CA' },
    { code: 'YUL', name: 'Montréal-Pierre Elliott Trudeau International Airport', city: 'Montreal', country: 'CA' },
    { code: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'CA' },
    { code: 'MEX', name: 'Aeroporto Internacional Benito Juárez', city: 'Cidade do México', country: 'MX' },
    { code: 'CUN', name: 'Aeroporto Internacional de Cancún', city: 'Cancún', country: 'MX' },

    // AMÉRICA CENTRAL E CARIBE
    { code: 'PTY', name: 'Aeroporto Internacional de Tocumen', city: 'Cidade do Panamá', country: 'PA' },
    { code: 'SJO', name: 'Aeroporto Internacional Juan Santamaría', city: 'San José', country: 'CR' },
    { code: 'SAL', name: 'Aeroporto Internacional de El Salvador', city: 'San Salvador', country: 'SV' },
    { code: 'GUA', name: 'Aeroporto Internacional La Aurora', city: 'Cidade da Guatemala', country: 'GT' },
    { code: 'SDQ', name: 'Aeroporto Internacional Las Américas', city: 'Santo Domingo', country: 'DO' },
    { code: 'PUJ', name: 'Aeroporto Internacional de Punta Cana', city: 'Punta Cana', country: 'DO' },
    { code: 'NAS', name: 'Aeroporto Internacional Lynden Pindling', city: 'Nassau', country: 'BS' },
    { code: 'KIN', name: 'Aeroporto Internacional Norman Manley', city: 'Kingston', country: 'JM' },
    { code: 'MBJ', name: 'Aeroporto Internacional Sangster', city: 'Montego Bay', country: 'JM' },
    { code: 'HAV', name: 'Aeroporto Internacional José Martí', city: 'Havana', country: 'CU' },

    // EUROPA
    { code: 'LIS', name: 'Aeroporto de Lisboa', city: 'Lisboa', country: 'PT' },
    { code: 'OPO', name: 'Aeroporto Francisco Sá Carneiro', city: 'Porto', country: 'PT' },
    { code: 'MAD', name: 'Aeroporto Adolfo Suárez Madrid-Barajas', city: 'Madri', country: 'ES' },
    { code: 'BCN', name: 'Aeroporto de Barcelona-El Prat', city: 'Barcelona', country: 'ES' },
    { code: 'CDG', name: 'Aeroporto de Paris-Charles de Gaulle', city: 'Paris', country: 'FR' },
    { code: 'FCO', name: 'Aeroporto de Roma-Fiumicino', city: 'Roma', country: 'IT' },
    { code: 'FRA', name: 'Aeroporto de Frankfurt', city: 'Frankfurt', country: 'DE' },
    { code: 'AMS', name: 'Aeroporto de Schiphol', city: 'Amsterdã', country: 'NL' },
    { code: 'LHR', name: 'Aeroporto de Londres-Heathrow', city: 'Londres', country: 'GB' },
    { code: 'LGW', name: 'Aeroporto de Londres-Gatwick', city: 'Londres', country: 'GB' },
    { code: 'MAN', name: 'Aeroporto de Manchester', city: 'Manchester', country: 'GB' },
    { code: 'ZRH', name: 'Aeroporto de Zurique', city: 'Zurique', country: 'CH' },
    { code: 'BRU', name: 'Aeroporto de Bruxelas', city: 'Bruxelas', country: 'BE' },
    { code: 'CPH', name: 'Aeroporto de Copenhague', city: 'Copenhague', country: 'DK' },
    { code: 'ARN', name: 'Aeroporto de Estocolmo-Arlanda', city: 'Estocolmo', country: 'SE' },
    { code: 'OSL', name: 'Aeroporto de Oslo-Gardermoen', city: 'Oslo', country: 'NO' },
    { code: 'HEL', name: 'Aeroporto de Helsinki-Vantaa', city: 'Helsinki', country: 'FI' },
    { code: 'VIE', name: 'Aeroporto de Viena', city: 'Viena', country: 'AT' },
    { code: 'DUB', name: 'Aeroporto de Dublin', city: 'Dublin', country: 'IE' },
    { code: 'WAW', name: 'Aeroporto de Varsóvia-Chopin', city: 'Varsóvia', country: 'PL' },
    { code: 'PRG', name: 'Aeroporto de Praga', city: 'Praga', country: 'CZ' },
    { code: 'BUD', name: 'Aeroporto de Budapeste Ferenc Liszt', city: 'Budapeste', country: 'HU' },
    { code: 'ATH', name: 'Aeroporto Internacional de Atenas', city: 'Atenas', country: 'GR' },
    { code: 'IST', name: 'Aeroporto de Istambul', city: 'Istambul', country: 'TR' },
    { code: 'MXP', name: 'Aeroporto de Milão-Malpensa', city: 'Milão', country: 'IT' },

    // ÁFRICA
    { code: 'JNB', name: 'Aeroporto Internacional OR Tambo', city: 'Johannesburgo', country: 'ZA' },
    { code: 'CPT', name: 'Aeroporto Internacional da Cidade do Cabo', city: 'Cidade do Cabo', country: 'ZA' },
    { code: 'CMN', name: 'Aeroporto Internacional Mohammed V', city: 'Casablanca', country: 'MA' },
    { code: 'ADD', name: 'Aeroporto Internacional Bole', city: 'Adis Abeba', country: 'ET' },
    { code: 'CAI', name: 'Aeroporto Internacional do Cairo', city: 'Cairo', country: 'EG' },
    { code: 'DKR', name: 'Aeroporto Internacional Blaise Diagne', city: 'Dakar', country: 'SN' },
    { code: 'LAD', name: 'Aeroporto Internacional 4 de Fevereiro', city: 'Luanda', country: 'AO' },
    { code: 'LOS', name: 'Aeroporto Internacional Murtala Muhammed', city: 'Lagos', country: 'NG' },

    // ÁSIA E OCEANIA
    { code: 'DXB', name: 'Aeroporto Internacional de Dubai', city: 'Dubai', country: 'AE' },
    { code: 'AUH', name: 'Aeroporto Internacional de Abu Dhabi', city: 'Abu Dhabi', country: 'AE' },
    { code: 'DOH', name: 'Aeroporto Internacional Hamad', city: 'Doha', country: 'QA' },
    { code: 'TLV', name: 'Aeroporto Internacional Ben Gurion', city: 'Tel Aviv', country: 'IL' },
    { code: 'BKK', name: 'Aeroporto Internacional Suvarnabhumi', city: 'Bangkok', country: 'TH' },
    { code: 'SIN', name: 'Aeroporto de Changi', city: 'Singapura', country: 'SG' },
    { code: 'HKG', name: 'Aeroporto Internacional de Hong Kong', city: 'Hong Kong', country: 'CN' },
    { code: 'PEK', name: 'Aeroporto Internacional de Pequim-Capital', city: 'Pequim', country: 'CN' },
    { code: 'PVG', name: 'Aeroporto Internacional de Xangai-Pudong', city: 'Xangai', country: 'CN' },
    { code: 'NRT', name: 'Aeroporto Internacional de Narita', city: 'Tóquio', country: 'JP' },
    { code: 'HND', name: 'Aeroporto Internacional de Haneda', city: 'Tóquio', country: 'JP' },
    { code: 'ICN', name: 'Aeroporto Internacional de Incheon', city: 'Seul', country: 'KR' },
    { code: 'SYD', name: 'Aeroporto de Sydney', city: 'Sydney', country: 'AU' },
    { code: 'MEL', name: 'Aeroporto de Melbourne', city: 'Melbourne', country: 'AU' },
    { code: 'AKL', name: 'Aeroporto Internacional de Auckland', city: 'Auckland', country: 'NZ' },
    { code: 'BOM', name: 'Aeroporto Internacional Chhatrapati Shivaji Maharaj', city: 'Mumbai', country: 'IN' },
    { code: 'DEL', name: 'Aeroporto Internacional Indira Gandhi', city: 'Deli', country: 'IN' },
]

// Lista combinada com todos os aeroportos
export const allAirports: Airport[] = [
    ...brazilianAirports,
    ...internationalAirports
]

export const searchAirports = (query: string): Airport[] => {
    if (!query) return []

    const lowerQuery = query.toLowerCase()
    return allAirports.filter(airport =>
        airport.code.toLowerCase().includes(lowerQuery) ||
        airport.name.toLowerCase().includes(lowerQuery) ||
        airport.city.toLowerCase().includes(lowerQuery) ||
        airport.country.toLowerCase().includes(lowerQuery)
    ).slice(0, 12) // Aumentei para 12 resultados
}

// Função auxiliar para buscar por país
export const searchAirportsByCountry = (countryCode: string): Airport[] => {
    return allAirports.filter(airport =>
        airport.country.toLowerCase() === countryCode.toLowerCase()
    )
}

// Função para obter países disponíveis
export const getAvailableCountries = (): string[] => {
    const countries = allAirports.map(airport => airport.country)
    return [...new Set(countries)].sort()
}

// Função para agrupar aeroportos por país
export const getAirportsByCountry = (): Record<string, Airport[]> => {
    const grouped: Record<string, Airport[]> = {}

    allAirports.forEach(airport => {
        if (!grouped[airport.country]) {
            grouped[airport.country] = []
        }
        grouped[airport.country].push(airport)
    })

    return grouped
}