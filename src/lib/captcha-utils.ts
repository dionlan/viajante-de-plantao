// src/lib/captcha-utils.ts
import { chromium } from 'playwright';

export class CaptchaUtils {
    private static browser: any = null;
    private static context: any = null;

    static async getBrowser() {
        if (!this.browser) {
            this.browser = await chromium.launch({
                headless: true,
                args: [
                    '--disable-blink-features=AutomationControlled',
                    '--no-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-web-security',
                    '--disable-features=IsolateOrigins,site-per-process',
                ],
            });
        }
        return this.browser;
    }

    static async getCaptchaToken(url: string): Promise<string | null> {
        console.log('🔍 Obtendo CAPTCHA token via Playwright...');
        
        let page: any = null;
        try {
            const browser = await this.getBrowser();
            const context = await browser.newContext({
                viewport: { width: 1920, height: 1080 },
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
                locale: 'pt-BR',
            });
            
            page = await context.newPage();
            
            // Script anti-detecção
            await page.addInitScript(`
                Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
                Object.defineProperty(navigator, 'plugins', {get: () => [1, 2, 3, 4, 5]});
                window.chrome = {runtime: {}};
            `);
            
            // Intercepta requisições
            let captchaToken: string | null = null;
            
            page.on('request', (request: any) => {
                const headers = request.headers();
                if (headers['x-latam-captcha-token']) {
                    captchaToken = headers['x-latam-captcha-token'];
                    console.log('✅ CAPTCHA token capturado da requisição');
                }
            });
            
            // Navega para a URL
            console.log(`🌐 Navegando para: ${url}`);
            await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
            
            // Aguarda um pouco para carregar
            await page.waitForTimeout(3000);
            
            // Tenta clicar em aceitar cookies
            try {
                await page.click('button:has-text("Aceitar todos os cookies")', { timeout: 5000 });
            } catch (e) {
                // Ignora
            }
            
            // Aguarda mais um pouco
            await page.waitForTimeout(2000);
            
            // Tenta extrair via JavaScript
            const jsToken = await page.evaluate(() => {
                try {
                    // Procura nos scripts
                    const scripts = document.getElementsByTagName('script');
                    for (let script of scripts) {
                        const content = script.textContent || '';
                        const match = content.match(/x-latam-captcha-token["']?\s*[:=]\s*["']([^"']+)["']/i);
                        if (match && match[1] && match[1].length > 50) {
                            return match[1];
                        }
                    }
                    
                    // Procura no localStorage
                    try {
                        const token = localStorage.getItem('captchaToken');
                        if (token && token.length > 50) return token;
                    } catch(e) {}
                    
                    return null;
                } catch(e) {
                    return null;
                }
            });
            
            if (jsToken && jsToken.length > 50) {
                console.log('✅ CAPTCHA token obtido via JavaScript');
                return jsToken;
            }
            
            if (captchaToken) {
                return captchaToken;
            }
            
            console.warn('⚠️ CAPTCHA token não encontrado');
            return null;
            
        } catch (error) {
            console.error('❌ Erro ao obter CAPTCHA token:', error);
            return null;
        } finally {
            if (page) {
                await page.close();
            }
        }
    }
    
    static async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}