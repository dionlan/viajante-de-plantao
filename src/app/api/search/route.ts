// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface RequestHeaders {
    [key: string]: string;
}

interface RequestBody {
    url: string;
    headers?: RequestHeaders;
    method?: string;
    useFetch?: boolean;
    extractToken?: boolean;
}

// Timeout para evitar requests muito longos
const FETCH_TIMEOUT = 30000; // 30 segundos

export async function POST(request: NextRequest) {
    try {
        const body: RequestBody = await request.json();
        const { url, headers = {}, method = 'GET', extractToken = false } = body;

        console.log('🔍 Recebida requisição para:', url);
        console.log('📋 Método:', method);
        console.log('🎯 Extrair token:', extractToken);

        // Validações básicas
        if (!url || typeof url !== 'string') {
            return NextResponse.json({
                success: false,
                error: 'URL é obrigatória e deve ser uma string',
                data: null
            }, { status: 400 });
        }

        if (!url.startsWith('http')) {
            return NextResponse.json({
                success: false,
                error: 'URL deve começar com http:// ou https://',
                data: null
            }, { status: 400 });
        }

        // SEMPRE usa fetch no Vercel
        return await handleFetchRequest(url, headers, method, extractToken);

    } catch (error: unknown) {
        console.error('❌ Erro na API search:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        return NextResponse.json(
            {
                success: false,
                error: `Erro interno do servidor: ${errorMessage}`,
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
    console.log('📋 Headers recebidos:', Object.keys(headers).length);

    // Log seguro dos headers (sem dados sensíveis)
    const safeHeaders = { ...headers };
    if (safeHeaders.Cookie) safeHeaders.Cookie = '[REDACTED]';
    if (safeHeaders.Authorization) safeHeaders.Authorization = '[REDACTED]';
    if (safeHeaders['x-latam-search-token']) {
        safeHeaders['x-latam-search-token'] = safeHeaders['x-latam-search-token'].substring(0, 10) + '...';
    }

    console.log('🔐 Headers seguros:', safeHeaders);

    try {
        // Usa AbortController para timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

        const response = await fetch(url, {
            method: method,
            headers: headers,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log('📊 Status da resposta:', response.status, response.statusText);
        console.log('📋 Headers da resposta:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            let errorBody = '';
            try {
                errorBody = await response.text();
                console.error('❌ Corpo do erro:', errorBody.substring(0, 500));
            } catch {
                // Ignora erro ao ler corpo
            }

            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.text();
        console.log('✅ Fetch concluído, tamanho:', data.length, 'caracteres');

        // Log parcial da resposta para debug
        if (data.length > 0) {
            console.log('📦 Primeiros 200 chars:', data.substring(0, 200));
        } else {
            console.warn('⚠️ Resposta vazia');
        }

        let finalData = data;

        if (extractToken) {
            console.log('🔍 Extraindo token da resposta...');
            const tokenMatch = data.match(/"searchToken":"([^"]*)"/);
            if (tokenMatch && tokenMatch[1]) {
                finalData = tokenMatch[1];
                console.log('✅ Token extraído, tamanho:', finalData.length);

                // Log parcial do token
                if (finalData.length > 50) {
                    console.log('🔐 Token (primeiros 50 chars):', finalData.substring(0, 50));
                }
            } else {
                console.error('❌ Token não encontrado na resposta');
                console.log('🔍 Tentando padrões alternativos...');

                // Tentativa com padrões alternativos
                const alternativePatterns = [
                    /searchToken[=:]"([^"]*)"/,
                    /token["']?\s*[:=]\s*["']([^"']+)["']/,
                    /"token":"([^"]*)"/
                ];

                for (const pattern of alternativePatterns) {
                    const match = data.match(pattern);
                    if (match && match[1]) {
                        finalData = match[1];
                        console.log('✅ Token encontrado com padrão alternativo');
                        break;
                    }
                }

                if (finalData === data) {
                    return NextResponse.json({
                        success: false,
                        error: 'Token não encontrado na resposta',
                        data: null
                    }, { status: 400 });
                }
            }
        }

        return NextResponse.json({
            success: true,
            data: finalData,
            error: null
        });

    } catch (error: unknown) {
        console.error('❌ Erro no fetch:', error);

        let errorMessage = 'Erro desconhecido no fetch';

        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                errorMessage = `Timeout: A requisição excedeu ${FETCH_TIMEOUT / 1000} segundos`;
            } else {
                errorMessage = error.message;
            }
        }

        return NextResponse.json({
            success: false,
            error: errorMessage,
            data: null
        }, { status: 500 });
    }
}

// Health check opcional
export async function GET() {
    return NextResponse.json({
        success: true,
        message: 'Search API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
}