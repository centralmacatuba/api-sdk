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
type MapaSearchTermIsRequired = Assert<IsRequired<MapaQuery, "q">>;

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

export {};
