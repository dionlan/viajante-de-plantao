// app/api/proxy/route.ts - PROXY UNIVERSAL
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // Melhor performance no Vercel

interface ProxyRequest {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
    timeout?: number;
}

export async function POST(request: NextRequest) {
    try {
        const { url, method = 'GET', headers = {}, body, timeout = 8000 }: ProxyRequest = await request.json();

        // Validação de segurança
        if (!url || !url.includes('latamairlines.com')) {
            return NextResponse.json({
                success: false,
                error: 'URL não permitida'
            }, { status: 400 });
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const fetchOptions: RequestInit = {
                method,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Cache-Control': 'no-cache',
                    ...headers
                },
                signal: controller.signal,
            };

            if (body && method !== 'GET') {
                fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
            }

            const response = await fetch(url, fetchOptions);
            clearTimeout(timeoutId);

            if (!response.ok) {
                return NextResponse.json({
                    success: false,
                    error: `HTTP ${response.status}`,
                    status: response.status
                });
            }

            const data = await response.text();

            return NextResponse.json({
                success: true,
                data: data,
                status: response.status,
                headers: Object.fromEntries(response.headers)
            });

        } catch (error: unknown) {
            clearTimeout(timeoutId);
            throw error;
        }

    } catch (error: unknown) {
        console.error('Proxy error:', error);

        const errInfo = ((): { name?: string; message: string } => {
            if (error instanceof Error) return { name: error.name, message: error.message };
            if (typeof error === 'object' && error !== null && 'message' in error) {
                const e = error as { name?: string; message?: unknown };
                return { name: e.name, message: typeof e.message === 'string' ? e.message : String(e.message) };
            }
            return { message: String(error) };
        })();

        return NextResponse.json({
            success: false,
            error: errInfo.name === 'AbortError' ? 'Timeout' : errInfo.message
        }, { status: 502 });
    }
}