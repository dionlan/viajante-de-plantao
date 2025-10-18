// lib/http-client.ts - CLIENTE UNIVERSAL
export class HttpClient {
    private static readonly PROXY_URL = '/api/proxy';
    private static readonly FALLBACK_STRATEGIES = ['proxy', 'direct'] as const;

    static async request<T = unknown>(
        url: string,
        options: {
            method?: string;
            headers?: Record<string, string>;
            body?: unknown;
            timeout?: number;
            strategy?: 'auto' | 'proxy' | 'direct';
        } = {}
    ): Promise<T> {
        const {
            method = 'GET',
            headers = {},
            body,
            timeout = 10000,
            strategy = 'auto'
        } = options;

        // Estratégia automática: usa proxy no Vercel, direto localmente
        const effectiveStrategy = strategy === 'auto'
            ? (typeof window !== 'undefined' ? 'direct' : 'proxy')
            : strategy;

        console.log(`🌐 Usando estratégia: ${effectiveStrategy} para ${url}`);

        if (effectiveStrategy === 'direct' && typeof window !== 'undefined') {
            // Requisição direta no cliente
            return this.directRequest(url, { method, headers, body, timeout });
        } else {
            // Requisição via proxy (funciona tanto no servidor quanto no cliente)
            return this.proxyRequest(url, { method, headers, body, timeout });
        }
    }

    private static async directRequest<T>(
        url: string,
        options: { method?: string; headers?: Record<string, string>; body?: unknown; timeout?: number }
    ): Promise<T> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), options.timeout);

        try {
            const bodyInit = options.body as BodyInit | null;
            const response = await fetch(url, {
                method: options.method,
                headers: options.headers,
                body: bodyInit,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);

            // Fallback para proxy se direto falhar
            if (error instanceof Error && error.name !== 'AbortError') {
                console.log('🔄 Fallback para proxy após falha direta');
                return this.proxyRequest(url, options);
            }

            throw error;
        }
    }

    private static async proxyRequest<T>(
        url: string,
        options: { method?: string; headers?: Record<string, string>; body?: unknown; timeout?: number }
    ): Promise<T> {
        const proxyUrl = this.getProxyUrl();

        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url,
                method: options.method,
                headers: options.headers,
                body: options.body,
                timeout: options.timeout,
            }),
        });

        if (!response.ok) {
            throw new Error(`Proxy error: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Proxy request failed');
        }

        // Tenta parsear como JSON, senão retorna texto
        try {
            return typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
        } catch {
            return result.data;
        }
    }

    private static getProxyUrl(): string {
        // Detecta automaticamente a URL do proxy
        if (typeof window !== 'undefined') {
            // No cliente: usa URL relativa
            return '/api/proxy';
        } else {
            // No servidor: constrói URL absoluta para Vercel
            const baseUrl = process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : 'http://localhost:3000';
            return `${baseUrl}/api/proxy`;
        }
    }

    // Método especializado para LATAM
    static async latamRequest(
        url: string,
        options: {
            extractToken?: boolean;
            headers?: Record<string, string>;
        } = {}
    ) {
        const result = await this.request<string>(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                ...options.headers,
            },
            ...options,
        });

        if (options.extractToken) {
            const token = this.extractSearchToken(result);
            if (!token) {
                throw new Error('Token não encontrado');
            }
            return token;
        }

        return result;
    }

    private static extractSearchToken(html: string): string | null {
        const patterns = [
            /"searchToken":"([^"]*)"/,
            /searchToken["']?\s*:\s*["']([^"']+)["']/,
        ];

        for (const pattern of patterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        return null;
    }
}