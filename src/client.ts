import { CentralMacatubaError } from "./errors.js";
import type {
  CentralMacatubaOptions,
  EndpointRequestArgs,
  EndpointResponse,
  QueryValue,
  RequestOptions,
} from "./types.js";
import type { paths } from "./generated/schema.js";

export const DEFAULT_BASE_URL = "https://publica.api.centralmacatuba.qzz.io";

export const PUBLIC_ENDPOINTS = [
  "/",
  "/api/avisos/verificar",
  "/api/calendario/verificar",
  "/api/calendario/gerar",
  "/api/dominios/verificar",
  "/api/informacoes/pesquisar",
  "/api/informacoes/verificar",
  "/api/jornal/pesquisar",
  "/api/jornal/verificar",
  "/api/links/pesquisar",
  "/api/links/verificar",
  "/api/mapa/pesquisar",
  "/api/mapa/verificar",
  "/api/novidades/pesquisar",
  "/api/novidades/verificar",
  "/api/paginas/pesquisar",
  "/api/paginas/verificar",
  "/api/redicionador/verificar",
  "/api/servicos/verificar",
  "/api/servicos/cursos/pesquisar",
  "/api/servicos/cursos/verificar",
  "/api/servicos/docs/pesquisar",
  "/api/servicos/docs/verificar",
  "/api/servicos/jogos/pesquisar",
  "/api/servicos/jogos/verificar",
  "/api/servicos/streaming/pesquisar",
  "/api/servicos/streaming/verificar",
  "/api/servicos/streaming/live/verificar",
  "/api/sos/listar_alertas",
  "/api/tempo/verificar",
] as const satisfies readonly (keyof paths)[];

export type PublicEndpoint = (typeof PUBLIC_ENDPOINTS)[number];

function queryString(query?: object): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value == null) continue;
    const values: QueryValue[] = Array.isArray(value) ? value : [value as QueryValue];
    for (const item of values) {
      if (item != null) params.append(key, String(item));
    }
  }
  const result = params.toString();
  return result ? `?${result}` : "";
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) return undefined;

  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  if (contentType.includes("application/json") || contentType.includes("+json")) {
    const text = await response.text();
    if (!text) return undefined;

    try {
      return JSON.parse(text) as unknown;
    } catch (cause) {
      throw new CentralMacatubaError("A API retornou um JSON inválido.", {
        status: response.status,
        url: response.url,
        headers: response.headers,
        response: text,
        cause,
      });
    }
  }

  return response.blob();
}

function normalizeBaseUrl(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch (cause) {
    throw new CentralMacatubaError("A URL base informada é inválida.", { cause });
  }

  if (
    (url.protocol !== "https:" && url.protocol !== "http:") ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new CentralMacatubaError(
      "A URL base deve usar HTTP(S) e não pode conter credenciais, query ou fragmento.",
    );
  }

  return url.toString().replace(/\/+$/, "");
}

export class CentralMacatuba {
  readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly defaultHeaders: Headers;
  private readonly fetchImplementation: typeof fetch;
  private readonly defaultCredentials: RequestCredentials;

  constructor(options: CentralMacatubaOptions = {}) {
    this.baseUrl = normalizeBaseUrl(options.baseUrl ?? DEFAULT_BASE_URL);
    this.timeoutMs = options.timeoutMs ?? 20_000;
    if (!Number.isFinite(this.timeoutMs) || this.timeoutMs < 0) {
      throw new CentralMacatubaError("timeoutMs deve ser um número finito maior ou igual a zero.");
    }

    this.defaultHeaders = new Headers(options.headers);
    this.fetchImplementation = options.fetch ?? globalThis.fetch;
    this.defaultCredentials = options.credentials ?? "same-origin";

    if (typeof this.fetchImplementation !== "function") {
      throw new CentralMacatubaError("Este ambiente não disponibiliza Fetch API. Informe options.fetch.");
    }
  }

  async request<P extends PublicEndpoint>(
    endpoint: P,
    ...args: EndpointRequestArgs<P>
  ): Promise<EndpointResponse<P>> {
    if (!(PUBLIC_ENDPOINTS as readonly string[]).includes(endpoint)) {
      throw new CentralMacatubaError("Endpoint não permitido. Use somente rotas da allowlist pública.");
    }

    const [query, requestOptions] = args as [
      object | undefined,
      RequestOptions | undefined,
    ];
    const options = requestOptions ?? {};
    const url = `${this.baseUrl}${endpoint}${queryString(query)}`;
    const headers = new Headers(this.defaultHeaders);
    new Headers(options.headers).forEach((value, key) => headers.set(key, value));

    const timeoutMs = options.timeoutMs ?? this.timeoutMs;
    if (!Number.isFinite(timeoutMs) || timeoutMs < 0) {
      throw new CentralMacatubaError("timeoutMs deve ser um número finito maior ou igual a zero.", { url });
    }

    const controller = new AbortController();
    let timedOut = false;
    const timer =
      timeoutMs > 0
        ? setTimeout(() => {
            timedOut = true;
            controller.abort();
          }, timeoutMs)
        : undefined;

    const abort = () => controller.abort(options.signal?.reason);
    if (options.signal?.aborted) {
      abort();
    } else {
      options.signal?.addEventListener("abort", abort, { once: true });
    }

    try {
      const response = await this.fetchImplementation(url, {
        method: "GET",
        headers,
        signal: controller.signal,
        credentials: options.credentials ?? this.defaultCredentials,
      });

      const body = await parseBody(response);
      if (!response.ok) {
        const apiMessage =
          body && typeof body === "object" && "erro" in body
            ? (body as { erro?: { mensagem?: string } | string }).erro
            : undefined;
        const message =
          typeof apiMessage === "string"
            ? apiMessage
            : apiMessage?.mensagem ?? response.statusText;

        throw new CentralMacatubaError(
          message || `A API respondeu com HTTP ${response.status}.`,
          {
            status: response.status,
            statusText: response.statusText,
            url,
            response: body,
            headers: response.headers,
          },
        );
      }

      return body as EndpointResponse<P>;
    } catch (error) {
      if (error instanceof CentralMacatubaError) throw error;
      if (timedOut) {
        throw new CentralMacatubaError(`A requisição excedeu ${timeoutMs} ms.`, { url, cause: error });
      }
      if (options.signal?.aborted) {
        throw new CentralMacatubaError("A requisição foi cancelada.", { url, cause: error });
      }
      throw new CentralMacatubaError(
        "Não foi possível conectar à API pública da Central Macatuba.",
        { url, cause: error },
      );
    } finally {
      if (timer !== undefined) clearTimeout(timer);
      options.signal?.removeEventListener("abort", abort);
    }
  }
}
