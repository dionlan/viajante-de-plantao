import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// 👇 força a rota a rodar em Node.js (não Edge Runtime)
export const runtime = "nodejs";

// Tempo máximo de execução (em milissegundos)
const DEFAULT_TIMEOUT = 45000; // 45 segundos

export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log("📨 [API SEARCH] Requisição recebida:", JSON.stringify(body, null, 2));

        const { url, method = "GET", headers = {}, body: reqBody, timeout = DEFAULT_TIMEOUT } = body;

        if (!url) {
            return Response.json({ success: false, error: "URL ausente no corpo da requisição" }, { status: 400 });
        }

        // Monta o comando curl com escape seguro
        const headerArgs = Object.entries(headers)
            .map(([k, v]) => `-H "${k}: ${v}"`)
            .join(" ");

        const dataArg = reqBody ? `--data-raw '${reqBody}'` : "";

        const curlCommand = `curl -s -X ${method} ${headerArgs} ${dataArg} --max-time ${timeout / 1000} "${url}"`;

        console.log("🚀 [API SEARCH] Executando comando:", curlCommand);

        const { stdout, stderr } = await execAsync(curlCommand, { maxBuffer: 1024 * 1024 * 10 }); // 10MB buffer

        if (stderr) {
            console.warn("⚠️ [API SEARCH] STDERR retornado:", stderr);
        }

        if (!stdout) {
            console.error("❌ [API SEARCH] Nenhum output retornado pelo curl");
            return Response.json({ success: false, error: "Nenhum output retornado pelo curl" }, { status: 500 });
        }

        // Tenta converter a saída em JSON (caso seja JSON válido)
        let jsonResponse: any;
        try {
            jsonResponse = JSON.parse(stdout);
            console.log("✅ [API SEARCH] JSON válido recebido");
        } catch {
            console.log("ℹ️ [API SEARCH] Resposta não é JSON — retornando texto puro");
        }

        return Response.json({
            success: true,
            data: jsonResponse || stdout,
        });
    } catch (error: any) {
        console.error("🔥 [API SEARCH] Erro geral:", error.message);
        return Response.json(
            {
                success: false,
                error: error.message,
            },
            { status: 500 }
        );
    }
}
