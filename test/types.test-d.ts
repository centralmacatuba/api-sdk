import type { EndpointQuery, EndpointResponse } from "../src/types.js";

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

type CalendarResponse = EndpointResponse<"/api/calendario/verificar">;
type CalendarHasTypedFields = Assert<
  CalendarResponse extends { data: string; eventos: unknown[] } ? true : false
>;

type CalendarGenerateResponse = EndpointResponse<"/api/calendario/gerar">;
type CalendarGenerateSupportsBlob = Assert<
  Blob extends CalendarGenerateResponse ? true : false
>;

export {};
