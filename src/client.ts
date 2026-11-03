import { CentralMacatubaError } from "./errors.js";
import type { CentralMacatubaOptions, QueryParams, RequestOptions } from "./types.js";

export const DEFAULT_BASE_URL = "https://publica.api.centralmacatuba.qzz.io";
export const PUBLIC_ENDPOINTS = [
  "/api/avisos/verificar","/api/calendario/verificar","/api/calendario/gerar","/api/dominios/verificar",
  "/api/informacoes/pesquisar","/api/informacoes/verificar","/api/jornal/pesquisar","/api/jornal/verificar",
  "/api/links/pesquisar","/api/links/verificar","/api/mapa/pesquisar","/api/mapa/verificar",
  "/api/novidades/pesquisar","/api/novidades/verificar","/api/paginas/pesquisar","/api/paginas/verificar",
  "/api/redicionador/verificar","/api/servicos/verificar","/api/servicos/cursos/pesquisar","/api/servicos/cursos/verificar",
  "/api/servicos/docs/pesquisar","/api/servicos/docs/verificar","/api/servicos/jogos/pesquisar","/api/servicos/jogos/verificar",
  "/api/servicos/streaming/pesquisar","/api/servicos/streaming/verificar","/api/servicos/streaming/live/verificar",
  "/api/sos/listar_alertas","/api/tempo/verificar",
] as const;
export type PublicEndpoint = (typeof PUBLIC_ENDPOINTS)[number];

function queryString(query?: QueryParams): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value == null) continue;
    for (const item of Array.isArray(value) ? value : [value]) if (item != null) params.append(key, String(item));
  }
  const result = params.toString(); return result ? `?${result}` : "";
}
async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) return undefined;
  const type = response.headers.get("content-type")?.toLowerCase() ?? "";
  if (type.includes("application/json") || type.includes("+json")) {
    const text = await response.text(); if (!text) return undefined;
    try { return JSON.parse(text) as unknown; }
    catch (cause) { throw new CentralMacatubaError("A API retornou um JSON inválido.", { status: response.status, url: response.url, headers: response.headers, response: text, cause }); }
  }
  return response.blob();
}

export class CentralMacatuba {
  readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly defaultHeaders: Headers;
  private readonly fetchImplementation: typeof fetch;
  constructor(options: CentralMacatubaOptions = {}) {
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.timeoutMs = options.timeoutMs ?? 20_000;
    this.defaultHeaders = new Headers(options.headers);
    this.fetchImplementation = options.fetch ?? globalThis.fetch;
    if (typeof this.fetchImplementation !== "function") throw new CentralMacatubaError("Este ambiente não disponibiliza Fetch API. Informe options.fetch.");
  }
  async request<T = unknown>(endpoint: PublicEndpoint | string, query?: QueryParams, options: RequestOptions = {}): Promise<T> {
    if (!endpoint.startsWith("/api/") || endpoint.includes("..") || !(PUBLIC_ENDPOINTS as readonly string[]).includes(endpoint)) {
      throw new CentralMacatubaError("Endpoint não permitido. Use somente rotas da allowlist pública.");
    }
    const url = `${this.baseUrl}${endpoint}${queryString(query)}`;
    const headers = new Headers(this.defaultHeaders);
    new Headers(options.headers).forEach((value, key) => headers.set(key, value));
    const controller = new AbortController(); let timedOut = false;
    const timeoutMs = options.timeoutMs ?? this.timeoutMs;
    const timer = timeoutMs > 0 ? setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs) : undefined;
    const abort = () => controller.abort(options.signal?.reason);
    if (options.signal?.aborted) abort(); else options.signal?.addEventListener("abort", abort, { once: true });
    try {
      const response = await this.fetchImplementation(url, { method: "GET", headers, signal: controller.signal });
      const body = await parseBody(response);
      if (!response.ok) {
        const message = body && typeof body === "object" && "erro" in body
          ? String((body as { erro?: { mensagem?: string } }).erro?.mensagem ?? response.statusText)
          : response.statusText;
        throw new CentralMacatubaError(message || `A API respondeu com HTTP ${response.status}.`, { status: response.status, statusText: response.statusText, url, response: body, headers: response.headers });
      }
      return body as T;
    } catch (error) {
      if (error instanceof CentralMacatubaError) throw error;
      if (timedOut) throw new CentralMacatubaError(`A requisição excedeu ${timeoutMs} ms.`, { url, cause: error });
      if (options.signal?.aborted) throw new CentralMacatubaError("A requisição foi cancelada.", { url, cause: error });
      throw new CentralMacatubaError("Não foi possível conectar à API pública da Central Macatuba.", { url, cause: error });
    } finally {
      if (timer !== undefined) clearTimeout(timer);
      options.signal?.removeEventListener("abort", abort);
    }
  }
}
