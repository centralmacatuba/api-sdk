# Cliente e requisições

A classe `CentralMacatubaSDK` estende o cliente HTTP e expõe namespaces prontos para os serviços públicos.

## Requisição genérica tipada

```ts
const resultado = await api.request("/api/jornal/pesquisar", {
  q: "Macatuba",
  filtro: "titulo",
});
```

O primeiro argumento precisa ser um membro de `PUBLIC_ENDPOINTS`. Parâmetros e retorno são associados ao caminho selecionado pelo sistema de tipos.

## Opções por chamada

O segundo argumento opcional de uma operação é `RequestOptions`:

```ts
const resultado = await api.jornal.pesquisar(
  { q: "Macatuba" },
  {
    timeoutMs: 5_000,
    headers: { "X-Request-Source": "web" },
    signal: controller.signal,
    credentials: "same-origin",
  },
);
```

Opções por chamada substituem os valores padrão correspondentes. Cabeçalhos da chamada substituem cabeçalhos padrão com a mesma chave.

## Query string

- Strings, números e booleanos são convertidos para texto.
- Arrays produzem parâmetros repetidos.
- Valores nulos ou indefinidos são ignorados.
- A codificação é feita por `URLSearchParams`.

O contrato OpenAPI atual não declara parâmetros de consulta do tipo array nos endpoints públicos. Por isso, ainda não há uma chamada real da API que sirva como exemplo para esse formato; quando um endpoint com esse parâmetro for documentado, o SDK serializará cada item como uma ocorrência repetida da mesma chave.

## Respostas

As respostas JSON são analisadas como valores JSON; conforme o contrato do endpoint, podem ser objetos ou arrays. Respostas não JSON são lidas como `Blob`; para geração de calendário, os tipos binários documentados são PDF e PNG. A SDK não executa validação de schema JSON em runtime.

## Metadados HTTP e paginação

O método `requestWithMetadata()` mantém o retorno de `request()` intacto e também expõe os metadados da resposta HTTP:

```ts
const response = await api.requestWithMetadata("/api/jornal/verificar", {
  page: 2,
  limit: 20,
});

console.log(response.data);
console.log(response.headers.get("X-Total-Pages"));
console.log(response.headers.get("X-Has-Next-Page"));
```

A propriedade `headers` é uma cópia dos cabeçalhos da resposta bem-sucedida. Use-a para navegação paginada, contagens e demais metadados documentados pelo OpenAPI. Consulte também o [guia de paginação](/guide/pagination). `request()` continua retornando apenas os dados analisados, sem alteração de comportamento.

## Allowlist

`PUBLIC_ENDPOINTS` é uma lista congelada das rotas públicas suportadas. A SDK rejeita caminhos não autorizados antes de executar a requisição. A allowlist não oferece acesso a endpoints privados ou administrativos.
