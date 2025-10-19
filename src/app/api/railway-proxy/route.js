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

    console.log("📨 Enviando requisição para Railway...");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 segundos

    const response = await fetch(`${RAILWAY_URL}/api/complete-search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(railwayParams),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log("📊 Status do Railway:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erro do Railway:", response.status, errorText);
      throw new Error(`Railway retornou ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Resposta recebida com sucesso");

    return NextResponse.json(data);
  } catch (error) {
    console.error("💥 Erro no proxy:", error);

    if (error.name === "AbortError") {
      return NextResponse.json(
        {
          success: false,
          error: "Timeout na conexão com o Railway",
        },
        { status: 504 }
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
