---
layout: home

hero:
  name: "@centralmacatuba/api"
  text: SDK JavaScript e TypeScript
  tagline: Integre aplicações à API pública da Central Macatuba com uma interface tipada, simples e baseada na Fetch API.
  actions:
    - theme: brand
      text: Começar agora
      link: /guide/installation
    - theme: alt
      text: Ver endpoints
      link: /reference/endpoints

features:
  - title: JavaScript e TypeScript
    details: Builds ESM e CommonJS, declarações TypeScript e inferência de parâmetros e respostas a partir do contrato OpenAPI.
  - title: Sem dependências de runtime
    details: Utiliza a Fetch API nativa e funciona em Node.js 18+ e navegadores compatíveis.
  - title: Escopo público e explícito
    details: Permite somente as rotas incluídas na allowlist pública da SDK.
---

## Sobre

A `@centralmacatuba/api` é uma biblioteca para consumir a API pública do projeto independente **Central Macatuba**.

A SDK fornece um cliente configurável e namespaces por serviço, preservando os tipos derivados do contrato OpenAPI versionado no repositório.

::: warning Estado do pacote
A SDK está em desenvolvimento inicial (`0.1.0`) e ainda não foi publicada no npm. Consulte o [guia de instalação](/guide/installation) para conhecer as formas de uso disponíveis durante o desenvolvimento.
:::

## Navegação

- [Instalação](/guide/installation)
- [Primeiros passos](/guide/getting-started)
- [Configuração](/guide/configuration)
- [Referência de endpoints](/reference/endpoints)
- [Contrato OpenAPI](/reference/openapi)

## Projeto independente

A Central Macatuba é desenvolvida por **Desenvolvedor EE (Dev EE)** e não possui relação, vínculo institucional ou afiliação com a Prefeitura Municipal de Macatuba.
