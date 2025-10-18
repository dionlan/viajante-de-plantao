import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = await request.json();

        // Gera headers realistas
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Upgrade-Insecure-Requests': '1',
        };

        const url = `https://www.latamairlines.com/br/pt/oferta-voos?${new URLSearchParams(searchParams)}`;

        console.log('🔗 Fazendo requisição para:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
            // Configurações importantes para contornar bloqueios
            cache: 'no-store',
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();

        // Múltiplos padrões para encontrar o token
        const tokenPatterns = [
            /"searchToken":"([^"]*)"/,
            /searchToken["']?\s*:\s*["']([^"']+)["']/,
            /window\.searchToken\s*=\s*["']([^"']+)["']/,
            /data-search-token=["']([^"']+)["']/
        ];

        let token = null;
        for (const pattern of tokenPatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                token = match[1];
                break;
            }
        }

        if (!token) {
            console.log('🔍 Token não encontrado. Amostra do HTML:', html.substring(0, 1000));
            return NextResponse.json({
                success: false,
                error: 'Token não encontrado na resposta',
                debug: { htmlLength: html.length }
            });
        }

        return NextResponse.json({ success: true, token });

    } catch (error) {
        console.error('❌ Erro no scraper:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
}