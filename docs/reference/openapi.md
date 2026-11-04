# Contrato OpenAPI

A SDK mantém uma cópia versionada do contrato da API pública em `openapi/openapi.json`. Esse documento é a referência para os caminhos, parâmetros, operações e schemas utilizados na geração dos tipos TypeScript.

- [Visualizar openapi.json no GitHub](https://github.com/centralmacatuba/api-sdk/blob/feat/sdk-inicial/openapi/openapi.json)
- [Documentação da API pública](https://centralmacatuba.github.io/api-publica-docs/)

## Atualização do contrato

Quando o contrato for atualizado:

1. Revise se as rotas pertencem à API pública.
2. Atualize `openapi/openapi.json`.
3. Execute `pnpm generate:types`.
4. Revise `src/generated/schema.d.ts`.
5. Atualize esta documentação quando métodos, parâmetros ou respostas mudarem.

A CI verifica se os tipos gerados permanecem sincronizados com o contrato versionado.

::: warning Limite importante
Os tipos são derivados do OpenAPI, mas a SDK não faz validação de schema JSON em runtime. Schemas ainda não comprovados devem permanecer explicitamente genéricos.
:::
