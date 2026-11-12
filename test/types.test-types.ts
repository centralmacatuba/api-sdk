import type {
  CalendarDayResponse,
  CalendarGenerateJsonResponse,
  EndpointQuery,
  EndpointResponse,
} from "../src/types.js";

type Assert<T extends true> = T;
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
    ? true
    : false;
type IsRequired<T, K extends keyof T> = {} extends Pick<T, K> ? false : true;

type JornalQuery = EndpointQuery<"/api/jornal/pesquisar">;
type JornalSearchTermIsRequired = Assert<IsRequired<JornalQuery, "q">>;
type JornalFilterIsRestricted = Assert<
  Equal<
    NonNullable<JornalQuery["filtro"]>,
    "criador" | "titulo" | "subtitulo" | "conteudo" | "tudo"
  >
>;

type MapaQuery = EndpointQuery<"/api/mapa/pesquisar">;
type MapaSearchTermIsOptional = Assert<Equal<IsRequired<MapaQuery, "q">, false>>;

type RedirectQuery = EndpointQuery<"/api/redicionador/verificar">;
type RedirectUrlIsRequired = Assert<IsRequired<RedirectQuery, "url">>;

type DocsQuery = EndpointQuery<"/api/servicos/docs/verificar">;
type DocsSlugIsRequired = Assert<IsRequired<DocsQuery, "slug">>;

type StreamingSearchQuery = EndpointQuery<"/api/servicos/streaming/pesquisar">;
type StreamingSearchTypeIsRequired = Assert<IsRequired<StreamingSearchQuery, "tipo">>;

type StreamingVerifyQuery = EndpointQuery<"/api/servicos/streaming/verificar">;
type StreamingVerifyTypeIsRequired = Assert<IsRequired<StreamingVerifyQuery, "tipo">>;

type CalendarResponse = EndpointResponse<"/api/calendario/verificar">;
type CalendarHasTypedFields = Assert<
  CalendarResponse extends { data: string; eventos: unknown[] } ? true : false
>;
type CalendarWeekdayPreservesOpenApiEnum = Assert<
  Equal<CalendarDayResponse["dia_semana"], "0" | "1" | "2" | "3" | "4" | "5" | "6">
>;

type CalendarGenerateResponse = EndpointResponse<"/api/calendario/gerar">;
type CalendarGenerateSupportsBlob = Assert<
  Blob extends CalendarGenerateResponse ? true : false
>;
type CalendarGenerateJsonExcludesBlob = Assert<
  Equal<Extract<CalendarGenerateJsonResponse, Blob>, never>
>;
type CalendarGenerateYearIsNumber = Assert<
  Equal<CalendarGenerateJsonResponse["ano"], number>
>;
type CalendarGenerateMonthDayIsTyped = Assert<
  Equal<
    CalendarGenerateJsonResponse["meses"][string][string]["dia"],
    string | undefined
  >
>;
type CalendarGenerateHolidayIsTyped = Assert<
  Equal<
    CalendarGenerateJsonResponse["meses"][string][string]["feriado"],
    string | null | undefined
  >
>;

function checkResourceTypes(api: import("../src/index.js").CentralMacatubaSDK) {

  // Required query arguments must also be enforced on the public resource methods.
  // @ts-expect-error jornal search requires a query
  api.jornal.pesquisar();
  // The latest OpenAPI contract makes q optional for map search.
  api.mapa.pesquisar({});
  // @ts-expect-error redirect verification requires url
  api.redicionador.verificar({});
  // @ts-expect-error document verification requires slug
  api.servicos.docs.verificar({});
  // @ts-expect-error streaming search requires tipo
  api.servicos.streaming.pesquisar({});
  // @ts-expect-error streaming verification requires tipo
  api.servicos.streaming.verificar({});
  // @ts-expect-error streaming tipo must be one of the declared values
  api.servicos.streaming.verificar({ tipo: "unknown" });
  // @ts-expect-error non-calendar endpoints have no binary response
  const healthBlob: Blob = {} as EndpointResponse<"/">;

  void api.jornal.pesquisar({ q: "Macatuba", filtro: "titulo" });
  void api.mapa.pesquisar({ q: "Macatuba" });
  void api.redicionador.verificar({ url: "pagina" });
  void api.servicos.docs.verificar({ slug: "documento" });
  void api.servicos.streaming.pesquisar({ tipo: "radio" });
  void api.servicos.streaming.verificar({ tipo: "tv" });
}

export {};
