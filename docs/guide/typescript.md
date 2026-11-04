# TypeScript

A SDK distribui declarações TypeScript e deriva os parâmetros e respostas JSON do contrato OpenAPI versionado em `openapi/openapi.json`.

```ts
import {
  CentralMacatubaSDK,
  CentralMacatubaError,
  type CentralMacatubaOptions,
} from "@centralmacatuba/api";

const options: CentralMacatubaOptions = {
  timeoutMs: 15_000,
  headers: { "X-App-Name": "meu-aplicativo" },
};

const api = new CentralMacatubaSDK(options);

try {
  const resultado = await api.jornal.pesquisar({
    q: "Macatuba",
    filtro: "titulo",
  });
  console.log(resultado);
} catch (error: unknown) {
  if (error instanceof CentralMacatubaError) {
    console.error(error.status, error.response);
  }
}
```

## Tipos exportados

A SDK exporta, entre outros:

- `paths`, `components` e `operations`: tipos gerados pelo openapi-typescript.
- `CentralMacatubaOptions`: opções de configuração do cliente.
- `RequestOptions`: opções específicas de cada requisição.
- `PublicEndpoint`: união literal das rotas permitidas.
- `EndpointQuery<P>` e `EndpointResponse<P>`: parâmetros e respostas associados a uma rota.
- `HealthResponse`, `CalendarDayResponse` e `CalendarGenerateJsonResponse`: tipos de respostas documentados.

## Contrato e limites

Os tipos descrevem o contrato OpenAPI, mas a SDK não valida automaticamente cada objeto JSON em runtime. Quando o contrato declara uma resposta genérica por falta de schema confirmado, a SDK preserva essa incerteza em vez de inventar uma estrutura.
