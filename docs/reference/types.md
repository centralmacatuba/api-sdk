# Tipos públicos

Os tipos da SDK são exportados pelo ponto de entrada do pacote.

```ts
import type {
  CentralMacatubaOptions,
  RequestOptions,
  PublicEndpoint,
  EndpointQuery,
  EndpointResponse,
  HealthResponse,
  CalendarDayResponse,
  CalendarGenerateJsonResponse,
  paths,
  components,
  operations,
} from "@centralmacatuba/api";
```

## Tipos de configuração e requisição

- `CentralMacatubaOptions`: opções do construtor.
- `RequestOptions`: opções por chamada, como cabeçalhos, timeout, credenciais e cancelamento.
- `QueryValue` e `QueryParams`: valores aceitos na query string.

## Tipos relacionados a endpoints

- `PublicEndpoint`: união das rotas permitidas.
- `EndpointQuery<P>`: parâmetros de consulta de uma rota.
- `EndpointResponse<P>`: resposta associada à rota.

## Tipos OpenAPI

`paths`, `components` e `operations` são exportados do schema gerado. Eles refletem o arquivo `openapi/openapi.json` distribuído no repositório.

Os schemas genéricos do contrato devem ser tratados como genéricos. A existência de um tipo TypeScript não significa que a SDK valide a resposta em runtime.
