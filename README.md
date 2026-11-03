# @centralmacatuba/api

SDK em JavaScript e TypeScript para consumir a **API pública da Central Macatuba**.

> **Status:** desenvolvimento inicial (0.1.0). A interface pública poderá evoluir antes da primeira versão estável.

## Projeto e autoria

A Central Macatuba é um projeto independente desenvolvido por **Desenvolvedor EE (Dev EE)**. Não possui relação, vínculo institucional ou afiliação com a Prefeitura Municipal de Macatuba.

Este SDK é mantido no âmbito desse projeto independente. O nome Central Macatuba identifica o projeto e seus serviços digitais, não uma iniciativa ou produto oficial da administração municipal.

## Instalação

```bash
pnpm add @centralmacatuba/api
```

O pacote também poderá ser instalado por npm ou yarn. O desenvolvimento deste repositório usa pnpm 12.12.1.

## JavaScript

```js
import { CentralMacatubaSDK } from "@centralmacatuba/api";
const api = new CentralMacatubaSDK();
const resultado = await api.jornal.pesquisar({ q: "Macatuba" });
console.log(resultado);
```

## TypeScript

```ts
import { CentralMacatubaSDK } from "@centralmacatuba/api";
import type { CalendarDayResponse } from "@centralmacatuba/api";
const api = new CentralMacatubaSDK({ timeoutMs: 15_000 });
const calendario = await api.calendario.verificar({ data: "2026-11-02" }) as CalendarDayResponse;
console.log(calendario.eventos);
```

## Configuração

```ts
const api = new CentralMacatubaSDK({
  baseUrl: "https://publica.api.centralmacatuba.qzz.io",
  timeoutMs: 20_000,
  headers: { "X-App-Name": "meu-aplicativo" },
  // fetch: customFetch,
});
```

- URL padrão do gateway público da API.
- Fetch API nativa, sem Axios ou dependências de runtime.
- Node.js 18+ e navegadores com Fetch API.
- Builds ESM e CommonJS e declarações TypeScript.
- Cada chamada aceita `{ signal, timeoutMs, headers }` como segundo argumento após a consulta.
- JSON vira objeto; arquivos PDF/PNG são retornados como `Blob`.

## Recursos

O health check da raiz também está disponível em `api.health.verificar()`.

Namespaces: `health`, `avisos`, `calendario`, `dominios`, `informacoes`, `jornal`, `links`, `mapa`, `novidades`, `paginas`, `redicionador`, `servicos`, `sos` e `tempo`.

```ts
await api.health.verificar();
await api.avisos.verificar();
await api.calendario.gerar({ ano: 2026, formato: "pdf" });
await api.servicos.streaming.live.verificar();
await api.sos.listarAlertas();
```

## Segurança e escopo

O SDK atende exclusivamente à allowlist documentada da **API pública**. Não implementa autenticação interna, não contém chaves privadas e não permite chamar caminhos fora dos endpoints públicos conhecidos.

O endpoint SOS pode depender de consentimento/cookie emitido pela própria API. Esse comportamento precisa ser confirmado no gateway antes de documentar suporte a sessões.

## Desenvolvimento

```bash
pnpm install
pnpm generate:types
pnpm typecheck
pnpm test
pnpm build
```

O contrato OpenAPI em `openapi/openapi.json` foi obtido em https://publica.api.centralmacatuba.qzz.io/openapi.json

## Licença

MIT. Consulte o arquivo `LICENSE` para os termos e a titularidade dos direitos autorais.
