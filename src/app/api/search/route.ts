// app/api/proxy/route.ts - VERSÃO VERCEL OTIMIZADA
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // Edge runtime para melhor performance

interface ProxyRequest {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    body?: BodyInit | Record<string, unknown>;
    timeout?: number;
}

// User-Agents realistas para rotação
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
];

export async function POST(request: NextRequest) {
    const requestId = Math.random().toString(36).substring(2, 15);

    try {
        const { url, method = 'GET', headers = {}, body, timeout = 18000 }: ProxyRequest = await request.json();

        // Validação de segurança reforçada
        if (!url || typeof url !== 'string') {
            return NextResponse.json({
                success: false,
                error: 'URL é obrigatória e deve ser uma string'
            }, { status: 400 });
        }

        if (!url.includes('latamairlines.com')) {
            return NextResponse.json({
                success: false,
                error: 'URL não permitida - apenas domínios LATAM são aceitos'
            }, { status: 403 });
        }

        console.log(`🔍 [${requestId}] Proxy para: ${new URL(url).origin}...`);

        const result = await makeRequestWithTimeout(
            url,
            method,
            headers,
            timeout,
            requestId,
            body
        );

        return NextResponse.json(result);

    } catch (error: unknown) {
        console.error(`💥 [${requestId}] Erro no proxy:`, error);

        const err = error as { message?: string } | undefined;

        return NextResponse.json({
            success: false,
            error: err?.message ?? String(error) ?? 'Erro interno do servidor'
        }, { status: 500 });
    }
}

async function makeRequestWithTimeout(
    url: string,
    method: string,
    headers: Record<string, string>,
    timeout: number,
    requestId: string,
    body?: BodyInit | Record<string, unknown>,
): Promise<{ success: boolean; data?: unknown; error?: string; status?: number }> {

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        console.log(`⏰ [${requestId}] Timeout após ${timeout}ms`);
        controller.abort();
    }, timeout);

    try {
        // Headers otimizados para Vercel + LATAM
        const optimizedHeaders = {
            'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cache-Control': 'no-cache',
            'DNT': '1',
            'Upgrade-Insecure-Requests': '1',
            // Headers para evitar bloqueio
            'sec-ch-ua': '"Google Chrome";v="120", "Chromium";v="120", "Not?A_Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            ...headers
        };

        const fetchOptions: RequestInit = {
            method,
            headers: optimizedHeaders,
            signal: controller.signal,
        };

        if (body && method !== 'GET' && method !== 'HEAD') {
            // If body is already a valid BodyInit (string, FormData, URLSearchParams, Blob, ArrayBuffer), use it directly.
            // Otherwise, serialize objects to JSON.
            const isDirectBody =
                typeof body === 'string' ||
                (typeof FormData !== 'undefined' && body instanceof FormData) ||
                (typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams) ||
                (typeof Blob !== 'undefined' && body instanceof Blob) ||
                (body instanceof ArrayBuffer);
            if (isDirectBody) {
                fetchOptions.body = body as BodyInit;
            } else {
                fetchOptions.body = JSON.stringify(body);
                // ensure content-type header for JSON if not provided
                const hdrs = fetchOptions.headers as Record<string, string>;
                if (!hdrs['Content-Type'] && !hdrs['content-type']) {
                    hdrs['Content-Type'] = 'application/json';
                }
            }
        }

        console.log(`🚀 [${requestId}] Fazendo requisição para LATAM...`);
        const startTime = Date.now();

        const response = await fetch(url, fetchOptions);
        const endTime = Date.now();

        clearTimeout(timeoutId);

        console.log(`📊 [${requestId}] Response em ${endTime - startTime}ms - Status: ${response.status}`);

        if (!response.ok) {
            return {
                success: false,
                error: `HTTP ${response.status}: ${response.statusText}`,
                status: response.status
            };
        }

        const responseText = await response.text();

        if (!responseText) {
            return {
                success: false,
                error: 'Resposta vazia do servidor'
            };
        }

        console.log(`📦 [${requestId}] Resposta recebida: ${responseText.length} caracteres`);

        // Tenta parsear como JSON, senão retorna como texto
        try {
            const jsonData = JSON.parse(responseText);
            return {
                success: true,
                data: jsonData,
                status: response.status
            };
        } catch {
            return {
                success: true,
                data: responseText,
                status: response.status
            };
        }

    } catch (error: unknown) {
        clearTimeout(timeoutId);

        // Verifica se o erro tem a propriedade 'name' e corresponde a AbortError
        if (typeof (error as { name?: unknown }).name === 'string' && (error as { name?: string }).name === 'AbortError') {
            return {
                success: false,
                error: `Timeout: A requisição excedeu ${timeout}ms`
            };
        }

        // Obtém mensagem de erro de forma segura
        const message = error instanceof Error ? error.message : String(error);

        return {
            success: false,
            error: message || 'Erro de conexão'
        };
    }
}

export async function GET(request: NextRequest) {
    return NextResponse.json({
        success: true,
        message: 'Proxy API está funcionando',
        environment: process.env.VERCEL ? 'vercel' : 'local',
        region: process.env.VERCEL_REGION || 'unknown',
        timestamp: new Date().toISOString()
    });
}