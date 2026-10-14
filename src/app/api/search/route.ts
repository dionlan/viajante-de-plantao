// src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getLatamSession, invalidateLatamSession } from './_lib/session-farm';
import { SearchType } from '@/lib/types';

// =========================
// Interfaces
// =========================
interface RequestBody {
    url: string;
    searchOffers?: boolean;
    searchType: SearchType;
    headers?: Record<string, string>;
    method?: string;
    useFetch?: boolean;
    extractToken?: boolean;
    command?: string;
}

// =========================
// POST handler
// =========================
export async function POST(request: NextRequest) {
    try {
        const body: RequestBody = await request.json();

        console.log('📨 BODY RECEBIDO:', {
            url: body.url,
            searchOffers: body.searchOffers,
            searchType: body.searchType,
        });

        if (body.searchOffers) {
            console.log(`🎯 MODO: searchOffers (${body.searchType})`);

            const session = await getLatamSession(body.url, body.searchType);

            if (session.offersJson) {
                return NextResponse.json({
                    success: true,
                    data: session.offersJson,
                    error: null,
                });
            }
        }

        // Modos legados...
    }  catch (error: unknown) {
        console.error('❌ Erro na API search:', error);
        const msg = error instanceof Error ? error.message : 'Erro desconhecido';
        return NextResponse.json(
            { success: false, error: `Erro interno: ${msg}`, data: null },
            { status: 500 },
        );
    }
}

// =========================
// FETCH handler (legado)
// =========================
async function handleFetchRequest(
    url: string,
    headers: Record<string, string>,
    method: string,
) {
    try {
        const response = await fetch(url, { method, headers });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText.substring(0, 200)}`);
        }

        const data = await response.text();
        return NextResponse.json({ success: true, data, error: null });
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Erro desconhecido';
        return NextResponse.json({ success: false, error: msg, data: null });
    }
}

// =========================
// CURL handler (legado)
// =========================
async function handleCurlRequest(
    url: string,
    headers: Record<string, string>,
    method: string,
    _extractToken: boolean = false,
    command?: string,
) {
    let finalCommand: string;

    if (command) {
        finalCommand = command;
    } else {
        const escape = (v: string) =>
            v
                .replace(/\\/g, '\\\\')
                .replace(/"/g, '\\"')
                .replace(/\$/g, '\\$')
                .replace(/`/g, '\\`');

        const headersString = Object.entries(headers)
            .map(([k, v]) => `-H "${escape(`${k}: ${v}`)}"`)
            .join(' ');

        finalCommand = `curl -sS -L -X ${method} "${escape(url)}" ${headersString} --compressed --connect-timeout 60 --max-time 120`;
    }

    console.log('📋 Comando curl (tamanho):', finalCommand.length);

    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    try {
        const { stdout, stderr } = await execAsync(finalCommand, {
            maxBuffer: 60 * 1024 * 1024,
            timeout: 130_000,
        });

        if (stderr && stderr.trim().length > 0) {
            console.log('📋 stderr:', stderr.substring(0, 500));
        }

        if (!stdout || !stdout.trim()) {
            return NextResponse.json({
                success: false,
                error: 'Resposta vazia',
                data: null,
            });
        }

        return NextResponse.json({ success: true, data: stdout, error: null });
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Erro desconhecido';
        return NextResponse.json({ success: false, error: msg, data: null });
    }
}