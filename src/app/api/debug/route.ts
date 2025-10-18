import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const testUrl = 'https://www.latamairlines.com/br/pt/oferta-voos?origin=BSB&destination=GRU&adt=1';

  try {
    const response = await fetch(testUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const html = await response.text();
    console.log('resposta HTML', html)

    const token = html.match(/"searchToken":"([^"]*)"/);
    console.log('resposta TOKEN', token)

    return NextResponse.json({
      success: true,
      status: response.status,
      hasToken: !!token,
      token: token ? token[1] : null,
      htmlLength: html.length,
      first500Chars: html.substring(0, 500)
    });

  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      message: 'Teste direto LATAM falhou',
      error: error,
      environment: process.env.VERCEL ? 'vercel' : 'local',
      timestamp: new Date().toISOString()
    });
  }
}