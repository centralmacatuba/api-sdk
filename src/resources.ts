import type { CentralMacatuba, PublicEndpoint } from "./client.js";
import type { EndpointRequestArgs, EndpointResponse } from "./types.js";

type Call<P extends PublicEndpoint> = (
  ...args: EndpointRequestArgs<P>
) => Promise<EndpointResponse<P>>;

/** Binds a public endpoint to the client while preserving its inferred types. */
function bind<P extends PublicEndpoint>(client: CentralMacatuba, path: P): Call<P> {
  return (...args) => client.request(path, ...args);
}

/** Creates the typed resource namespaces exposed by the SDK. */
export function createResources(client: CentralMacatuba) {
  return {
    health: { verificar: bind(client, "/") },
    avisos: { verificar: bind(client, "/api/avisos/verificar") },
    calendario: {
      verificar: bind(client, "/api/calendario/verificar"),
      gerar: bind(client, "/api/calendario/gerar"),
    },
    dominios: { verificar: bind(client, "/api/dominios/verificar") },
    informacoes: {
      pesquisar: bind(client, "/api/informacoes/pesquisar"),
      verificar: bind(client, "/api/informacoes/verificar"),
    },
    jornal: {
      pesquisar: bind(client, "/api/jornal/pesquisar"),
      verificar: bind(client, "/api/jornal/verificar"),
    },
    links: {
      pesquisar: bind(client, "/api/links/pesquisar"),
      verificar: bind(client, "/api/links/verificar"),
    },
    mapa: {
      pesquisar: bind(client, "/api/mapa/pesquisar"),
      verificar: bind(client, "/api/mapa/verificar"),
    },
    novidades: {
      pesquisar: bind(client, "/api/novidades/pesquisar"),
      verificar: bind(client, "/api/novidades/verificar"),
    },
    paginas: {
      pesquisar: bind(client, "/api/paginas/pesquisar"),
      verificar: bind(client, "/api/paginas/verificar"),
    },
    redicionador: { verificar: bind(client, "/api/redicionador/verificar") },
    servicos: {
      verificar: bind(client, "/api/servicos/verificar"),
      cursos: {
        pesquisar: bind(client, "/api/servicos/cursos/pesquisar"),
        verificar: bind(client, "/api/servicos/cursos/verificar"),
      },
      docs: {
        pesquisar: bind(client, "/api/servicos/docs/pesquisar"),
        verificar: bind(client, "/api/servicos/docs/verificar"),
      },
      jogos: {
        pesquisar: bind(client, "/api/servicos/jogos/pesquisar"),
        verificar: bind(client, "/api/servicos/jogos/verificar"),
      },
      streaming: {
        pesquisar: bind(client, "/api/servicos/streaming/pesquisar"),
        verificar: bind(client, "/api/servicos/streaming/verificar"),
        live: { verificar: bind(client, "/api/servicos/streaming/live/verificar") },
      },
    },
    sos: { listarAlertas: bind(client, "/api/sos/listar_alertas") },
    tempo: { verificar: bind(client, "/api/tempo/verificar") },
  };
}
