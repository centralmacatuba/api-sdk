import { describe, expect, it, vi } from "vitest";
import { CentralMacatubaSDK, createResources } from "../src/index.js";

const routes: Array<[string, (api: CentralMacatubaSDK) => Promise<unknown>]> = [
  ["/", (api) => api.health.verificar()],
  ["/api/avisos/verificar", (api) => api.avisos.verificar()],
  ["/api/calendario/verificar", (api) => api.calendario.verificar()],
  ["/api/calendario/gerar", (api) => api.calendario.gerar()],
  ["/api/dominios/verificar", (api) => api.dominios.verificar()],
  ["/api/informacoes/pesquisar", (api) => api.informacoes.pesquisar()],
  ["/api/informacoes/verificar", (api) => api.informacoes.verificar()],
  ["/api/jornal/pesquisar", (api) => api.jornal.pesquisar({ q: "termo" })],
  ["/api/jornal/verificar", (api) => api.jornal.verificar()],
  ["/api/links/pesquisar", (api) => api.links.pesquisar()],
  ["/api/links/verificar", (api) => api.links.verificar()],
  ["/api/mapa/pesquisar", (api) => api.mapa.pesquisar({ q: "termo" })],
  ["/api/mapa/verificar", (api) => api.mapa.verificar()],
  ["/api/novidades/pesquisar", (api) => api.novidades.pesquisar()],
  ["/api/novidades/verificar", (api) => api.novidades.verificar()],
  ["/api/paginas/pesquisar", (api) => api.paginas.pesquisar()],
  ["/api/paginas/verificar", (api) => api.paginas.verificar()],
  ["/api/redicionador/verificar", (api) => api.redicionador.verificar({ url: "slug" })],
  ["/api/servicos/verificar", (api) => api.servicos.verificar()],
  ["/api/servicos/pesquisar", (api) => api.servicos.pesquisar()],
  ["/api/servicos/cursos/pesquisar", (api) => api.servicos.cursos.pesquisar()],
  ["/api/servicos/cursos/verificar", (api) => api.servicos.cursos.verificar()],
  ["/api/servicos/docs/pesquisar", (api) => api.servicos.docs.pesquisar()],
  ["/api/servicos/docs/verificar", (api) => api.servicos.docs.verificar({ slug: "doc" })],
  ["/api/servicos/jogos/pesquisar", (api) => api.servicos.jogos.pesquisar()],
  ["/api/servicos/jogos/verificar", (api) => api.servicos.jogos.verificar()],
  ["/api/servicos/streaming/pesquisar", (api) => api.servicos.streaming.pesquisar({ tipo: "radio" })],
  ["/api/servicos/streaming/verificar", (api) => api.servicos.streaming.verificar({ tipo: "tv" })],
  ["/api/servicos/streaming/live/verificar", (api) => api.servicos.streaming.live.verificar()],
  ["/api/sos/listar_alertas", (api) => api.sos.listarAlertas()],
  ["/api/tempo/verificar", (api) => api.tempo.verificar()],
];

describe("resource namespaces", () => {
  it.each(routes)("routes the resource to GET %s", async (path, call) => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response('{"ok":true}', { headers: { "content-type": "application/json" } }),
    );
    const api = new CentralMacatubaSDK({ baseUrl: "https://example.test", fetch: fetcher });

    await expect(call(api)).resolves.toEqual({ ok: true });
    expect(fetcher).toHaveBeenCalledOnce();
    expect(new URL(String(fetcher.mock.calls[0][0])).pathname).toBe(path);
    expect((fetcher.mock.calls[0][1] as RequestInit).method).toBe("GET");
  });

  it("forwards the SOS permission header through request options", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response('{"alertas":[]}', { headers: { "content-type": "application/json" } }),
    );
    const api = new CentralMacatubaSDK({ baseUrl: "https://example.test", fetch: fetcher });

    await api.sos.listarAlertas(undefined, {
      headers: { "X-CM-SOS-PERMISSION": "granted" },
    });

    const [, init] = fetcher.mock.calls[0] as [string, RequestInit];
    expect(new Headers(init.headers).get("x-cm-sos-permission")).toBe("granted");
  });

  it("forwards query and options through a standalone nested resource", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response('{"success":true}', { headers: { "content-type": "application/json" } }),
    );
    const api = new CentralMacatubaSDK({ baseUrl: "https://example.test", fetch: fetcher });
    const resources = createResources(api);
    const verify = resources.servicos.streaming.verificar;

    await verify({ tipo: "tv", funcao: "uma", id: 42 }, {
      headers: { "X-Request": "resource" },
      credentials: "include",
    });

    const [url, init] = fetcher.mock.calls[0] as [string, RequestInit];
    expect(new URL(url).searchParams.toString()).toBe("tipo=tv&funcao=uma&id=42");
    expect(new Headers(init.headers).get("x-request")).toBe("resource");
    expect(init.credentials).toBe("include");
    expect(api.servicos).toBe(api.resources.servicos);
  });
});
