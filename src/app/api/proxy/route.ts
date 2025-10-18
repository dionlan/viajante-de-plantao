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
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
];

export async function POST(request: NextRequest) {
    const requestId = Math.random().toString(36).substring(2, 10);

    try {
        const { url, method = 'GET', headers = {}, body, timeout = 10000 }: ProxyRequest = await request.json();

        // Validações
        if (!url || typeof url !== 'string') {
            return NextResponse.json({
                success: false,
                error: 'URL é obrigatória'
            }, { status: 400 });
        }

        let parsedUrl: URL;
        try {
            parsedUrl = new URL(url);
        } catch {
            return NextResponse.json({
                success: false,
                error: 'URL inválida'
            }, { status: 400 });
        }

        if (!parsedUrl.hostname.includes('latamairlines.com') &&
            !parsedUrl.hostname.includes('httpbin.org')) {
            return NextResponse.json({
                success: false,
                error: 'Domínio não permitido'
            }, { status: 403 });
        }

        console.log(`🔍 [${requestId}] Proxy para: ${parsedUrl.hostname}`);

        const result = await makeRequestWithTimeout(
            url,
            method,
            headers,
            body,
            timeout,
            requestId
        );

        return NextResponse.json(result);

    } catch (error: unknown) {
        console.error(`💥 [${requestId}] Erro:`, error);

        return NextResponse.json({
            success: false,
            error: error || 'Erro interno do servidor'
        }, { status: 500 });
    }
}

async function makeRequestWithTimeout(
    url: string,
    method: string,
    headers: Record<string, string>,
    body: unknown,
    timeout: number,
    requestId: string
): Promise<{ success: boolean; data?: unknown; error?: string; status?: number }> {

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const optimizedHeaders = {
            'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cache-Control': 'no-cache',
            'DNT': '1',
            'Upgrade-Insecure-Requests': '1',
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
            fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
        }

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
                error: 'Resposta vazia'
            };
        }

        console.log(`📦 [${requestId}] Resposta: ${responseText.length} chars`);

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

        if (error === 'AbortError') {
            return {
                success: false,
                error: `Timeout após ${timeout}ms`
            };
        }

        return {
            success: false,
            error: 'Erro de conexão'
        };
    }
}

export async function GET() {
    return NextResponse.json({
        success: true,
        message: 'Proxy API está funcionando',
        environment: process.env.VERCEL ? 'vercel' : 'local',
        region: process.env.VERCEL_REGION || 'unknown',
        timestamp: new Date().toISOString()
    });
}