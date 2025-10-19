import { NextRequest, NextResponse } from "next/server";

const RAILWAY_URL = process.env.RAILWAY_PROXY_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action = "complete-search", ...searchParams } = body;

    console.log("🔗 Encaminhando para Railway...", { action });

    if (!RAILWAY_URL) {
      throw new Error("RAILWAY_PROXY_URL não configurada");
    }

    let endpoint = "/api/complete-search";

    if (action === "get-token") {
      endpoint = "/api/get-token";
    } else if (action === "search-flights") {
      endpoint = "/api/search-flights";
    }

    const response = await fetch(`${RAILWAY_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchParams),
    });

    const data = await response.json();

    console.log("✅ Resposta do Railway recebida");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Erro no proxy Railway:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        data: null,
      },
      { status: 500 }
    );
  }
}
