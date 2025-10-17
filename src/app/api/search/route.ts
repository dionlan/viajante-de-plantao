import { NextRequest, NextResponse } from 'next/server';

// Interface para os headers
interface RequestHeaders {
    [key: string]: string;
}

// Interface para o corpo da requisição
interface RequestBody {
    url: string;
    headers?: RequestHeaders;
    method?: string;
    useFetch?: boolean;
    extractToken?: boolean;
    command?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: RequestBody = await request.json();
        const { url, headers = {}, method = 'GET', useFetch = false } = body;

        console.log('🔍 Recebida requisição:', { url, method, useFetch });

        if (useFetch) {
            return await handleFetchRequest(url, headers, method);
        } else {
            return await handleCurlRequest(url, headers, method, body.extractToken || false, body.command);
        }

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

async function handleFetchRequest(url: string, headers: RequestHeaders, method: string) {
    console.log('🔍 Executando fetch para:', url);
    console.log('📋 Número de headers:', Object.keys(headers).length);

    // Log dos headers (sem valores sensíveis)
    const safeHeaders = { ...headers };
    if (safeHeaders.Cookie) safeHeaders.Cookie = '[REDACTED]';
    if (safeHeaders['x-latam-search-token']) safeHeaders['x-latam-search-token'] = safeHeaders['x-latam-search-token'].substring(0, 50) + '...';

    console.log('📋 Headers seguros:', safeHeaders);

    try {
        const response = await fetch(url, {
            method: method,
            headers: headers,
        });

        console.log('📊 Status da resposta:', response.status, response.statusText);

        // Log dos headers de resposta
        console.log('📋 Headers da resposta:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Corpo do erro:', errorText.substring(0, 500));
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.text();
        console.log('✅ Fetch concluído, tamanho:', data.length, 'caracteres');
        console.log('✅ Resposta completa:', data);
        /* if (data.length < 1000) {
            console.log('📦 Resposta completa:', data);
        } else {
            console.log('📦 Primeiros 999 chars:', data.substring(0, 999));
            console.log('📦 Últimos 999 chars:', data.substring(data.length - 999));
        } */

        return NextResponse.json({
            success: true,
            data: data,
            error: null
        });
    } catch (error: unknown) {
        console.error('❌ Erro no fetch:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no fetch';
        return NextResponse.json({
            success: false,
            error: errorMessage,
            data: null
        });
    }
}

async function handleCurlRequest(
    url: string,
    headers: RequestHeaders,
    method: string,
    extractToken: boolean = false,
    command?: string
) {
    let finalCommand: string;

    if (command) {
        finalCommand = command;
    } else {
        const headersString = Object.entries(headers)
            .map(([key, value]) => `-H "${key}: ${value}"`)
            .join(' ');

        finalCommand = `curl -s -X ${method} "${url}" ${headersString} --compressed --connect-timeout 30 --max-time 60`;
    }

    console.log('📋 Comando curl:', finalCommand);

    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    const { stdout, stderr } = await execAsync(finalCommand);

    if (stderr && !stderr.includes('Warning')) {
        console.error('❌ Erro no curl:', stderr);
        return NextResponse.json({
            success: false,
            error: `Erro no curl: ${stderr}`,
            data: null
        });
    }

    if (!stdout || stdout.trim().length === 0) {
        console.error('❌ Resposta vazia do servidor');
        return NextResponse.json({
            success: false,
            error: 'Resposta vazia do servidor',
            data: null
        });
    }

    console.log('✅ Curl concluído, tamanho:', stdout.length, 'caracteres');

    let finalData = stdout;
    if (extractToken) {
        console.log('🔍 Extraindo token da resposta...');
        const tokenMatch = stdout.match(/"searchToken":"([^"]*)"/);
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

    return NextResponse.json({
        success: true,
        data: finalData,
        error: null
    });
}