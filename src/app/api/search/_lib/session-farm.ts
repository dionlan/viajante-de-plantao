// src/app/api/search/_lib/session-farm.ts
import 'server-only';
import { chromium, type Browser, type BrowserContext, type Page } from 'patchright';
import path from 'path';
import type { SearchType } from '@/lib/types';

// ============================================================
// Tipos
// ============================================================
export interface LatamSession {
    cookies: string;
    searchToken: string;
    sessionId: string;
    requestId: string;
    trackId: string;
    userAgent: string;
    capturedAt: number;
    expiresAt: number;
    offersJson?: string;
    searchType: SearchType;
    pageUrl: string;
}

// ============================================================
// Config
// ============================================================
const CDP_URL = process.env.LATAM_CDP_URL || 'http://127.0.0.1:9222';
const SESSION_TTL_MS = 15 * 60 * 1000;
const NAVIGATION_TIMEOUT_MS = 45_000;
const BFF_RESPONSE_TIMEOUT_MS = 30_000;
const DEBUG = process.env.LATAM_DEBUG === '1';

// ============================================================
// Logger condicional (zero overhead em produção)
// ============================================================
const log = DEBUG
    ? (...args: unknown[]) => console.log('[farm]', ...args)
    : () => { };

// ============================================================
// ✅ Cache de conexão CDP (reutiliza browser/context)
// ============================================================
let sharedBrowser: Browser | null = null;
let sharedContext: BrowserContext | null = null;
let sharedPage: Page | null = null;

async function getOrCreatePage(): Promise<Page> {
    // ✅ Reutiliza browser conectado
    if (!sharedBrowser || !sharedBrowser.isConnected()) {
        console.log('🔌 Conectando ao Chrome CDP:', CDP_URL);
        sharedBrowser = await chromium.connectOverCDP(CDP_URL);
        sharedContext = null;
        sharedPage = null;
    }

    // ✅ Reutiliza contexto existente
    if (!sharedContext) {
        const contexts = sharedBrowser.contexts();
        if (contexts.length === 0) {
            throw new Error('Nenhum contexto. Abra o Chrome com --remote-debugging-port=9222.');
        }
        sharedContext = contexts[0];
    }

    // ✅ Reutiliza aba existente (mais rápido que newPage)
    if (!sharedPage || sharedPage.isClosed()) {
        sharedPage = await sharedContext.newPage();
        // Bloqueia recursos desnecessários para acelerar
        await sharedPage.route('**/*', (route) => {
            const type = route.request().resourceType();
            // ✅ Não baixa imagens, fontes, media (não precisamos)
            if (['image', 'font', 'media'].includes(type)) {
                return route.abort();
            }
            // ✅ Não baixa JS de tracking (analytics, clarity, etc.)
            const url = route.request().url();
            if (
                url.includes('clarity.ms') ||
                url.includes('google-analytics') ||
                url.includes('googletagmanager') ||
                url.includes('facebook') ||
                url.includes('hotjar') ||
                url.includes('exponea') ||
                url.includes('segment')
            ) {
                return route.abort();
            }
            return route.continue();
        });
    }

    return sharedPage;
}

// ============================================================
// Cache de sessões por (searchType, pageUrl)
// ============================================================
const sessionCache = new Map<string, LatamSession>();

function cacheKey(searchType: SearchType, pageUrl: string): string {
    return `${searchType}::${pageUrl}`;
}

function getCachedSession(
    searchType: SearchType,
    pageUrl: string,
): LatamSession | null {
    const key = cacheKey(searchType, pageUrl);
    const s = sessionCache.get(key);
    if (!s) return null;
    if (Date.now() > s.expiresAt) {
        sessionCache.delete(key);
        return null;
    }
    return s;
}

// ============================================================
// Aceita banner de cookies — SAINDO ASSIM QUE SUMIR
// ============================================================
const COOKIE_BUTTON_NAMES = /aceitar|aceito|ok|concordar/i;
const COOKIE_SELECTORS = [
    '#onetrust-accept-btn-handler',
    '[data-testid*="accept"]',
    '[data-test*="accept"]',
    '[aria-label*="aceitar" i]',
    'button[class*="accept" i]',
    '[class*="cookie"] button',
];

async function acceptCookies(page: Page): Promise<boolean> {
    // ✅ Tenta por role primeiro (mais semântico)
    try {
        const btn = page.getByRole('button', { name: COOKIE_BUTTON_NAMES });
        if ((await btn.count()) > 0) {
            await btn.first().click({ timeout: 1500 });
            console.log('✅ Banner aceito (role)');
            return true;
        }
    } catch { /* continua */ }

    // ✅ Fallback por seletores (mais rápido quando funciona)
    for (const sel of COOKIE_SELECTORS) {
        try {
            const el = page.locator(sel).first();
            if ((await el.count()) > 0) {
                await el.click({ timeout: 1500 });
                console.log(`✅ Banner aceito (${sel})`);
                return true;
            }
        } catch { /* continua */ }
    }

    return false;
}

/**
 * ✅ Loop otimizado: sai assim que o banner desaparece.
 * Antes: 3 tentativas × 2s fixos = 6s.
 * Agora: sai em ~1.5s se o banner já sumiu.
 */
async function tryAcceptCookiesQuick(page: Page): Promise<void> {
    const clicked = await acceptCookies(page);
    if (!clicked) return;

    // Aguarda o banner sumir do DOM (com timeout curto)
    await page
        .locator('[class*="cookie" i], [id*="cookie" i], [class*="consent" i]')
        .first()
        .waitFor({ state: 'detached', timeout: 2000 })
        .catch(() => { /* ignora se não desaparecer */ });
}

