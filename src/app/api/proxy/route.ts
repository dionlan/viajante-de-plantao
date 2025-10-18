// app/api/proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

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
    try {
        const { url, method = 'GET', headers = {}, body, timeout = 10000 }: ProxyRequest = await request.json();

        // Validações básicas
        if (!url || typeof url !== 'string') {
            return NextResponse.json({
                success: false,
                error: 'URL é obrigatória'
            }, { status: 400 });
        }

        if (!url.includes('latamairlines.com') && !url.includes('httpbin.org')) {
            return NextResponse.json({
                success: false,
                error: 'Domínio não permitido'
            }, { status: 403 });
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const optimizedHeaders = {
                'User-Agent': USER_AGENTS[0],
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                'Cache-Control': 'no-cache',
                ...headers
            };

            const fetchOptions: RequestInit = {
                method,
                headers: optimizedHeaders,
                signal: controller.signal,
            };

            if (body && method !== 'GET' && method !== 'HEAD') {
                fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
            }

            const response = await fetch(url, fetchOptions);
            clearTimeout(timeoutId);

            if (!response.ok) {
                return NextResponse.json({
                    success: false,
                    error: `HTTP ${response.status}: ${response.statusText}`,
                    status: response.status
                });
            }

            const responseText = await response.text();

            if (!responseText) {
                return NextResponse.json({
                    success: false,
                    error: 'Resposta vazia'
                });
            }

            try {
                const jsonData = JSON.parse(responseText);
                return NextResponse.json({
                    success: true,
                    data: jsonData,
                    status: response.status
                });
            } catch {
                return NextResponse.json({
                    success: true,
                    data: responseText,
                    status: response.status
                });
            }

        } catch (error: unknown) {
            clearTimeout(timeoutId);

            if (error === 'AbortError') {
                return NextResponse.json({
                    success: false,
                    error: `Timeout após ${timeout}ms`
                });
            }

            return NextResponse.json({
                success: false,
                error: error || 'Erro de conexão'
            });
        }

    } catch (error: unknown) {
        return NextResponse.json({
            success: false,
            error: error || 'Erro interno do servidor'
        }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        success: true,
        message: 'Proxy API está funcionando',
        environment: process.env.VERCEL ? 'vercel' : 'local',
        timestamp: new Date().toISOString()
    });
}