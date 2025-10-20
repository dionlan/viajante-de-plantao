// api/proxy.js

export default async function handler(req, res) {
  // ✅ Aceita apenas POST
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const { url, method, headers, body, timeout } = req.body;

    console.log("📡 Proxy Request:");
    console.log("➡️ URL:", url);
    console.log("➡️ Método:", method);
    console.log("➡️ Headers:", headers);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout || 30000);

    const response = await fetch(url, {
      method: method || "GET",
      headers,
      body,
      signal: controller.signal,
    });

    clearTimeout(timer);

    const text = await response.text();

    console.log("✅ Requisição concluída com status:", response.status);

    return res.status(200).json({
      success: true,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data: text,
    });
  } catch (error) {
    console.error("❌ Erro no proxy:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
