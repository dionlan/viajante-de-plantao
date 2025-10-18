import { NextRequest, NextResponse } from 'next/server';

// Para usar Puppeteer no Vercel, precisamos de uma solução serverless
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = await request.json();
    
    // Em produção, use um serviço externo de Puppeteer
    const puppeteerServiceUrl = process.env.PUPPETEER_SERVICE_URL;
    
    if (puppeteerServiceUrl) {
      const response = await fetch(puppeteerServiceUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchParams })
      });
      
      return NextResponse.json(await response.json());
    }

    // Fallback: tentar com fetch normal
    const fallbackResponse = await fetch('/api/scraper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ searchParams })
    });

    return NextResponse.json(await fallbackResponse.json());

  } catch (error) {
    console.error('❌ Erro no Puppeteer:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Serviço de scraping indisponível' 
    });
  }
}