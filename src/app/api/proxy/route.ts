import { NextRequest, NextResponse } from 'next/server';

// ⚙️ Força o uso de Node.js runtime
export const runtime = 'nodejs';

// Permite tempo maior de execução
export const maxDuration = 60;

interface RequestHeaders {
    [key: string]: string;
}

interface RequestBody {
    url: string;
    headers?: RequestHeaders;
    method?: string;
    extractToken?: boolean;
    body?: unknown;
    timeout?: number;
}

export async function POST(request: NextRequest) {
    try {
        const body: RequestBody = await request.json();
        const { url, headers = {}, method = 'GET', body: reqBody, extractToken = false, timeout = 30000 } = body;

        console.log('🔍 Recebida requisição proxy:', { url, method, extractToken });

        // 🛡️ Validação da URL
        if (!url || !url.startsWith('https://www.latamairlines.com')) {
            return NextResponse.json(
                { success: false, error: 'URL inválida ou não permitida', data: null },
                { status: 400 }
            );
        }

        // ⏱️ Timeout manual com AbortController
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        let response: Response;

        try {
            response = await fetch(url, {
                method,
                headers: {
                    ...headers,
                    'Accept': headers['Accept'] || 'application/json, text/plain, */*',
                    'Accept-Language': headers['Accept-Language'] || 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                    'User-Agent': headers['User-Agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                },
                body: method !== 'GET' && reqBody ? JSON.stringify(reqBody) : undefined,
                signal: controller.signal,
            });
        } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === 'AbortError') {
                console.error('❌ Timeout na requisição');
                return NextResponse.json(
                    { success: false, error: 'Timeout na requisição', data: null },
                    { status: 408 }
                );
            }
            throw error;
        }

        clearTimeout(timeoutId);

        console.log('📊 Status da resposta:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Erro ao ler corpo de erro');
            console.error('❌ Erro da LATAM:', response.status, errorText.slice(0, 300));
            return NextResponse.json(
                { success: false, error: `Erro HTTP ${response.status}`, data: null },
                { status: response.status }
            );
        }

        const responseText = await response.text();
        console.log('📦 Tamanho da resposta:', responseText.length, 'bytes');

        // 🔍 Extração opcional do token
        if (extractToken) {
            const tokenMatch = responseText.match(/"searchToken":"([^"]+)"/);
            if (tokenMatch) {
                console.log('✅ Token extraído com sucesso');
                return NextResponse.json({ success: true, data: tokenMatch[1], error: null });
            }
            console.error('❌ Token não encontrado na resposta');
            return NextResponse.json({ success: false, error: 'Token não encontrado', data: null });
        }

        return NextResponse.json({ success: true, data: responseText, error: null });
    } catch (err) {
        console.error('💥 Erro interno do proxy:', err);
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        return NextResponse.json(
            { success: false, error: `Erro interno do servidor: ${message}`, data: null },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json(
        { success: false, error: 'Método não permitido', data: null },
        { status: 405 }
    );
}
