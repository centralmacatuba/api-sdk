export interface CentralMacatubaErrorOptions { status?: number; statusText?: string; url?: string; response?: unknown; headers?: Headers; cause?: unknown }
export class CentralMacatubaError extends Error {
  readonly status?: number; readonly statusText?: string; readonly url?: string; readonly response?: unknown; readonly headers?: Headers;
  constructor(message: string, options: CentralMacatubaErrorOptions = {}) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause });
    this.name = "CentralMacatubaError"; this.status = options.status; this.statusText = options.statusText; this.url = options.url; this.response = options.response; this.headers = options.headers;
  }
}
