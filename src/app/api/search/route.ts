// app/api/search/route.ts - VERSÃO GET SIMPLES
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(request: NextRequest) {
    const requestId = Math.random().toString(36).substring(2, 10);

    console.log(`🔍 [${requestId}] Iniciando busca DIRETA via GET...`);

    try {
        const { searchParams } = new URL(request.url);

        // Parâmetros da busca
        const origin = searchParams.get('origin') || 'BSB';
        const destination = searchParams.get('destination') || 'GRU';
        const outbound = searchParams.get('outbound') || '2025-11-17T15:00:00.000Z';
        const inbound = searchParams.get('inbound') || '2025-11-21T15:00:00.000Z';
        const adt = searchParams.get('adt') || '1';
        const chd = searchParams.get('chd') || '0';
        const inf = searchParams.get('inf') || '0';
        const trip = searchParams.get('trip') || 'RT';
        const cabin = searchParams.get('cabin') || 'Economy';
        const redemption = searchParams.get('redemption') || 'false';
        const sort = searchParams.get('sort') || 'RECOMMENDED';
        const exp_id = searchParams.get('exp_id') || generateExpId();

        // Construir URL da LATAM
        const latamUrl = `https://www.latamairlines.com/br/pt/oferta-voos?origin=${origin}&outbound=${outbound}&destination=${destination}&adt=${adt}&chd=${chd}&inf=${inf}&trip=${trip}&cabin=${cabin}&redemption=${redemption}&sort=${sort}&inbound=${inbound}&exp_id=${exp_id}`;

        console.log(`🌐 [${requestId}] URL LATAM: ${latamUrl}`);

        // Headers otimizados para LATAM
        const headers = {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cache-Control': 'no-cache',
            'DNT': '1',
            'Upgrade-Insecure-Requests': '1'
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
            const startTime = Date.now();
            const response = await fetch(latamUrl, {
                method: 'GET',
                headers: headers,
                signal: controller.signal,
            });

            const endTime = Date.now();
            clearTimeout(timeoutId);

            console.log(`📊 [${requestId}] Response em ${endTime - startTime}ms - Status: ${response.status}`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();

            if (!html) {
                throw new Error('Resposta vazia da LATAM');
            }

            console.log(`✅ [${requestId}] HTML recebido: ${html.length} caracteres`);

            // Extrair token
            const tokenMatch = html.match(/"searchToken":"([^"]*)"/);
            if (tokenMatch && tokenMatch[1]) {
                const token = tokenMatch[1];
                console.log(`🔑 [${requestId}] Token encontrado: ${token.substring(0, 50)}...`);

                // Retornar APENAS o token como texto puro
                return new Response(token, {
                    status: 200,
                    headers: {
                        'Content-Type': 'text/plain',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    },
                });
            } else {
                throw new Error('Token não encontrado na resposta');
            }

        } catch (error: any) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('Timeout: Requisição excedeu 15 segundos');
            }

            throw error;
        }

    } catch (error: any) {
        console.error(`💥 [${requestId}] Erro:`, error.message);

        return new Response(`ERROR: ${error.message}`, {
            status: 500,
            headers: {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
}

// Gerar exp_id aleatório
function generateExpId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Handler para OPTIONS (CORS)
export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}