import { NextResponse } from "next/server";

const RAILWAY_URL = process.env.RAILWAY_PROXY_URL;

export async function POST(request) {
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

    console.log("🔗 Recebida requisição no App Router:", {
      origin,
      destination,
      outbound,
      inbound,
    });

    if (!RAILWAY_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "RAILWAY_PROXY_URL não configurada",
        },
        { status: 500 }
      );
    }

    const railwayParams = {
      origin,
      destination,
      outbound,
      inbound: inbound || outbound,
      adults,
      children,
      babies,
    };

    console.log("📨 Encaminhando para Railway...");

    const response = await fetch(`${RAILWAY_URL}/api/complete-search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(railwayParams),
    });

    console.log("📊 Status do Railway:", response.status);

    if (!response.ok) {
      throw new Error(`Railway retornou ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Resposta do Railway recebida");

    return NextResponse.json(data);
  } catch (error) {
    console.error("💥 Erro no proxy:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
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
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
