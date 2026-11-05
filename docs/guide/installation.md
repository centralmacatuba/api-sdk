# Instalação

::: warning Pacote ainda não publicado
A versão `0.1.0` ainda não está publicada. Os comandos de instalação pelos registries só devem ser usados depois da primeira publicação.
:::

## npm Registry

Por padrão, o escopo `@centralmacatuba` utiliza o npm Registry:

```bash
pnpm add @centralmacatuba/api
```

Também é possível instalar com npm:

```bash
npm install @centralmacatuba/api
```

Ou com Yarn:

```bash
yarn add @centralmacatuba/api
```

## GitHub Packages

O mesmo pacote também está disponível no GitHub Packages. Para usar esse registry, adicione ao `.npmrc` do projeto:

```ini
@centralmacatuba:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GH_PACKAGES_TOKEN}
```

Defina `GH_PACKAGES_TOKEN` como variável de ambiente com um Personal Access Token (classic) que tenha a permissão `read:packages` e acesso ao pacote. Em CI, armazene o token em um secret e injete-o no ambiente; não grave tokens diretamente no `.npmrc` versionado.

Para voltar ao npm Registry, remova a configuração de escopo ou altere o destino para `https://registry.npmjs.org`.

## Requisitos

- Node.js 18 ou superior para consumo do pacote.
- Navegador com suporte à Fetch API, quando utilizado no browser.
- TypeScript é opcional; as declarações de tipos são distribuídas com o pacote.

A suíte completa de desenvolvimento usa Node.js 20 ou superior por causa da versão do Vitest. Isso não altera o requisito de runtime da SDK.

## Uso durante o desenvolvimento

Clone o repositório e instale as dependências de desenvolvimento:

```bash
git clone https://github.com/centralmacatuba/api-sdk.git
cd api-sdk
pnpm install --frozen-lockfile
pnpm build
```

A saída compilada fica em `dist/`. Para consumir uma cópia local em outro projeto, utilize o tarball gerado por `pnpm pack` ou um link local conforme o gerenciador de pacotes.
