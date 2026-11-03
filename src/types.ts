export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue | QueryValue[]>;
export interface RequestOptions { headers?: HeadersInit; signal?: AbortSignal; timeoutMs?: number }
export interface CentralMacatubaOptions { baseUrl?: string; timeoutMs?: number; headers?: HeadersInit; fetch?: typeof fetch }
export interface ApiErrorResponse { message?: string; erro?: { id?: string; tipo?: string; mensagem?: string; bloqueado?: string; bloqueado_id?: string | null; tempo?: number | string | null; [key: string]: unknown }; [key: string]: unknown }
export interface HealthResponse { status: "ok"; service: "Central Macatuba - API Pública"; env: string }
export interface CalendarDayResponse { data: string; dia_semana: string; fim_de_semana: boolean; eventos: Array<Record<string, unknown>> }
export interface CalendarGenerateJsonResponse { ano: number; meses: Record<string, unknown> }
export type ApiResponse<T> = T | Blob;
