import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  // ⚠️ ATENÇÃO: Isso só funciona em ambientes que permitem execução de comandos
  if (process.env.VERCEL) {
    return NextResponse.json({ 
      success: false, 
      error: 'Execução de comandos não permitida no Vercel' 
    });
  }

  try {
    const { searchParams } = await request.json();
    
    const curlCommand = `curl -s -X GET "https://www.latamairlines.com/br/pt/oferta-voos?${new URLSearchParams(searchParams)}" -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36" --compressed | grep -oP '"searchToken":"[^"]*"' | head -1`;
    
    console.log('🔧 Executando comando:', curlCommand);
    
    const { stdout, stderr } = await execAsync(curlCommand, { 
      timeout: 30000,
      maxBuffer: 1024 * 1024 // 1MB
    });

    if (stderr) {
      console.error('❌ Erro no comando:', stderr);
    }

    const tokenMatch = stdout.match(/"searchToken":"([^"]*)"/);
    if (tokenMatch) {
      return NextResponse.json({ 
        success: true, 
        token: tokenMatch[1].replace('"searchToken":"', '').replace('"', '')
      });
    }

    throw new Error('Token não encontrado na saída do comando');

  } catch (error) {
    console.error('❌ Erro na execução:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro na execução do comando' 
    });
  }
}