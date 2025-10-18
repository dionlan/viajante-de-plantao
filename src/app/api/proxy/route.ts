// app/api/proxy/route.ts - VERSÃO COMPATÍVEL COM VERCEL
import { NextRequest, NextResponse } from 'next/server';

// Para melhor compatibilidade, usar runtime nodejs em vez de edge
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

interface ProxyRequest {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
    timeout?: number;
}

const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
];

export async function POST(request: NextRequest) {
    const requestId = Math.random().toString(36).substring(2, 10);

    console.log(`🔍 [${requestId}] Iniciando proxy request...`);

    try {
        const body: ProxyRequest = await request.json();
        const { url, method = 'GET', headers = {}, body: requestBody, timeout = 15000 } = body;

        // Validações
        if (!url || typeof url !== 'string') {
            console.error(`❌ [${requestId}] URL inválida`);
            return NextResponse.json({
                success: false,
                error: 'URL é obrigatória'
            }, { status: 400 });
        }

        let parsedUrl: URL;
        try {
            parsedUrl = new URL(url);
        } catch (error) {
            console.error(`❌ [${requestId}] URL malformada:`, url);
            return NextResponse.json({
                success: false,
                error: 'URL inválida'
            }, { status: 400 });
        }

        // Verificar domínio permitido
        if (!parsedUrl.hostname.includes('latamairlines.com') &&
            !parsedUrl.hostname.includes('httpbin.org')) {
            console.error(`❌ [${requestId}] Domínio não permitido:`, parsedUrl.hostname);
            return NextResponse.json({
                success: false,
                error: 'Domínio não permitido'
            }, { status: 403 });
        }

        console.log(`🌐 [${requestId}] Fazendo request para: ${parsedUrl.hostname}${parsedUrl.pathname}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            console.log(`⏰ [${requestId}] Timeout após ${timeout}ms`);
            controller.abort();
        }, timeout);

        try {
            // Headers otimizados
            const optimizedHeaders = {
                'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                'Accept-Encoding': 'gzip, deflate, br',
                'Cache-Control': 'no-cache',
                'DNT': '1',
                'Upgrade-Insecure-Requests': '1',
                ...headers
            };

            const fetchOptions: RequestInit = {
                method,
                headers: optimizedHeaders,
                signal: controller.signal,
            };

            if (requestBody && method !== 'GET' && method !== 'HEAD') {
                fetchOptions.body = typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody);
            }

            const startTime = Date.now();
            const response = await fetch(url, fetchOptions);
            const endTime = Date.now();

            clearTimeout(timeoutId);

            console.log(`📊 [${requestId}] Response em ${endTime - startTime}ms - Status: ${response.status}`);

            if (!response.ok) {
                const errorText = await response.text().catch(() => 'Cannot read error body');
                console.error(`❌ [${requestId}] HTTP Error ${response.status}:`, errorText.substring(0, 200));

                return NextResponse.json({
                    success: false,
                    error: `HTTP ${response.status}: ${response.statusText}`,
                    status: response.status
                });
            }

            const responseText = await response.text();

            if (!responseText) {
                console.error(`❌ [${requestId}] Resposta vazia`);
                return NextResponse.json({
                    success: false,
                    error: 'Resposta vazia do servidor'
                });
            }

            console.log(`✅ [${requestId}] Request bem-sucedido - ${responseText.length} caracteres`);

            // Tentar parsear como JSON, senão retornar como texto
            try {
                const jsonData = JSON.parse(responseText);
                return NextResponse.json({
                    success: true,
                    data: jsonData,
                    status: response.status
                });
            } catch (jsonError) {
                return NextResponse.json({
                    success: true,
                    data: responseText,
                    status: response.status
                });
            }

        } catch (error: unknown) {
            clearTimeout(timeoutId);

            if (error === 'AbortError') {
                console.error(`❌ [${requestId}] Timeout após ${timeout}ms`);
                return NextResponse.json({
                    success: false,
                    error: `Timeout: A requisição excedeu ${timeout}ms`
                });
            }

            console.error(`❌ [${requestId}] Erro de fetch:`, error);
            return NextResponse.json({
                success: false,
                error: error || 'Erro de conexão'
            });
        }

    } catch (error: unknown) {
        console.error(`💥 [${requestId}] Erro no proxy:`, error);

        return NextResponse.json({
            success: false,
            error: 'Erro interno do servidor: ' + (error || 'Unknown error')
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const testUrl = url.searchParams.get('testUrl');

    if (testUrl) {
        // Teste de health check com URL específica
        return POST(request);
    }

    return NextResponse.json({
        success: true,
        message: 'Proxy API está funcionando',
        environment: process.env.VERCEL ? 'vercel' : 'local',
        region: process.env.VERCEL_REGION || 'unknown',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
}

// Configuração para métodos OPTIONS (CORS)
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}