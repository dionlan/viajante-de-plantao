// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface RequestHeaders {
    [key: string]: string;
}

interface RequestBody {
    url: string;
    headers?: RequestHeaders;
    method?: string;
    extractToken?: boolean;
}

// Timeout de 8 segundos (Vercel Hobby tem limite de 10s)
const FETCH_TIMEOUT = 8000;

export async function POST(request: NextRequest) {
    try {
        const body: RequestBody = await request.json();
        const { url, headers = {}, method = 'GET', extractToken = false } = body;

        console.log('🔍 Recebida requisição para:', url);

        // Validação básica
        if (!url || !url.startsWith('http')) {
            return NextResponse.json({
                success: false,
                error: 'URL inválida',
                data: null
            }, { status: 400 });
        }

        // SEMPRE usa fetch - curl não existe no Vercel
        return await handleFetchRequest(url, headers, method, extractToken);

    } catch (error: unknown) {
        console.error('❌ Erro na API search:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        return NextResponse.json(
            {
                success: false,
                error: `Erro interno: ${errorMessage}`,
                data: null
            },
            { status: 500 }
        );
    }
}

async function handleFetchRequest(
    url: string,
    headers: RequestHeaders,
    method: string,
    extractToken: boolean = false
) {
    console.log('🔍 Executando fetch para:', url);

    for (let attempt = 1; attempt <= 2; attempt++) {
        try {
            console.log(`🔄 Tentativa ${attempt} de 2...`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

            const response = await fetch(url, {
                method: method,
                headers: headers,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            console.log('📊 Status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status} - ${response.statusText}`);
            }

            const data = await response.text();
            console.log('✅ Fetch concluído, tamanho:', data.length);

            let finalData = data;

            if (extractToken) {
                console.log('🔍 Extraindo token...');
                const tokenMatch = data.match(/"searchToken":"([^"]*)"/);
                if (tokenMatch && tokenMatch[1]) {
                    finalData = tokenMatch[1];
                    console.log('✅ Token extraído');
                } else {
                    return NextResponse.json({
                        success: false,
                        error: 'Token não encontrado',
                        data: null
                    }, { status: 400 });
                }
            }

            return NextResponse.json({
                success: true,
                data: finalData,
                error: null
            });

        } catch (error: unknown) {
            console.error(`❌ Tentativa ${attempt} falhou:`, error);

            if (attempt === 2) {
                return NextResponse.json({
                    success: false,
                    error: 'Timeout: Serviço indisponível',
                    data: null
                }, { status: 408 });
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return NextResponse.json({
        success: false,
        error: 'Todas as tentativas falharam',
        data: null
    }, { status: 500 });
}