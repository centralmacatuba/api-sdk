import type { EndpointQuery, EndpointResponse } from "../src/types.js";

type Assert<T extends true> = T;

const validJornalQuery: EndpointQuery<"/api/jornal/pesquisar"> = {
  q: "Macatuba",
  filtro: "titulo",
};
void validJornalQuery;

// @ts-expect-error The required q parameter must be supplied.
const missingRequiredSearchTerm: EndpointQuery<"/api/jornal/pesquisar"> = {
  filtro: "titulo",
};
void missingRequiredSearchTerm;

// @ts-expect-error The filter is restricted by the OpenAPI enum.
const invalidJornalFilter: EndpointQuery<"/api/jornal/pesquisar"> = {
  q: "Macatuba",
  filtro: "not-a-filter",
};
void invalidJornalFilter;

type CalendarResponse = EndpointResponse<"/api/calendario/verificar">;
type CalendarHasTypedFields = Assert<
  CalendarResponse extends { data: string; eventos: unknown[] } ? true : false
>;

type CalendarGenerateResponse = EndpointResponse<"/api/calendario/gerar">;
type CalendarGenerateSupportsBlob = Assert<
  Blob extends CalendarGenerateResponse ? true : false
>;

export {};
