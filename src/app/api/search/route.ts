// app/api/search/route.ts - SOLUÇÃO DE PROXY
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

// Pool de User-Agents realistas para rotación
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0'
];

// Estratégias de retry com backoff exponencial
const RETRY_STRATEGIES = [
    { delay: 1000, timeout: 8000 },  // Primeira tentativa: 8s
    { delay: 2000, timeout: 10000 }, // Segunda tentativa: 10s  
    { delay: 3000, timeout: 12000 }  // Terceira tentativa: 12s
];

export async function POST(request: NextRequest) {
    try {
        const body: RequestBody = await request.json();
        const { url, headers = {}, method = 'GET', extractToken = false } = body;

        console.log('🔍 Iniciando requisição estratégica para:', url);

        // Estratégia: Tentativas com diferentes configurações
        for (let attempt = 0; attempt < RETRY_STRATEGIES.length; attempt++) {
            const strategy = RETRY_STRATEGIES[attempt];

            console.log(`🔄 Tentativa ${attempt + 1} com estratégia: ${strategy.timeout}ms`);

            try {
                const result = await executeStrategicRequest(
                    url,
                    headers,
                    method,
                    extractToken,
                    strategy,
                    attempt
                );

                if (result.success) {
                    console.log(`✅ Sucesso na tentativa ${attempt + 1}`);
                    return result.response;
                }

            } catch (err: unknown) {
                const errMessage = err instanceof Error ? err.message : String(err);
                console.log(`❌ Tentativa ${attempt + 1} falhou:`, errMessage);

                if (attempt === RETRY_STRATEGIES.length - 1) {
                    throw err; // Última tentativa
                }

                // Aguarda antes da próxima tentativa
                await new Promise(resolve => setTimeout(resolve, strategy.delay));
            }
        }

        throw new Error('Todas as estratégias falharam');

    } catch (error: unknown) {
        console.error('❌ Erro crítico na API search:', error);
        return NextResponse.json({
            success: false,
            error: 'Falha de conexão com o provedor',
            data: null
        }, { status: 502 });
    }
}

async function executeStrategicRequest(
    url: string,
    originalHeaders: RequestHeaders,
    method: string,
    extractToken: boolean,
    strategy: { timeout: number },
    attempt: number
) {
    // 1. OTIMIZAÇÃO DE HEADERS PARA EVASÃO DE BLOQUEIO
    const strategicHeaders = optimizeHeadersForLatam(originalHeaders, attempt);

    // 2. CONTROLLER COM TIMEOUT ESTRATÉGICO
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), strategy.timeout);

    try {
        console.log(`🎯 Executando com headers otimizados (tentativa ${attempt + 1})`);

        const response = await fetch(url, {
            method: method,
            headers: strategicHeaders,
            signal: controller.signal,
            // Configurações adicionais para evasão
            cache: 'no-store',
            redirect: 'follow'
        });

        clearTimeout(timeoutId);

        console.log(`📊 Resposta recebida - Status: ${response.status}`);

        // 3. ANÁLISE DA RESPOSTA
        if (!response.ok) {
            const errorData = await analyzeErrorResponse(response);
            throw new Error(`HTTP ${response.status}: ${errorData}`);
        }

        const data = await response.text();

        // 4. VALIDAÇÃO DO CONTEÚDO
        if (!isValidResponse(data, extractToken)) {
            throw new Error('Resposta inválida ou bloqueada');
        }

        let finalData = data;

        if (extractToken) {
            const tokenMatch = data.match(/"searchToken":"([^"]*)"/);
            if (tokenMatch && tokenMatch[1]) {
                finalData = tokenMatch[1];
                console.log('✅ Token extraído com sucesso');
            } else {
                throw new Error('Token não encontrado na resposta');
            }
        }

        return {
            success: true,
            response: NextResponse.json({
                success: true,
                data: finalData,
                error: null,
                attempt: attempt + 1
            })
        };

    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

