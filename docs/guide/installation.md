# Instalação

::: warning Pacote ainda não publicado
A versão `0.1.0` ainda não está publicada no npm. Os comandos de instalação pelo registry só devem ser usados depois do anúncio da primeira publicação.
:::

## Instalação após a publicação

Com pnpm:

```bash
pnpm add @centralmacatuba/api
```

Com npm:

```bash
npm install @centralmacatuba/api
```

Com Yarn:

```bash
yarn add @centralmacatuba/api
```

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
