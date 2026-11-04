import { describe, expect, it, vi } from "vitest";
import { CentralMacatuba, CentralMacatubaError, PUBLIC_ENDPOINTS } from "../src/index.js";

const origin = "https://example.test";
const path = "/api/avisos/verificar";

describe("client boundaries", () => {
  it("normalizes a base URL with a path and serializes reserved query characters", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response('{"ok":true}', { headers: { "content-type": "application/json" } }),
    );
    const client = new CentralMacatuba({ baseUrl: `${origin}/gateway///`, fetch: fetcher });
    await client.request("/api/jornal/pesquisar", { q: "a & b/+á", filtro: "titulo" });

    const url = new URL(String(fetcher.mock.calls[0][0]));
    expect(client.baseUrl).toBe(`${origin}/gateway`);
    expect(url.pathname).toBe(`/gateway/api/jornal/pesquisar`);
    expect(url.searchParams.get("q")).toBe("a & b/+á");
    expect(url.searchParams.get("filtro")).toBe("titulo");
  });

  it.each(["not a URL", "https://example.test/?key=value", "https://example.test/#fragment"])(
    "rejects invalid base URL %s", (baseUrl) => {
      expect(() => new CentralMacatuba({ baseUrl, fetch: vi.fn() })).toThrow(CentralMacatubaError);
    },
  );

  it("does not allow adding a route to the frozen allowlist", async () => {
    const fetcher = vi.fn();
    const client = new CentralMacatuba({ fetch: fetcher });
    expect(Reflect.set(PUBLIC_ENDPOINTS, String(PUBLIC_ENDPOINTS.length), "/api/admin")).toBe(false);
    await expect(client.request("/api/admin" as never)).rejects.toBeInstanceOf(CentralMacatubaError);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("parses vendor JSON media types, including case and parameters", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('{"ok":true}', {
      headers: { "content-type": "Application/Problem+JSON; charset=utf-8" },
    }));
    await expect(new CentralMacatuba({ fetch: fetcher }).request(path)).resolves.toEqual({ ok: true });
  });

  it.each(["application/pdf; charset=binary", "image/png"])(
    "returns calendar %s content and bytes", async (contentType) => {
      const bytes = new Uint8Array([0, 127, 255]);
      const fetcher = vi.fn().mockResolvedValue(new Response(bytes, {
        headers: { "content-type": contentType },
      }));
      const result = await new CentralMacatuba({ fetch: fetcher }).request("/api/calendario/gerar");
      expect(result).toBeInstanceOf(Blob);
      expect(Array.from(new Uint8Array(await (result as Blob).arrayBuffer()))).toEqual(Array.from(bytes));
    },
  );

  it("rejects an empty 200 JSON response with request context", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response("", {
      headers: { "content-type": "application/json", "x-request-id": "abc" },
    }));
    await expect(new CentralMacatuba({ baseUrl: origin, fetch: fetcher }).request(path)).rejects.toMatchObject({
      message: "A API retornou uma resposta vazia incompatível com o contrato do endpoint.",
      status: 200,
      url: `${origin}${path}`,
      headers: expect.any(Headers),
    });
  });

  it.each([
    [{ erro: "Falhou" }, "Falhou"],
    [{ erro: {} }, "Unavailable"],
    [{ other: "detail" }, "Unavailable"],
  ])("preserves HTTP error context for %j", async (body, message) => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify(body), {
      status: 503,
      statusText: "Unavailable",
      headers: { "content-type": "application/json", "x-request-id": "abc" },
    }));
    try {
      await new CentralMacatuba({ baseUrl: origin, fetch: fetcher }).request(path);
      expect.fail("Expected HTTP error");
    } catch (error) {
      expect(error).toBeInstanceOf(CentralMacatubaError);
      expect(error).toMatchObject({ message, status: 503, statusText: "Unavailable", url: `${origin}${path}`, response: body });
      expect((error as CentralMacatubaError).headers?.get("x-request-id")).toBe("abc");
    }
  });

  it("uses the HTTP status when an error has no message or status text", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 500, statusText: "" }));
    await expect(new CentralMacatuba({ fetch: fetcher }).request(path)).rejects.toMatchObject({
      message: "A API respondeu com HTTP 500.", status: 500,
    });
  });

  it("preserves the original cause and response text for malformed JSON", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response("{broken", {
      status: 200, headers: { "content-type": "application/json" },
    }));
    await expect(new CentralMacatuba({ fetch: fetcher }).request(path)).rejects.toMatchObject({
      message: "A API retornou um JSON inválido.", response: "{broken", cause: expect.any(SyntaxError),
    });
  });

  it("wraps a network failure with its cause and request URL", async () => {
    const cause = new TypeError("offline");
    const fetcher = vi.fn().mockRejectedValue(cause);
    await expect(new CentralMacatuba({ baseUrl: origin, fetch: fetcher }).request(path)).rejects.toMatchObject({
      message: "Não foi possível conectar à API pública da Central Macatuba.",
      url: `${origin}${path}`, cause,
    });
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY, 2_147_483_648])(
    "rejects invalid per-request timeout %s before fetching", async (timeoutMs) => {
      const fetcher = vi.fn();
      const client = new CentralMacatuba({ baseUrl: origin, fetch: fetcher });
      await expect(client.request(path, undefined, { timeoutMs })).rejects.toMatchObject({ url: `${origin}${path}` });
      expect(fetcher).not.toHaveBeenCalled();
    },
  );

  it("disables the default timeout when the request timeout is zero", async () => {
    vi.useFakeTimers();
    try {
      let finish!: (response: Response) => void;
      const fetcher = vi.fn((_input: RequestInfo | URL, _init?: RequestInit) =>
        new Promise<Response>((resolve) => { finish = resolve; }),
      );
      const client = new CentralMacatuba({ fetch: fetcher, timeoutMs: 10 });
      const pending = client.request(path, undefined, { timeoutMs: 0 });
      await vi.advanceTimersByTimeAsync(100);
      expect((fetcher.mock.calls[0][1] as RequestInit).signal?.aborted).toBe(false);
      finish(new Response('{"ok":true}', { headers: { "content-type": "application/json" } }));
      await expect(pending).resolves.toEqual({ ok: true });
    } finally {
      vi.useRealTimers();
    }
  });

  it("forwards a later caller cancellation and its reason", async () => {
    const controller = new AbortController();
    const reason = new Error("caller stopped");
    let forwardedSignal: AbortSignal | undefined;
    const fetcher = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
      forwardedSignal = init?.signal ?? undefined;
      return new Promise<Response>((_resolve, reject) => {
        forwardedSignal?.addEventListener("abort", () => reject(forwardedSignal?.reason), { once: true });
      });
    });
    const pending = new CentralMacatuba({ baseUrl: origin, fetch: fetcher }).request(path, undefined, { signal: controller.signal });
    controller.abort(reason);
    await expect(pending).rejects.toMatchObject({ message: "A requisição foi cancelada.", url: `${origin}${path}`, cause: reason });
    expect(forwardedSignal?.reason).toBe(reason);
  });

  it("detaches a caller signal once the request has completed", async () => {
    const controller = new AbortController();
    const fetcher = vi.fn().mockResolvedValue(new Response("{}", { headers: { "content-type": "application/json" } }));
    await new CentralMacatuba({ fetch: fetcher }).request(path, undefined, { signal: controller.signal });
    const signal = (fetcher.mock.calls[0][1] as RequestInit).signal;
    controller.abort();
    expect(signal?.aborted).toBe(false);
  });
});
