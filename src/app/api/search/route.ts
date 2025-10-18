// app/api/search/route.ts - REQUISIÇÃO DIRETA PARA LATAM
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

interface SearchRequest {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  extractToken?: boolean;
}

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(2, 10);
  
  console.log(`🔍 [${requestId}] Iniciando requisição DIRETA para LATAM...`);

  try {
    const body: SearchRequest = await request.json();
    const { url, method = 'GET', headers = {}, extractToken = false } = body;

    // Validações
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ 
        success: false, 
        error: 'URL é obrigatória' 
      }, { status: 400 });
    }

    if (!url.includes('latamairlines.com')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Apenas URLs da LATAM são permitidas' 
      }, { status: 403 });
    }

    console.log(`🌐 [${requestId}] Fazendo requisição DIRETA para: ${url}`);

    // Headers otimizados para LATAM
    const latamHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'DNT': '1',
      'Upgrade-Insecure-Requests': '1',
      'sec-ch-ua': '"Google Chrome";v="120", "Chromium";v="120", "Not?A_Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      ...headers
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const startTime = Date.now();
      const response = await fetch(url, {
        method,
        headers: latamHeaders,
        signal: controller.signal,
      });

      const endTime = Date.now();
      clearTimeout(timeoutId);

      console.log(`📊 [${requestId}] Response em ${endTime - startTime}ms - Status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Cannot read error body');
        console.error(`❌ [${requestId}] HTTP Error ${response.status}:`, errorText.substring(0, 200));
        
        return NextResponse.json({
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status
        });
      }

      const responseText = await response.text();
      
      if (!responseText) {
        console.error(`❌ [${requestId}] Resposta vazia`);
        return NextResponse.json({
          success: false,
          error: 'Resposta vazia do servidor LATAM'
        });
      }

      console.log(`✅ [${requestId}] Resposta recebida: ${responseText.length} caracteres`);

      let finalData = responseText;

      // Extrair token se necessário
      if (extractToken) {
        const token = extractSearchToken(responseText);
        if (token) {
          console.log(`🔑 [${requestId}] Token extraído: ${token.substring(0, 50)}...`);
          finalData = token;
        } else {
          console.error(`❌ [${requestId}] Token não encontrado na resposta`);
          // Tentar padrões alternativos
          const alternativeToken = extractSearchTokenAlternative(responseText);
          if (alternativeToken) {
            console.log(`🔑 [${requestId}] Token encontrado com padrão alternativo`);
            finalData = alternativeToken;
          } else {
            throw new Error('Token não encontrado na resposta da LATAM');
          }
        }
      }

      return NextResponse.json({
        success: true,
        data: finalData,
        error: null,
        latency: endTime - startTime
      });

    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.error(`⏰ [${requestId}] Timeout após 15s`);
        return NextResponse.json({
          success: false,
          error: 'Timeout: A requisição para LATAM excedeu 15 segundos'
        });
      }
      
      console.error(`❌ [${requestId}] Erro de fetch:`, error.message);
      return NextResponse.json({
        success: false,
        error: `Erro de conexão com LATAM: ${error.message}`
      });
    }

  } catch (error: any) {
    console.error(`💥 [${requestId}] Erro na search API:`, error.message);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro interno do servidor',
      data: null
    }, { status: 500 });
  }
}

// Função principal de extração de token
function extractSearchToken(html: string): string | null {
  const patterns = [
    /"searchToken":"([^"]*)"/,
    /searchToken["']?\s*:\s*["']([^"']+)["']/,
    /window\.searchToken\s*=\s*["']([^"']+)["']/,
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

// Função alternativa de extração (mais agressiva)
function extractSearchTokenAlternative(html: string): string | null {
  // Procura por qualquer string que pareça um token (32+ caracteres alfanuméricos)
  const tokenPattern = /[A-Za-z0-9+/=]{32,}/g;
  const matches = html.match(tokenPattern);
  
  if (matches) {
    for (const match of matches) {
      // Filtra possíveis tokens baseados em características comuns
      if (match.length >= 32 && match.length <= 500) {
        // Verifica se está próximo de palavras-chave relacionadas a token
        const context = html.substring(
          Math.max(0, html.indexOf(match) - 50),
          Math.min(html.length, html.indexOf(match) + match.length + 50)
        );
        
        if (context.includes('searchToken') || context.includes('token') || context.includes('auth')) {
          return match;
        }
      }
    }
  }
  
  return null;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const test = url.searchParams.get('test');

  if (test === 'direct') {
    // Teste direto com a LATAM
    try {
      const testUrl = 'https://www.latamairlines.com/br/pt';
      const response = await fetch(testUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      return NextResponse.json({
        success: response.ok,
        message: `Teste direto LATAM - Status: ${response.status}`,
        environment: process.env.VERCEL ? 'vercel' : 'local',
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      return NextResponse.json({
        success: false,
        message: 'Teste direto LATAM falhou',
        error: error.message,
        environment: process.env.VERCEL ? 'vercel' : 'local',
        timestamp: new Date().toISOString()
      });
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Search API (Direct to LATAM) is running',
    environment: process.env.VERCEL ? 'vercel' : 'local',
    timestamp: new Date().toISOString()
  });
}