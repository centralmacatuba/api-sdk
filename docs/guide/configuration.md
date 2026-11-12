# Configuração

O construtor aceita um objeto `CentralMacatubaOptions`.

```ts
import { CentralMacatubaSDK } from "@centralmacatuba/api";

const api = new CentralMacatubaSDK({
  baseUrl: "https://publica.api.centralmacatuba.qzz.io",
  timeoutMs: 20_000,
  headers: { "X-App-Name": "meu-aplicativo" },
  credentials: "same-origin",
  // fetch: customFetch,
});
```

| Opção | Tipo | Padrão | Descrição |
|---|---|---|---|
| `baseUrl` | `string` | Gateway público | URL HTTP(S) base. Barras finais são removidas. |
| `timeoutMs` | `number` | `20000` | Timeout em milissegundos. Zero desativa o temporizador. |
| `headers` | `HeadersInit` | — | Cabeçalhos padrão enviados nas requisições. |
| `credentials` | `RequestCredentials` | `same-origin` | Política de credenciais da Fetch API. |
| `fetch` | `typeof fetch` | Fetch global | Implementação Fetch personalizada. |

A URL base deve usar HTTP ou HTTPS e não pode conter credenciais, query string ou fragmento. O timeout precisa ser finito e estar entre `0` e `2_147_483_647` milissegundos.

## Substituir a URL base

A opção `baseUrl` é útil para ambientes de teste ou gateways compatíveis. A SDK continua restringindo os caminhos aos endpoints presentes na allowlist; mudar a URL base não libera novas rotas.

## Fetch personalizada

```ts
const api = new CentralMacatubaSDK({
  fetch: (input, init) => fetch(input, init),
});
```

A implementação personalizada deve respeitar a assinatura e o comportamento esperado da Fetch API.
