export { CentralMacatuba, DEFAULT_BASE_URL, PUBLIC_ENDPOINTS } from "./client.js";
export type { PublicEndpoint } from "./client.js";
export { CentralMacatubaError } from "./errors.js";
export type { CentralMacatubaErrorOptions } from "./errors.js";
export { createResources } from "./resources.js";
export type { ApiErrorResponse, ApiResponse, CalendarDayResponse, CalendarGenerateJsonResponse, CentralMacatubaOptions, HealthResponse, QueryParams, QueryValue, RequestOptions } from "./types.js";
import { CentralMacatuba as Client } from "./client.js";
import { createResources } from "./resources.js";
/** Client with the documented public API resources attached as namespaces. */
export class CentralMacatubaSDK extends Client {
  readonly resources: ReturnType<typeof createResources>;
  readonly avisos: ReturnType<typeof createResources>["avisos"];
  readonly calendario: ReturnType<typeof createResources>["calendario"];
  readonly dominios: ReturnType<typeof createResources>["dominios"];
  readonly informacoes: ReturnType<typeof createResources>["informacoes"];
  readonly jornal: ReturnType<typeof createResources>["jornal"];
  readonly links: ReturnType<typeof createResources>["links"];
  readonly mapa: ReturnType<typeof createResources>["mapa"];
  readonly novidades: ReturnType<typeof createResources>["novidades"];
  readonly paginas: ReturnType<typeof createResources>["paginas"];
  readonly redicionador: ReturnType<typeof createResources>["redicionador"];
  readonly servicos: ReturnType<typeof createResources>["servicos"];
  readonly sos: ReturnType<typeof createResources>["sos"];
  readonly tempo: ReturnType<typeof createResources>["tempo"];
  constructor(options = {}) {
    super(options); const resources = createResources(this); this.resources = resources; Object.assign(this, resources);
    this.avisos=resources.avisos; this.calendario=resources.calendario; this.dominios=resources.dominios; this.informacoes=resources.informacoes;
    this.jornal=resources.jornal; this.links=resources.links; this.mapa=resources.mapa; this.novidades=resources.novidades; this.paginas=resources.paginas;
    this.redicionador=resources.redicionador; this.servicos=resources.servicos; this.sos=resources.sos; this.tempo=resources.tempo;
  }
}
