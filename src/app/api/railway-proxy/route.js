import { NextResponse } from "next/server";

const RAILWAY_URL = process.env.RAILWAY_PROXY_URL;

export async function POST(request) {
  console.log("🔗 Iniciando proxy para Railway...");

  try {
    const body = await request.json();
    const {
      origin,
      destination,
      outbound,
      inbound,
      adults = 1,
      children = 0,
      babies = 0,
    } = body;

    console.log("📋 Parâmetros recebidos:", {
      origin,
      destination,
      outbound,
      inbound,
      adults,
      children,
      babies,
    });

    // Verificar se a URL do Railway está configurada
    if (!RAILWAY_URL) {
      console.error("❌ RAILWAY_PROXY_URL não configurada");
      return NextResponse.json(
        {
          success: false,
          error: "RAILWAY_PROXY_URL não configurada no ambiente",
        },
        { status: 500 }
      );
    }

    console.log("🌐 Railway URL:", RAILWAY_URL);

    const railwayParams = {
      origin,
      destination,
      outbound,
      inbound: inbound || outbound,
      adults,
      children,
      babies,
    };

    // Primeiro, testar a conexão com o endpoint de health
    try {
      console.log("🩺 Testando conexão com Railway...");
      const healthResponse = await fetch(`${RAILWAY_URL}/api/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log("✅ Conexão com Railway OK:", healthData);
      } else {
        console.warn("⚠️ Health check falhou:", healthResponse.status);
      }
    } catch (healthError) {
      console.error("❌ Erro no health check:", healthError);
    }

    console.log("📨 Enviando requisição para Railway...", railwayParams);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos timeout

    const response = await fetch(`${RAILWAY_URL}/api/complete-search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "ViajanteDePlantao/1.0",
      },
      body: JSON.stringify(railwayParams),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log("📊 Status da resposta do Railway:", response.status);
    console.log(
      "📋 Headers da resposta:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      let errorText = "Erro sem corpo de resposta";
      try {
        errorText = await response.text();
        console.error("❌ Corpo do erro do Railway:", errorText);
      } catch (e) {
        console.error("❌ Não foi possível ler o corpo do erro");
      }

      throw new Error(`Railway retornou ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Resposta do Railway recebida com sucesso");
    console.log("📦 Estrutura da resposta:", {
      success: data.success,
      hasData: !!data.data,
      dataKeys: data.data ? Object.keys(data.data) : [],
      contentLength: data.data?.content?.length || 0,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("💥 Erro detalhado no proxy:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    // Verificar se é erro de timeout
    if (error.name === "AbortError") {
      return NextResponse.json(
        {
          success: false,
          error: "Timeout na conexão com o Railway (30s)",
        },
        { status: 504 }
      );
    }

    // Verificar se é erro de conexão
    if (
      error.message?.includes("fetch failed") ||
      error.message?.includes("ENOTFOUND")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Não foi possível conectar com o Railway: ${error.message}`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Erro interno no proxy",
      },
      { status: 500 }
    );
  }
}

// Adicionar OPTIONS para CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
