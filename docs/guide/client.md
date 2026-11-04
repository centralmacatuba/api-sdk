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

## Respostas

Respostas JSON são analisadas como objetos. Respostas não JSON são lidas como `Blob`; para geração de calendário, os tipos binários documentados são PDF e PNG. A SDK não executa validação de schema JSON em runtime.

## Allowlist

`PUBLIC_ENDPOINTS` é uma lista congelada das rotas públicas suportadas. A SDK rejeita caminhos não autorizados antes de executar a requisição. A allowlist não oferece acesso a endpoints privados ou administrativos.
