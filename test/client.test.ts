import { describe, expect, it, vi } from "vitest";
import {
  CentralMacatuba,
  CentralMacatubaError,
  CentralMacatubaSDK,
  PUBLIC_ENDPOINTS,
} from "../src/index.js";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

describe("CentralMacatuba", () => {
  it("exposes the gateway health check", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      json({ status: "ok", service: "Central Macatuba - API Pública", env: "test" }),
    );
    const api = new CentralMacatubaSDK({ fetch: fetcher });

    await expect(api.health.verificar()).resolves.toMatchObject({ status: "ok" });
    expect(fetcher.mock.calls[0][0]).toBe(
      "https://publica.api.centralmacatuba.qzz.io/",
    );
  });

  it("keeps the exported public endpoint allowlist immutable", () => {
    expect(Object.isFrozen(PUBLIC_ENDPOINTS)).toBe(true);
    expect(Reflect.set(PUBLIC_ENDPOINTS, "0", "/")).toBe(false);
    expect(PUBLIC_ENDPOINTS[0]).toBe("/");
  });

  it("uses the official public API origin by default", () => {
    const client = new CentralMacatuba({ fetch: vi.fn() });
    expect(client.baseUrl).toBe("https://publica.api.centralmacatuba.qzz.io");
  });

  it("serializes scalar, repeated, false and zero query values", async () => {
    const fetcher = vi.fn().mockResolvedValue(json({ total: 1 }));
    const client = new CentralMacatuba({ fetch: fetcher });

    await client.request("/api/tempo/verificar", {
      source: "estacao local",
      start: "2026-11-01 00:00:00",
      end: null,
      enabled: false,
      page: 0,
      tags: ["a", "b", null],
    } as never);

    const url = new URL(String(fetcher.mock.calls[0][0]));
    expect(url.searchParams.get("source")).toBe("estacao local");
    expect(url.searchParams.getAll("tags")).toEqual(["a", "b"]);
    expect(url.searchParams.get("enabled")).toBe("false");
    expect(url.searchParams.get("page")).toBe("0");
    expect(url.searchParams.has("end")).toBe(false);
  });

  it("rejects paths outside the public allowlist", async () => {
    const fetcher = vi.fn();
    const client = new CentralMacatuba({ fetch: fetcher });

    await expect(
      client.request("/api/admin/users" as never),
    ).rejects.toBeInstanceOf(CentralMacatubaError);
    await expect(
      client.request("/api/tempo/../admin" as never),
    ).rejects.toBeInstanceOf(CentralMacatubaError);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("returns binary responses as Blob", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(new Uint8Array([1, 2, 3]), {
        headers: { "content-type": "application/pdf" },
      }),
    );
    const client = new CentralMacatuba({ fetch: fetcher });
    const result = await client.request("/api/calendario/gerar", {
      formato: "pdf",
    });

    expect(result).toBeInstanceOf(Blob);
    expect((result as Blob).type).toBe("application/pdf");
  });

  it.each([204, 205])("returns undefined for an empty HTTP %i response", async (status) => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status }));
    const client = new CentralMacatuba({ fetch: fetcher });

    await expect(
      client.request("/api/avisos/verificar"),
    ).resolves.toBeUndefined();
  });

  it("preserves HTTP status and structured API error messages", async () => {
    const client = new CentralMacatuba({
      fetch: vi.fn().mockResolvedValue(
        json({ erro: { mensagem: "Indisponível" } }, 503),
      ),
    });

    await expect(client.request("/api/avisos/verificar")).rejects.toMatchObject({
      name: "CentralMacatubaError",
      message: "Indisponível",
      status: 503,
    });
  });

  it("reports malformed JSON with the response status", async () => {
    const client = new CentralMacatuba({
      fetch: vi.fn().mockResolvedValue(
        new Response("{invalid", {
          status: 502,
          headers: { "content-type": "application/json" },
        }),
      ),
    });

    await expect(client.request("/api/avisos/verificar")).rejects.toMatchObject({
      name: "CentralMacatubaError",
      status: 502,
      message: "A API retornou um JSON inválido.",
    });
  });

  it("merges default and per-request headers and uses configured credentials", async () => {
    const fetcher = vi.fn().mockResolvedValue(json({ success: true }));
    const client = new CentralMacatuba({
      fetch: fetcher,
      headers: { "X-Client": "sdk", "X-Shared": "default" },
      credentials: "include",
    });

    await client.request(
      "/api/avisos/verificar",
      undefined,
      {
        headers: { "X-Request": "one", "X-Shared": "override" },
      },
    );

    const init = fetcher.mock.calls[0][1] as RequestInit;
    const headers = new Headers(init.headers);
    expect(headers.get("x-client")).toBe("sdk");
    expect(headers.get("x-request")).toBe("one");
    expect(headers.get("x-shared")).toBe("override");
    expect(init.credentials).toBe("include");
  });

  it("allows credentials to be overridden for an individual request", async () => {
    const fetcher = vi.fn().mockResolvedValue(json({ success: true }));
    const client = new CentralMacatuba({ fetch: fetcher });

    await client.request("/api/sos/listar_alertas", undefined, {
      credentials: "include",
    });

    expect((fetcher.mock.calls[0][1] as RequestInit).credentials).toBe("include");
  });

  it("rejects invalid base URLs and timeout values", () => {
    expect(
      () => new CentralMacatuba({ baseUrl: "javascript:alert(1)", fetch: vi.fn() }),
    ).toThrow(CentralMacatubaError);
    expect(
      () => new CentralMacatuba({ baseUrl: "https://user:pass@example.com", fetch: vi.fn() }),
    ).toThrow(CentralMacatubaError);

    for (const timeoutMs of [-1, Number.NaN, Number.POSITIVE_INFINITY, 2_147_483_648]) {
      expect(
        () => new CentralMacatuba({ timeoutMs, fetch: vi.fn() }),
      ).toThrow(CentralMacatubaError);
    }

    expect(
      () => new CentralMacatuba({ timeoutMs: 2_147_483_647, fetch: vi.fn() }),
    ).not.toThrow();
  });

  it("rejects per-request timeouts above the setTimeout limit with URL context", async () => {
    const client = new CentralMacatuba({ fetch: vi.fn() });

    await expect(
      client.request("/api/avisos/verificar", undefined, { timeoutMs: 2_147_483_648 }),
    ).rejects.toMatchObject({
      name: "CentralMacatubaError",
      url: "https://publica.api.centralmacatuba.qzz.io/api/avisos/verificar",
    });
  });

  it("reports timeout separately from a regular network error", async () => {
    const fetcher = vi.fn((_input: RequestInfo | URL, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener(
          "abort",
          () => reject(new DOMException("Aborted", "AbortError")),
          { once: true },
        );
      }),
    );
    const client = new CentralMacatuba({ fetch: fetcher, timeoutMs: 5 });

    await expect(client.request("/api/avisos/verificar")).rejects.toMatchObject({
      name: "CentralMacatubaError",
      message: "A requisição excedeu 5 ms.",
    });
  });

  it("reports caller cancellation separately", async () => {
    const controller = new AbortController();
    controller.abort();
    const fetcher = vi.fn((_input: RequestInfo | URL, init?: RequestInit) =>
      init?.signal?.aborted
        ? Promise.reject(new DOMException("Aborted", "AbortError"))
        : Promise.resolve(json({ success: true })),
    );
    const client = new CentralMacatuba({ fetch: fetcher });

    await expect(
      client.request("/api/avisos/verificar", undefined, {
        signal: controller.signal,
      }),
    ).rejects.toMatchObject({
      name: "CentralMacatubaError",
      message: "A requisição foi cancelada.",
    });
  });
});
