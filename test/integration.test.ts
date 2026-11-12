import { describe, expect, it } from "vitest";
import { CentralMacatubaSDK } from "../src/index.js";

const enabled = process.env.CM_API_INTEGRATION === "1";

describe.skipIf(!enabled)("public API integration", () => {
  it("reaches the public gateway health endpoint", async () => {
    const api = new CentralMacatubaSDK({ timeoutMs: 15_000 });
    const result = await api.health.verificar();

    expect(result).toMatchObject({
      status: "ok",
      service: "Central Macatuba - API Pública",
    });
    expect(typeof result.env).toBe("string");
  }, 20_000);
});