// ============================================================
// Farm principal
// ============================================================
export async function getLatamSession(
    pageUrl: string,
    searchType: SearchType,
): Promise<LatamSession> {
    // ✅ 1. Cache hit
    const cached = getCachedSession(searchType, pageUrl);
    if (cached) {
        console.log(`♻️ Cache hit (${searchType})`);
        return cached;
    }

    console.log(`🌐 Farmando sessão (${searchType})...`);

    const page = await getOrCreatePage();

    // ✅ 2. Path do BFF conforme tipo
    // const bffPath =
    //     searchType === 'miles'
    //         ? '/bff/air-offers/v2/offers/search/redemption'
    //         : '/bff/air-offers/v2/offers/search';

    // para obter o token/request-id, session-id, track-id, utiliza-se a consulta que não necessita de milhas 
    // (ele é o mesmo para a área de milhas)
    const bffPath = '/bff/air-offers/v2/offers/search';

    console.log('🎯 Interceptando:', bffPath);

    // ✅ 3. Estado local (não muta objetos externos)
    const captured: Record<string, string> = {};
    let offersJson: string | undefined;
    let responseStatus = 0;

    // ✅ 4. Listeners — captura request E response
    const onRequest = (req: import('patchright').Request) => {
        const u = req.url();
        if (u.includes(bffPath) && !u.includes('/calendar')) {
            const h = req.headers();
            if (h['x-latam-search-token']) {
                Object.assign(captured, h);
                console.log('🎯 Request capturada');
            }
        }
    };

    const onResponse = async (resp: import('patchright').Response) => {
        const u = resp.url();
        if (u.includes(bffPath) && !u.includes('/calendar')) {
            responseStatus = resp.status();
            console.log(`📥 Response: ${responseStatus}`);
            if (responseStatus === 200 && !offersJson) {
                try {
                    offersJson = await resp.text();
                    console.log(`✅ JSON: ${offersJson.length} bytes`);
                } catch { /* ignora */ }
            }
        }
    };

    page.on('request', onRequest);
    page.on('response', onResponse);

    try {
        // ✅ 5. Prepara a wait ANTES de navegar (não perde a response)
        const responsePromise = page
            .waitForResponse(
                (r) => r.url().includes(bffPath) && !r.url().includes('/calendar'),
                { timeout: BFF_RESPONSE_TIMEOUT_MS },
            )
            .catch(() => null);

        // ✅ 6. Navega com timeout curto e corrida contra a response
        console.log('🌐 Navegando...');
        await page.goto(pageUrl, {
            waitUntil: 'domcontentloaded',
            timeout: NAVIGATION_TIMEOUT_MS,
        });

        // ✅ 7. Aceita cookies UMA vez (rápido, sai se não achar)
        await tryAcceptCookiesQuick(page);

        // ✅ 8. Aguarda a response — única fonte de verdade
        console.log('⏳ Aguardando response...');
        const resp = await responsePromise;

        if (resp) {
            responseStatus = resp.status();
            if (responseStatus === 200 && !offersJson) {
                offersJson = await resp.text().catch(() => undefined);
                if (offersJson) {
                    console.log(`✅ JSON: ${offersJson.length} bytes`);
                }
            }
        } else {
            console.log('⚠️ Response não chegou em', BFF_RESPONSE_TIMEOUT_MS, 'ms');
        }
    } finally {
        // ✅ 9. Remove listeners — evita leak entre chamadas
        page.off('request', onRequest);
        page.off('response', onResponse);
    }

    // ✅ 10. Captura cookies (com fallback)
    let cookies = '';
    try {
        const list = await sharedContext!.cookies();
        cookies = list.map((c) => `${c.name}=${c.value}`).join('; ');
    } catch {
        cookies = captured['cookie'] || '';
    }

    // ✅ 11. Monta e cacheia a sessão
    const now = Date.now();
    const session: LatamSession = {
        cookies,
        searchToken: captured['x-latam-search-token'] || '',
        sessionId: captured['x-latam-app-session-id'] || crypto.randomUUID(),
        requestId: captured['x-latam-request-id'] || crypto.randomUUID(),
        trackId: captured['x-latam-track-id'] || crypto.randomUUID(),
        userAgent: captured['user-agent'] || '',
        capturedAt: now,
        expiresAt: now + SESSION_TTL_MS,
        offersJson,
        searchType,
        pageUrl,
    };

    console.log('x-latam-app-session-id', session.sessionId)
    console.log('x-latam-request-id', session.requestId)
    console.log('x-latam-search-token', session.searchToken)
    console.log('x-latam-track-id', session.trackId)

    sessionCache.set(cacheKey(searchType, pageUrl), session);

    console.log(`✅ Sessão cacheada (${searchType})`);
    return session;
}

// ============================================================
// Invalidação
// ============================================================
export function invalidateLatamSession(pageUrl?: string): void {
    if (pageUrl) {
        for (const key of sessionCache.keys()) {
            if (key.endsWith(`::${pageUrl}`)) sessionCache.delete(key);
        }
    } else {
        sessionCache.clear();
    }
    console.log('🗑️ Cache invalidado');
}

// ============================================================
// Cleanup (chamar no shutdown do app)
// ============================================================
export async function closeFarm(): Promise<void> {
    try { await sharedPage?.close(); } catch { /* ignore */ }
    try { await sharedBrowser?.close(); } catch { /* ignore */ }
    sharedPage = null;
    sharedContext = null;
    sharedBrowser = null;
}