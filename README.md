# @centralmacatuba/api

SDK em JavaScript e TypeScript para consumir a **API pública da Central Macatuba**.

> **Status:** desenvolvimento inicial (0.1.0). A interface pública poderá evoluir antes da primeira versão estável.

## Documentação

A documentação completa está disponível em **[sdk.centralmacatuba.qzz.io](https://sdk.centralmacatuba.qzz.io/)**.

Ela reúne instalação, primeiros passos, configuração, exemplos JavaScript/TypeScript, tratamento de erros e referência dos endpoints e tipos.

## Projeto e autoria

A Central Macatuba é um projeto independente desenvolvido por **Desenvolvedor EE (Dev EE)**. Não possui relação, vínculo institucional ou afiliação com a Prefeitura Municipal de Macatuba.

Este SDK é mantido no âmbito desse projeto independente. O nome Central Macatuba identifica o projeto e seus serviços digitais, não uma iniciativa ou produto oficial da administração municipal.

## Instalação

> **Atenção:** a versão `0.1.0` ainda não foi publicada. Os comandos abaixo só funcionarão depois que a primeira publicação estiver disponível no registry escolhido.

Por padrão, o escopo `@centralmacatuba` usa o npm Registry:

```bash
pnpm add @centralmacatuba/api
```

Também é possível usar `npm install @centralmacatuba/api` ou `yarn add @centralmacatuba/api`.

### GitHub Packages

O pacote também é publicado no GitHub Packages. Para instalar por esse registry, configure o escopo no arquivo `.npmrc` do projeto:

```ini
@centralmacatuba:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GH_PACKAGES_TOKEN}
```

Defina `GH_PACKAGES_TOKEN` no ambiente com um Personal Access Token (classic) que tenha a permissão `read:packages` e acesso ao pacote. Em ambientes de CI, prefira armazenar o token em um secret e disponibilizá-lo como variável de ambiente, sem gravá-lo no repositório.

Para voltar a instalar pelo npm Registry, remova a configuração de escopo do `.npmrc` ou altere-a para `https://registry.npmjs.org`.

## JavaScript

```js
import { CentralMacatubaSDK } from "@centralmacatuba/api";

const api = new CentralMacatubaSDK();
const resultado = await api.jornal.pesquisar({ q: "Macatuba" });
console.log(resultado);
```

## TypeScript

Os parâmetros e as respostas JSON são inferidos do contrato OpenAPI versionado neste repositório. O pacote publicado inclui as declarações TypeScript geradas a partir desse contrato, mas não distribui o arquivo `openapi/openapi.json`. Os métodos também validam em tempo de compilação os parâmetros obrigatórios de cada endpoint.

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
- Node.js 18+ e navegadores com Fetch API. A compatibilidade de consumo é validada em Node.js 18.
- Builds ESM e CommonJS e declarações TypeScript.
- Cada chamada aceita `{ signal, timeoutMs, headers, credentials }` como opções.
- As respostas JSON são retornadas como objetos ou arrays tipados; arquivos PDF/PNG são retornados como `Blob`.
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

Requisitos: Node.js 20 ou superior para executar a suíte completa (Vitest 4) e pnpm 12.12.1. O SDK publicado continua compatível com Node.js 18 ou superior; essa compatibilidade é validada separadamente na CI, incluindo build e consumo ESM/CommonJS/TypeScript em Node.js 18.

```bash
pnpm install --frozen-lockfile
pnpm generate:types
pnpm typecheck
pnpm test
pnpm build
pnpm pack --dry-run
```

Para executar a documentação localmente:

```bash
pnpm docs:dev
```

Para executar os testes automatizados da documentação (links locais, navegação, exemplos e referência OpenAPI):

```bash
pnpm docs:test
```

Para validar a compilação:

```bash
pnpm docs:build
```

Para executar o teste de integração opcional do health check contra o gateway real:

```bash
CM_API_INTEGRATION=1 pnpm test:integration
```

Esse teste não é executado na suíte padrão para evitar que indisponibilidades externas tornem o CI instável. Os testes unitários e os testes de tipos não dependem da API em produção.

O contrato OpenAPI versionado em `openapi/openapi.json` descreve a API pública. Depois de alterar esse contrato, execute `pnpm generate:types` e revise/registre `src/generated/schema.d.ts`. Para sincronizar os arquivos gerados pelo GitHub Actions, execute o workflow manual **Sync generated files** na branch de trabalho e selecione:

- `code`: sincroniza os tipos TypeScript gerados;
- `docs`: sincroniza a referência de endpoints;
- `all`: sincroniza os dois conjuntos de arquivos.

## Releases

As versões seguem [Semantic Versioning](https://semver.org/) e são gerenciadas pelo [Changesets](https://changesets.dev/).

Antes de concluir um PR com mudanças que alterem o pacote, crie um changeset:

```bash
pnpm changeset
```

Selecione `patch`, `minor` ou `major` conforme o impacto da mudança e inclua o arquivo gerado em `.changeset/`. O workflow **Release** na branch `principal` reúne as alterações em um PR de versionamento. Depois da revisão e do merge desse PR, o workflow valida e publica a versão no npm Registry e no GitHub Packages, cria a tag Git e registra a GitHub Release. A publicação no GitHub Packages é reconciliada pela versão exata disponível no npm, de modo que uma nova execução possa completar uma publicação parcial sem tentar publicar novamente a mesma versão.

A publicação no npm usa Trusted Publishing (OIDC), sem token permanente. Configure o Trusted Publisher para o repositório `centralmacatuba/api-sdk` e para o workflow `release.yml`. O workflow permanece desabilitado até a variável de repositório `NPM_RELEASE_ENABLED` receber o valor `true`. Primeiro publique manualmente a versão inicial do pacote no npm, configure e teste o Trusted Publisher e, só então, habilite essa variável para as próximas versões. Se o Trusted Publisher tiver sido configurado a partir de 3 de setembro de 2026, confira também se a opção **Allow npm publish** está habilitada; sem ela, o fluxo `changeset publish` não poderá executar `npm publish`.

O pacote do GitHub Packages pode exigir ajuste de visibilidade após a primeira publicação. Se a intenção for disponibilizá-lo publicamente, confira as configurações do pacote em **GitHub → Packages → Package settings** e defina a visibilidade como **Public**.

Para permitir que o workflow crie o PR de versionamento, ative **Allow GitHub Actions to create and approve pull requests** em **Settings > Actions > General > Workflow permissions**. Essa configuração do repositório é necessária além da permissão `pull-requests: write` declarada no workflow.

## Licença

MIT. Consulte o arquivo `LICENSE` para os termos e a titularidade dos direitos autorais.
