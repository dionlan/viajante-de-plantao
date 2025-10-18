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

export async function POST(request: NextRequest) {
    try {
        const body: RequestBody = await request.json();
        const { url, headers = {}, method = 'GET', extractToken = false } = body;

        console.log('🔍 Recebida requisição proxy:', { url, method, extractToken });

        // Validação da URL
        if (!url || !url.startsWith('https://www.latamairlines.com')) {
            return NextResponse.json({
                success: false,
                error: 'URL inválida ou não permitida',
                data: null
            }, { status: 400 });
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    ...headers,
                    // Headers padrão para evitar bloqueios
                    'Accept': headers.accept || 'application/json, text/plain, */*',
                    'Accept-Language': headers['accept-language'] || 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                    'User-Agent': headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            console.log('📊 Status da resposta:', response.status, response.statusText);

            if (!response.ok) {
                let errorText = '';
                try {
                    errorText = await response.text();
                } catch {
                    errorText = 'Não foi possível ler o corpo do erro';
                }

                console.error('❌ Erro na resposta:', response.status, errorText.substring(0, 500));

                return NextResponse.json({
                    success: false,
                    error: `HTTP error! status: ${response.status}`,
                    data: null
                }, { status: response.status });
            }

            const responseText = await response.text();

            let finalData = responseText;
            if (extractToken) {
                console.log('🔍 Extraindo token da resposta...');
                const tokenMatch = responseText.match(/"searchToken":"([^"]*)"/);
                if (tokenMatch && tokenMatch[1]) {
                    finalData = tokenMatch[1];
                    console.log('✅ Token extraído:', finalData.substring(0, 50) + '...');
                } else {
                    console.error('❌ Token não encontrado na resposta');
                    return NextResponse.json({
                        success: false,
                        error: 'Token não encontrado na resposta',
                        data: null
                    });
                }
            }

            console.log('✅ Proxy concluído, tamanho:', finalData.length, 'caracteres');

            return NextResponse.json({
                success: true,
                data: finalData,
                error: null
            });

        } catch (error: unknown) {
            clearTimeout(timeoutId);

            if (error instanceof Error && error.name === 'AbortError') {
                console.error('❌ Timeout na requisição');
                return NextResponse.json({
                    success: false,
                    error: 'Timeout na requisição',
                    data: null
                }, { status: 408 });
            }

            throw error;
        }

    } catch (error: unknown) {
        console.error('❌ Erro no proxy:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

        return NextResponse.json({
            success: false,
            error: `Erro interno do servidor: ${errorMessage}`,
            data: null
        }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        success: false,
        error: 'Método não permitido',
        data: null
    }, { status: 405 });
}