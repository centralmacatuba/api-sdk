import { describe, expect, it, vi } from "vitest";
import { CentralMacatuba, CentralMacatubaError } from "../src/index.js";
const json = (data: unknown, status=200) => new Response(JSON.stringify(data), {status,headers:{"content-type":"application/json"}});
describe("CentralMacatuba",()=>{
 it("uses the official public API origin",()=>{const c=new CentralMacatuba({fetch:vi.fn()});expect(c.baseUrl).toBe("https://publica.api.centralmacatuba.qzz.io");});
 it("serializes query values and parses JSON",async()=>{const f=vi.fn().mockResolvedValue(json({total:1}));const c=new CentralMacatuba({fetch:f});await expect(c.request("/api/jornal/pesquisar",{q:"Macatuba",page:2})).resolves.toEqual({total:1});expect(f.mock.calls[0][0]).toContain("?q=Macatuba&page=2");});
 it("blocks paths outside the public allowlist",async()=>{const c=new CentralMacatuba({fetch:vi.fn()});await expect(c.request("/api/admin/users")).rejects.toBeInstanceOf(CentralMacatubaError);});
 it("returns PDF/PNG as Blob",async()=>{const f=vi.fn().mockResolvedValue(new Response(new Uint8Array([1,2]),{headers:{"content-type":"application/pdf"}}));const c=new CentralMacatuba({fetch:f});const b=await c.request<Blob>("/api/calendario/gerar",{formato:"pdf"});expect(b).toBeInstanceOf(Blob);expect(b.type).toBe("application/pdf");});
 it("preserves HTTP status on errors",async()=>{const c=new CentralMacatuba({fetch:vi.fn().mockResolvedValue(json({erro:{mensagem:"Indisponível"}},503))});await expect(c.request("/api/tempo/verificar")).rejects.toMatchObject({status:503});});
});
