import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const playwrightModule = process.env.PLAYWRIGHT_MODULE;
if (!playwrightModule) {
  throw new Error(
    "Defina PLAYWRIGHT_MODULE com o caminho absoluto para playwright/index.mjs.",
  );
}

const { chromium } = await import(pathToFileURL(resolve(playwrightModule)).href);
const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const bundlePath = join(root, "dist", "index.js");
const exposedHeaders = [
  "X-Page",
  "X-Per-Page",
  "X-Total-Count",
  "X-Total-Pages",
  "X-Has-Next-Page",
  "X-Has-Previous-Page",
];

const seen = {
  preflight: 0,
  preflightHeaders: null,
  sosHeader: null,
  searchQuery: null,
  calendarFormats: [],
  requests: [],
};

let browser;
let apiServer;
let webServer;

async function listen(server) {
  await new Promise((resolveListen, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolveListen);
  });
  return `http://127.0.0.1:${server.address().port}`;
}

async function close(server) {
  if (!server?.listening) return;
  await new Promise((resolveClose, reject) =>
    server.close((error) => (error ? reject(error) : resolveClose())),
  );
}

try {
  await readFile(bundlePath);

  apiServer = createServer((request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const origin = request.headers.origin ?? "*";
    const corsHeaders = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers":
        request.headers["access-control-request-headers"] ?? "X-CM-SOS-PERMISSION",
      "Access-Control-Expose-Headers": exposedHeaders.join(", "),
      "Access-Control-Max-Age": "600",
      Vary: "Origin",
    };

    seen.requests.push({ method: request.method, path: url.pathname });

    if (request.method === "OPTIONS") {
      seen.preflight += 1;
      seen.preflightHeaders =
        request.headers["access-control-request-headers"] ?? "";
      response.writeHead(204, corsHeaders);
      response.end();
      return;
    }

    const jsonHeaders = {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    };

    if (request.method !== "GET") {
      response.writeHead(405, corsHeaders);
      response.end("Method not allowed");
      return;
    }

    if (url.pathname === "/") {
      response.writeHead(200, jsonHeaders);
      response.end(
        JSON.stringify({
          status: "ok",
          service: "Central Macatuba - API Pública",
          env: "browser-test",
        }),
      );
      return;
    }

    if (url.pathname === "/api/servicos/pesquisar") {
      seen.searchQuery = Object.fromEntries(url.searchParams.entries());
      response.writeHead(200, {
        ...jsonHeaders,
        "X-Page": "1",
        "X-Per-Page": "2",
        "X-Total-Count": "7",
        "X-Total-Pages": "4",
        "X-Has-Next-Page": "true",
        "X-Has-Previous-Page": "false",
      });
      response.end(
        JSON.stringify({
          status: "sucesso",
          data: [{ id: "servico-teste" }],
          paginacao: { pagina: 1, limite: 2 },
        }),
      );
      return;
    }

    if (url.pathname === "/api/sos/listar_alertas") {
      seen.sosHeader = request.headers["x-cm-sos-permission"] ?? null;
      response.writeHead(200, jsonHeaders);
      response.end(
        JSON.stringify({
          success: true,
          alertas: [],
          notificacaoAceita: true,
        }),
      );
      return;
    }

    if (url.pathname === "/api/calendario/gerar") {
      const formato = url.searchParams.get("formato");
      seen.calendarFormats.push(formato);

      if (formato === "pdf") {
        response.writeHead(200, {
          ...corsHeaders,
          "Content-Type": "application/pdf",
        });
        response.end("%PDF-1.4\\nCentral Macatuba browser test\\n%%EOF");
        return;
      }

      if (formato === "png") {
        response.writeHead(200, {
          ...corsHeaders,
          "Content-Type": "image/png",
        });
        response.end(
          Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        );
        return;
      }
    }

    response.writeHead(404, {
      ...corsHeaders,
      "Content-Type": "text/plain; charset=utf-8",
    });
    response.end("Not found");
  });

  const apiOrigin = await listen(apiServer);
  const html = `<!doctype html>
<html lang="pt-BR">
  <head><meta charset="utf-8"><title>SDK browser integration</title></head>
  <body>
    <script type="module">
      import { CentralMacatubaSDK } from "/bundle.js";

      window.browserTest = (async () => {
        const api = new CentralMacatubaSDK({
          baseUrl: "${apiOrigin}",
          timeoutMs: 5000,
        });

        const health = await api.health.verificar();
        const paginated = await api.requestWithMetadata(
          "/api/servicos/pesquisar",
          { page: 1, limit: 2 },
        );
        const sos = await api.requestWithMetadata(
          "/api/sos/listar_alertas",
          undefined,
          { headers: { "X-CM-SOS-PERMISSION": "granted" } },
        );
        const calendar = await api.calendario.gerar({
          ano: 2026,
          formato: "pdf",
        });
        const calendarPng = await api.calendario.gerar({
          ano: 2026,
          formato: "png",
        });

        return {
          health,
          pagination: {
            status: paginated.status,
            page: paginated.headers.get("X-Page"),
            perPage: paginated.headers.get("X-Per-Page"),
            totalCount: paginated.headers.get("X-Total-Count"),
            totalPages: paginated.headers.get("X-Total-Pages"),
            hasNextPage: paginated.headers.get("X-Has-Next-Page"),
            hasPreviousPage: paginated.headers.get("X-Has-Previous-Page"),
          },
          sos,
          calendar: {
            isBlob: calendar instanceof Blob,
            type: calendar.type,
            size: calendar.size,
          },
          calendarPng: {
            isBlob: calendarPng instanceof Blob,
            type: calendarPng.type,
            size: calendarPng.size,
          },
        };
      })();
    </script>
  </body>
</html>`;

  webServer = createServer(async (request, response) => {
    if (request.url === "/") {
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(html);
      return;
    }

    if (request.url === "/bundle.js") {
      response.writeHead(200, {
        "Content-Type": "text/javascript; charset=utf-8",
        "Cache-Control": "no-store",
      });
      response.end(await readFile(bundlePath));
      return;
    }

    response.writeHead(404);
    response.end("Not found");
  });

  const webOrigin = await listen(webServer);
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(webOrigin, { waitUntil: "load" });
  const result = await page.evaluate(() => window.browserTest);

  assert.equal(result.health.status, "ok");
  assert.equal(result.health.env, "browser-test");
  assert.equal(result.pagination.status, 200);
  assert.deepEqual(result.pagination, {
    status: 200,
    page: "1",
    perPage: "2",
    totalCount: "7",
    totalPages: "4",
    hasNextPage: "true",
    hasPreviousPage: "false",
  });
  assert.equal(result.sos.data.success, true);
  assert.equal(seen.sosHeader, "granted");
  assert.ok(
    seen.preflight >= 1,
    "o navegador deveria executar CORS preflight para o header SOS",
  );
  assert.match(seen.preflightHeaders, /x-cm-sos-permission/i);
  assert.deepEqual(seen.searchQuery, { page: "1", limit: "2" });
  assert.deepEqual(seen.calendarFormats, ["pdf", "png"]);
  assert.deepEqual(result.calendar, {
    isBlob: true,
    type: "application/pdf",
    size: Buffer.byteLength("%PDF-1.4\\nCentral Macatuba browser test\\n%%EOF"),
  });
  assert.deepEqual(result.calendarPng, {
    isBlob: true,
    type: "image/png",
    size: 8,
  });
  assert.deepEqual(pageErrors, []);
  assert.ok(seen.requests.some(({ path }) => path === "/api/servicos/pesquisar"));
  assert.ok(seen.requests.some(({ path }) => path === "/api/calendario/gerar"));

  console.log(
    "Teste real em Chromium aprovado: ESM, Fetch, CORS preflight, paginação, header SOS e Blobs PDF/PNG.",
  );
} finally {
  await browser?.close();
  await Promise.all([close(webServer), close(apiServer)]);
}