function optimizeHeadersForLatam(originalHeaders: RequestHeaders, attempt: number): RequestHeaders {
    // Headers base otimizados para a LATAM
    const baseHeaders: RequestHeaders = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'DNT': '1',
        'Upgrade-Insecure-Requests': '1'
    };

    // Rotação de User-Agent
    const userAgentIndex = attempt % USER_AGENTS.length;
    baseHeaders['User-Agent'] = USER_AGENTS[userAgentIndex];

    // Headers específicos para API da LATAM (segunda requisição)
    if (originalHeaders['x-latam-search-token']) {
        baseHeaders['accept'] = 'application/json, text/plain, */*';
        baseHeaders['priority'] = 'u=1, i';
        baseHeaders['sec-ch-ua'] = '"Google Chrome";v="141", "Not-A.Brand";v="8", "Chromium";v="141"';
        baseHeaders['sec-ch-ua-mobile'] = '?0';
        baseHeaders['sec-ch-ua-platform'] = '"Windows"';
        baseHeaders['sec-fetch-dest'] = 'empty';
        baseHeaders['sec-fetch-mode'] = 'cors';
        baseHeaders['sec-fetch-site'] = 'same-origin';

        // Headers específicos da LATAM
        baseHeaders['x-latam-action-name'] = originalHeaders['x-latam-action-name'] || 'search-result.flightselection.offers-search';
        baseHeaders['x-latam-app-session-id'] = originalHeaders['x-latam-app-session-id'] || generateSessionId();
        baseHeaders['x-latam-application-country'] = 'BR';
        baseHeaders['x-latam-application-lang'] = 'pt';
        baseHeaders['x-latam-application-name'] = 'web-air-offers';
        baseHeaders['x-latam-application-oc'] = 'br';
        baseHeaders['x-latam-client-name'] = 'web-air-offers';
        baseHeaders['x-latam-device-width'] = '1920';
        baseHeaders['x-latam-request-id'] = originalHeaders['x-latam-request-id'] || generateRequestId();
        baseHeaders['x-latam-search-token'] = originalHeaders['x-latam-search-token'];
        baseHeaders['x-latam-track-id'] = originalHeaders['x-latam-track-id'] || generateTrackId();
    }

    // Mescla com headers originais (priorizando os otimizados)
    return { ...originalHeaders, ...baseHeaders };
}

async function analyzeErrorResponse(response: Response): Promise<string> {
    try {
        const text = await response.text();

        // Análise de padrões de bloqueio
        if (text.includes('cloudflare') || text.includes('captcha') || text.includes('access denied')) {
            return 'Bloqueado por WAF/Cloudflare';
        }

        if (text.includes('rate limit') || text.includes('too many requests')) {
            return 'Rate limiting ativo';
        }

        if (response.status === 403) {
            return 'Acesso negado (403)';
        }

        if (response.status === 429) {
            return 'Muitas requisições (429)';
        }

        return `Status: ${response.status}`;

    } catch {
        return `Status: ${response.status} (sem corpo)`;
    }
}

function isValidResponse(data: string, extractToken: boolean): boolean {
    if (!data || data.length < 10) return false;

    if (extractToken) {
        return /"searchToken":"[^"]*"/.test(data);
    }

    // Para ofertas, verifica se é JSON válido ou contém dados esperados
    try {
        if (data.startsWith('{') || data.startsWith('[')) {
            JSON.parse(data);
        }
        return true;
    } catch {
        return data.includes('content') || data.includes('offers') || data.includes('flights');
    }
}

function generateSessionId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function generateRequestId(): string {
    return generateSessionId(); // Mesmo formato
}

function generateTrackId(): string {
    return generateSessionId(); // Mesmo formato
}

// Health check com diagnóstico
export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const diagnostic = url.searchParams.get('diagnostic');

    if (diagnostic) {
        // Teste de conectividade com a LATAM
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const testResponse = await fetch('https://www.latamairlines.com/br/pt', {
                method: 'HEAD',
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            return NextResponse.json({
                success: true,
                message: 'Diagnóstico de conectividade',
                latamAccessible: testResponse.ok,
                latamStatus: testResponse.status,
                environment: process.env.VERCEL ? 'vercel' : 'local',
                timestamp: new Date().toISOString()
            });

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);

            return NextResponse.json({
                success: false,
                message: 'Diagnóstico de conectividade',
                latamAccessible: false,
                error: errorMessage,
                environment: process.env.VERCEL ? 'vercel' : 'local',
                timestamp: new Date().toISOString()
            });
        }
    }

    return NextResponse.json({
        success: true,
        message: 'Search API is running',
        environment: process.env.VERCEL ? 'vercel' : 'local',
        timestamp: new Date().toISOString()
    });
}