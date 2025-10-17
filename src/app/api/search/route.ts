// app/api/search/route.ts - VERSÃO CORRIGIDA
import { NextRequest, NextResponse } from 'next/server';

interface RequestHeaders {
    [key: string]: string;
}

interface RequestBody {
    url: string;
    headers?: RequestHeaders;
    method?: string;
    extractToken?: boolean;
    useFetch?: boolean;
}

// Configurações otimizadas para Vercel
const VERCELL_CONFIG = {
    timeout: 10000, // 10 segundos máximo
    retries: 2,
    retryDelay: 1000
};

// REMOVER runtime: 'edge' - usar Node.js runtime padrão

export async function POST(request: NextRequest) {
    const requestId = generateRequestId();

    console.log(`🔍 [${requestId}] Iniciando requisição para API LATAM`);

    try {
        const body: RequestBody = await request.json();
        const { url, headers = {}, method = 'GET', extractToken = false } = body;

        // Validação básica
        if (!url) {
            return NextResponse.json({
                success: false,
                error: 'URL é obrigatória',
                data: null
            }, { status: 400 });
        }

        // Estratégia de retry otimizada
        for (let attempt = 0; attempt <= VERCELL_CONFIG.retries; attempt++) {
            try {
                console.log(`🔄 [${requestId}] Tentativa ${attempt + 1}`);

                const result = await fetchWithTimeout(
                    url,
                    headers,
                    method,
                    extractToken,
                    requestId
                );

                if (result.success) {
                    console.log(`✅ [${requestId}] Sucesso na tentativa ${attempt + 1}`);
                    return NextResponse.json(result);
                }

            } catch (error: unknown) {
                console.log(`❌ [${requestId}] Tentativa ${attempt + 1} falhou:`, error instanceof Error ? error.message : String(error));

                if (attempt === VERCELL_CONFIG.retries) {
                    throw error;
                }

                // Aguarda antes da próxima tentativa
                await new Promise(resolve => setTimeout(resolve, VERCELL_CONFIG.retryDelay));
            }
        }

        throw new Error('Todas as tentativas falharam');

    } catch (error: unknown) {
        console.error(`💥 [${requestId}] Erro crítico:`, error);

        return NextResponse.json({
            success: false,
            error: getErrorMessage(error),
            data: null
        }, { status: 502 });
    }
}

async function fetchWithTimeout(
    url: string,
    headers: RequestHeaders,
    method: string,
    extractToken: boolean,
    requestId: string
): Promise<{ success: boolean; data?: unknown; error?: string }> {

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), VERCELL_CONFIG.timeout);

    try {
        // Headers otimizados
        const optimizedHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cache-Control': 'no-cache',
            ...headers
        };

        console.log(`🌐 [${requestId}] Fetching: ${url.substring(0, 100)}...`);

        const response = await fetch(url, {
            method: method,
            headers: optimizedHeaders,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log(`📊 [${requestId}] Status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseText = await response.text();

        if (!responseText) {
            throw new Error('Resposta vazia');
        }

        // Extração de token se necessário
        if (extractToken) {
            const tokenMatch = responseText.match(/"searchToken":"([^"]*)"/);
            if (tokenMatch && tokenMatch[1]) {
                console.log(`✅ [${requestId}] Token extraído com sucesso`);
                return {
                    success: true,
                    data: tokenMatch[1]
                };
            } else {
                throw new Error('Token não encontrado na resposta');
            }
        }

        // Valida se é JSON válido
        try {
            const jsonData = JSON.parse(responseText);
            return {
                success: true,
                data: jsonData
            };
        } catch {
            return {
                success: true,
                data: responseText
            };
        }

    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        if (error.name === 'AbortError') {
            return 'Timeout: A requisição excedeu o tempo limite';
        }
        return error.message;
    }
    return 'Erro desconhecido';
}

function generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}

// Health check
export async function GET(request: NextRequest) {
    return NextResponse.json({
        success: true,
        message: 'Search API is running',
        environment: process.env.VERCEL ? 'vercel' : 'local',
        timestamp: new Date().toISOString(),
        region: process.env.VERCEL_REGION || 'unknown'
    });
}