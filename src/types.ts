import type { paths } from "./generated/schema.js";

export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue | QueryValue[]>;

export interface RequestOptions {
  headers?: HeadersInit;
  signal?: AbortSignal;
  timeoutMs?: number;
  /** Use "include" for cross-origin requests that need browser-managed cookies. */
  credentials?: RequestCredentials;
}

export interface CentralMacatubaOptions {
  baseUrl?: string;
  timeoutMs?: number;
  headers?: HeadersInit;
  fetch?: typeof fetch;
  /** Defaults to "same-origin", matching the Fetch API default. */
  credentials?: RequestCredentials;
}

export interface ApiErrorResponse {
  message?: string;
  erro?: {
    id?: string;
    tipo?: string;
    mensagem?: string;
    bloqueado?: string;
    bloqueado_id?: string | null;
    tempo?: number | string | null;
    [key: string]: unknown;
  } | string;
  [key: string]: unknown;
}

export type ApiResponse<T> = T | Blob;

/** HTTP metadata retained alongside a parsed public API response. */
export interface ApiResponseMetadata {
  status: number;
  statusText: string;
  url: string;
  headers: Headers;
}

/** Parsed response data together with the successful HTTP response metadata. */
export interface ApiResponseWithMetadata<T> extends ApiResponseMetadata {
  data: T;
}

type GetOperation<P extends keyof paths> =
  paths[P] extends { get: infer Operation } ? Operation : never;

type OperationParameters<P extends keyof paths> =
  GetOperation<P> extends { parameters?: infer Parameters } ? Parameters : never;

export type EndpointQuery<P extends keyof paths> =
  OperationParameters<P> extends { query?: infer Query }
    ? NonNullable<Query>
    : never;

type OperationResponses<P extends keyof paths> =
  GetOperation<P> extends { responses: infer Responses } ? Responses : never;

type SuccessResponse<P extends keyof paths> =
  OperationResponses<P> extends { 200: infer Response }
    ? Response
    : OperationResponses<P> extends { "200": infer Response }
      ? Response
      : never;

type JsonContent<Response> =
  Response extends { content: infer Content }
    ? Content extends { "application/json": infer Json }
      ? Json
      : unknown
    : unknown;

/** JSON response inferred from the endpoint's OpenAPI 200 response. */
export type EndpointResponse<P extends keyof paths> =
  P extends "/api/calendario/gerar"
    ? JsonContent<SuccessResponse<P>> | Blob
    : JsonContent<SuccessResponse<P>>;

export type EndpointResponseWithMetadata<P extends keyof paths> = ApiResponseWithMetadata<EndpointResponse<P>>;

export type EndpointRequestArgs<P extends keyof paths> =
  [EndpointQuery<P>] extends [never]
    ? [query?: undefined, options?: RequestOptions]
    : {} extends EndpointQuery<P>
      ? [query?: EndpointQuery<P>, options?: RequestOptions]
      : [query: EndpointQuery<P>, options?: RequestOptions];

export type HealthResponse = EndpointResponse<"/">;

/** Calendar verification response, kept identical to the OpenAPI contract. */
export type CalendarDayResponse = EndpointResponse<"/api/calendario/verificar">;

/** JSON variant of calendar generation, excluding its documented PDF/PNG responses. */
export type CalendarGenerateJsonResponse = Exclude<
  EndpointResponse<"/api/calendario/gerar">,
  Blob
>;
