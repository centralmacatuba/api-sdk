import { describe, expect, it } from "vitest";
import { CentralMacatubaSDK } from "../src/index.js";

const enabled = process.env.CM_API_INTEGRATION === "1";
const timeout = 60_000;

describe.skipIf(!enabled)("public API integration", () => {
  const api = new CentralMacatubaSDK({ timeoutMs: 20_000 });

  it("reaches the public gateway health endpoint", async () => {
    const result = await api.health.verificar();

    expect(result).toMatchObject({
      status: "ok",
      service: "Central Macatuba - API Pública",
    });
    expect(typeof result.env).toBe("string");
  }, timeout);

  it("searches the public service catalog and exposes pagination headers", async () => {
    const response = await api.requestWithMetadata("/api/servicos/pesquisar", {
      page: 1,
      limit: 1,
    });

    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      status: "sucesso",
      data: expect.any(Array),
      paginacao: {
        pagina: 1,
        limite: 1,
      },
    });

    for (const header of [
      "X-Page",
      "X-Per-Page",
      "X-Total-Count",
      "X-Total-Pages",
      "X-Has-Next-Page",
      "X-Has-Previous-Page",
    ]) {
      expect(response.headers.get(header), `missing ${header}`).not.toBeNull();
    }

    expect(response.headers.get("X-Page")).toBe("1");
    expect(response.headers.get("X-Per-Page")).toBe("1");
    expect(Number(response.headers.get("X-Total-Count"))).toBeGreaterThanOrEqual(0);
    expect(["true", "false"]).toContain(response.headers.get("X-Has-Next-Page"));
    expect(["true", "false"]).toContain(response.headers.get("X-Has-Previous-Page"));
  }, timeout);

  it("honors the SOS permission header without relying on cookies", async () => {
    const response = await api.requestWithMetadata("/api/sos/listar_alertas", undefined, {
      headers: { "X-CM-SOS-PERMISSION": "granted" },
    });

    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      success: true,
      alertas: expect.any(Array),
      notificacaoAceita: true,
    });
  }, timeout);

  it.each(["pdf", "png"] as const)(
    "downloads calendar output as a %s Blob",
    async (formato) => {
      const result = await api.calendario.gerar({
        ano: new Date().getFullYear(),
        formato,
      });

      expect(result).toBeInstanceOf(Blob);
      expect((result as Blob).type).toBe(formato === "pdf" ? "application/pdf" : "image/png");
      expect((result as Blob).size).toBeGreaterThan(0);
    },
    timeout,
  );
});
