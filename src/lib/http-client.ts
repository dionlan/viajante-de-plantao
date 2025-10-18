// lib/http-client.ts
export class HttpClient {
    private static readonly DEFAULT_TIMEOUT = 10000;
    private static readonly MAX_RETRIES = 2;
    private static readonly RETRY_DELAY = 1000;

    static async request<T = unknown>(
        url: string,
        options: {
            method?: string;
            headers?: Record<string, string>;
            body?: unknown;
            timeout?: number;
            retries?: number;
        } = {}
    ): Promise<T> {
        const {
            method = 'GET',
            headers = {},
            body,
            timeout = this.DEFAULT_TIMEOUT,
            retries = this.MAX_RETRIES
        } = options;

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const result = await this.makeRequest<T>(url, { method, headers, body, timeout });

                if (attempt > 0) {
                    console.log(`✅ Tentativa ${attempt + 1} bem-sucedida após ${attempt} retries`);
                }

                return result;
            } catch (error) {
                console.log(`❌ Tentativa ${attempt + 1} falhou:`, error instanceof Error ? error.message : String(error));

                if (attempt === retries) {
                    throw error;
                }

                // Aguarda antes da próxima tentativa
                await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * (attempt + 1)));
            }
        }

        throw new Error('Todas as tentativas falharam');
    }

    private static async makeRequest<T>(
        url: string,
        options: { method?: string; headers?: Record<string, string>; body?: unknown; timeout?: number }
    ): Promise<T> {
        // Sempre usa proxy no servidor para consistência
        const proxyUrl = this.getProxyUrl();

        const payload = {
            url,
            method: options.method,
            headers: options.headers,
            body: options.body,
            timeout: options.timeout
        };

        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Proxy error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Request failed');
        }

        return result.data;
    }

    private static getProxyUrl(): string {
        if (typeof window !== 'undefined') {
            return '/api/proxy';
        } else {
            const baseUrl = process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
            return `${baseUrl}/api/proxy`;
        }
    }

    static async latamRequest(
        url: string,
        options: {
            extractToken?: boolean;
            headers?: Record<string, string>;
            timeout?: number;
        } = {}
    ): Promise<string> {
        const defaultHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cache-Control': 'no-cache',
        };

        const result = await this.request<string>(url, {
            method: 'GET',
            headers: { ...defaultHeaders, ...options.headers },
            timeout: options.timeout,
        });

        if (options.extractToken) {
            const token = this.extractSearchToken(result);
            if (!token) {
                throw new Error('Token não encontrado na resposta');
            }
            return token;
        }

        return result;
    }

    private static extractSearchToken(html: string): string | null {
        const patterns = [
            /"searchToken":"([^"]*)"/,
            /searchToken["']?\s*:\s*["']([^"']+)["']/,
            /window\.searchToken\s*=\s*["']([^"']+)["']/,
            /data-search-token=["']([^"']+)["']/,
            /name="searchToken"\s+value="([^"]*)"/,
        ];

        for (const pattern of patterns) {
            const match = html.match(pattern);
            if (match && match[1] && match[1].length > 10) {
                return match[1];
            }
        }

        return null;
    }

    static async healthCheck(): Promise<{ success: boolean; message: string; environment: string }> {
        try {
            const proxyUrl = this.getProxyUrl();
            const response = await fetch(proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: 'https://httpbin.org/json',
                    timeout: 5000
                }),
            });

            const result = await response.json();
            return {
                success: result.success || false,
                message: result.success ? 'API está funcionando' : 'API com problemas',
                environment: process.env.VERCEL ? 'vercel' : 'local'
            };
        } catch (error) {
            return {
                success: false,
                message: `Erro na health check: ${error instanceof Error ? error.message : 'Unknown error'}`,
                environment: process.env.VERCEL ? 'vercel' : 'local'
            };
        }
    }
}