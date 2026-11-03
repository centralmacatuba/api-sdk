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

Os parâmetros e as respostas JSON são inferidos do contrato OpenAPI incluído no pacote. Os métodos também validam em tempo de compilação os parâmetros obrigatórios de cada endpoint.

```ts
import { CentralMacatubaSDK } from "@centralmacatuba/api";

const api = new CentralMacatubaSDK({ timeoutMs: 15_000 });
const calendario = await api.calendario.verificar({ data: "2026-11-02" });
console.log(calendario.eventos);

const pesquisa = await api.jornal.pesquisar({ q: "Macatuba", filtro: "titulo" });
console.log(pesquisa);
```

## Configuração

```ts
const api = new CentralMacatubaSDK({
  baseUrl: "https://publica.api.centralmacatuba.qzz.io",
  timeoutMs: 20_000,
  headers: { "X-App-Name": "meu-aplicativo" },
  credentials: "same-origin",
  // fetch: customFetch,
});
```

- URL padrão do gateway oficial da API pública.
- Fetch API nativa, sem Axios ou dependências de runtime.
- Node.js 18+ e navegadores com Fetch API.
- Builds ESM e CommonJS e declarações TypeScript.
- Cada chamada aceita `{ signal, timeoutMs, headers, credentials }` como opções.
- JSON é retornado como objeto tipado; arquivos PDF/PNG são retornados como `Blob`.
- `timeoutMs: 0` desativa o timeout.

## Cookies e SOS

O endpoint SOS consulta o cookie `centralmacatuba_sos-permissao`. Em navegadores, o SDK não tenta ler nem definir esse cookie: ele deixa o navegador gerenciá-lo.

Para uma chamada entre origens que precise enviar o cookie, configure `credentials: "include"` no cliente ou somente na chamada:

```ts
const api = new CentralMacatubaSDK({ credentials: "include" });
const resultado = await api.sos.listarAlertas();
```

O gateway precisa encaminhar o cookie recebido ao endpoint e, para chamadas cross-origin, responder com CORS compatível com credenciais (origem explícita e `Access-Control-Allow-Credentials: true`). O cookie também precisa ter atributos compatíveis com o contexto, incluindo `SameSite=None; Secure` quando for realmente cross-site. O SDK não consegue contornar essas políticas do navegador.

Em Node.js, Fetch não mantém automaticamente um cookie jar entre chamadas. Para sessões persistentes, forneça uma implementação `fetch` com gerenciamento de cookies adequado ao seu ambiente.

## Recursos

O health check da raiz também está disponível em `api.health.verificar()`.

Namespaces: `health`, `avisos`, `calendario`, `dominios`, `informacoes`, `jornal`, `links`, `mapa`, `novidades`, `paginas`, `redicionador`, `servicos`, `sos` e `tempo`.

```ts
await api.health.verificar();
await api.avisos.verificar();
const arquivo = await api.calendario.gerar({ ano: 2026, formato: "pdf" });
if (arquivo instanceof Blob) {
  console.log(arquivo.type);
}
await api.servicos.streaming.live.verificar();
await api.sos.listarAlertas();
```

## Segurança e escopo

O SDK atende exclusivamente à allowlist documentada da **API pública**. Não implementa autenticação interna, não contém chaves privadas e não permite chamar caminhos fora dos endpoints públicos conhecidos.

A allowlist de rotas e os tipos TypeScript são derivados/validados contra `openapi/openapi.json`. Ao atualizar o contrato, execute `pnpm generate:types` e revise as mudanças nos tipos.

## Desenvolvimento

Requisitos: Node.js 18 ou superior e pnpm 12.12.1.

```bash
pnpm install --frozen-lockfile
pnpm generate:types
pnpm typecheck
pnpm test
pnpm build
pnpm pack --dry-run
```

Para executar o teste de integração opcional do health check contra o gateway real:

```bash
CM_API_INTEGRATION=1 pnpm test:integration
```

Esse teste não é executado na suíte padrão para evitar que indisponibilidades externas tornem o CI instável. Os testes unitários e os testes de tipos não dependem da API em produção.

O contrato OpenAPI versionado em `openapi/openapi.json` descreve a API pública. Depois de alterar esse contrato, execute `pnpm generate:types` e revise/registre `src/generated/schema.d.ts`. Para sincronizar o arquivo diretamente pelo GitHub Actions, use o workflow manual **Sync OpenAPI types** na branch de trabalho; ele gera e envia somente esse arquivo.

## Licença

MIT. Consulte o arquivo `LICENSE` para os termos e a titularidade dos direitos autorais.
