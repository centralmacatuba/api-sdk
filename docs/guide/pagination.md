# Paginação

Os endpoints que declaram paginação aceitam os parâmetros `page` e `limit`. A página começa em 1; o limite padrão é 20 e o máximo documentado é 100. Consulte a referência OpenAPI de cada endpoint para confirmar se ele oferece esses parâmetros.

## Ler os metadados da resposta

Use `requestWithMetadata()` para receber os dados e os cabeçalhos HTTP da resposta:

```ts
const response = await api.requestWithMetadata("/api/servicos/pesquisar", {
  page: 1,
  limit: 20,
});

const total = Number(response.headers.get("X-Total-Count") ?? 0);
const totalPages = Number(response.headers.get("X-Total-Pages") ?? 0);
const hasNextPage = response.headers.get("X-Has-Next-Page") === "true";

console.log(response.data, { total, totalPages, hasNextPage });
```

A API pode retornar estes cabeçalhos de paginação:

| Cabeçalho | Significado |
|---|---|
| `X-Page` | Página atual, começando em 1. |
| `X-Per-Page` | Quantidade máxima de registros solicitada. |
| `X-Total-Count` | Total de registros correspondentes à consulta. |
| `X-Total-Pages` | Quantidade total de páginas. |
| `X-Has-Next-Page` | Indica se existe uma próxima página. |
| `X-Has-Previous-Page` | Indica se existe uma página anterior. |

Os cabeçalhos são acessados por `Headers.get()`, que não diferencia maiúsculas de minúsculas.

## Buscar a próxima página

A SDK não percorre páginas automaticamente. Isso evita fazer requisições adicionais inesperadas ou carregar conjuntos grandes de dados sem decisão explícita da aplicação.

```ts
const primeira = await api.requestWithMetadata("/api/servicos/pesquisar", {
  page: 1,
  limit: 20,
});

if (primeira.headers.get("X-Has-Next-Page") === "true") {
  const proxima = await api.requestWithMetadata("/api/servicos/pesquisar", {
    page: 2,
    limit: 20,
  });

  console.log(proxima.data);
}
```

## Navegadores e CORS

Em aplicações executadas no navegador, o servidor da API precisa expor os cabeçalhos de paginação por meio de `Access-Control-Expose-Headers`. Se um cabeçalho não estiver exposto, `Headers.get()` poderá retornar `null` mesmo que o servidor o envie. Consulte a configuração CORS do ambiente da API.
