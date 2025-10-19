// pages/api/flights/search.js
const RAILWAY_PROXY_URL = process.env.RAILWAY_PROXY_URL;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    console.log("📨 Recebendo requisição no Vercel...");

    // Encaminhar para Railway Proxy
    const proxyResponse = await fetch(`${RAILWAY_PROXY_URL}/api/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
      timeout: 35000,
    });

    const data = await proxyResponse.json();

    console.log("✅ Resposta recebida do Railway");

    // Repassar status code e resposta
    res.status(proxyResponse.status).json(data);
  } catch (error) {
    console.error("❌ Erro no Vercel:", error);

    res.status(500).json({
      success: false,
      error: "Falha na comunicação com o serviço de busca",
      details: error.message,
    });
  }
}
