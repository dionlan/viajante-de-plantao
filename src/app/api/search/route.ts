import { NextRequest, NextResponse } from 'next/server'
import { mockFlights } from '@/lib/mockData'

export async function POST(request: NextRequest) {
    try {
        const searchParams = await request.json()

        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Filtrar voos baseado nos parâmetros de busca
        const filteredFlights = mockFlights.filter(flight => {
            // Aqui você implementaria a lógica real de filtragem
            // baseada nos parâmetros de busca
            return true
        })

        return NextResponse.json({
            success: true,
            data: {
                flights: filteredFlights,
                total: filteredFlights.length,
                searchParams
            }
        })

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: 'Erro interno do servidor'
            },
            { status: 500 }
        )
    }
}