# Namespaces e endpoints

A instância de `CentralMacatubaSDK` agrupa as rotas públicas em namespaces. Os métodos abaixo correspondem à allowlist implementada em `src/resources.ts`.

| Namespace | Método | Rota |
|---|---|---|
| `health` | `verificar()` | `/` |
| `avisos` | `verificar()` | `/api/avisos/verificar` |
| `calendario` | `verificar(...args)` | `/api/calendario/verificar` |
| `calendario` | `gerar(...args)` | `/api/calendario/gerar` |
| `dominios` | `verificar(...args)` | `/api/dominios/verificar` |
| `informacoes` | `pesquisar(...args)`, `verificar(...args)` | `/api/informacoes/{pesquisar,verificar}` |
| `jornal` | `pesquisar(...args)`, `verificar(...args)` | `/api/jornal/{pesquisar,verificar}` |
| `links` | `pesquisar(...args)`, `verificar(...args)` | `/api/links/{pesquisar,verificar}` |
| `mapa` | `pesquisar(...args)`, `verificar(...args)` | `/api/mapa/{pesquisar,verificar}` |
| `novidades` | `pesquisar(...args)`, `verificar(...args)` | `/api/novidades/{pesquisar,verificar}` |
| `paginas` | `pesquisar(...args)`, `verificar(...args)` | `/api/paginas/{pesquisar,verificar}` |
| `redicionador` | `verificar(...args)` | `/api/redicionador/verificar` |
| `servicos` | `verificar(...args)` | `/api/servicos/verificar` |
| `servicos.cursos` | `pesquisar(...args)`, `verificar(...args)` | `/api/servicos/cursos/{pesquisar,verificar}` |
| `servicos.docs` | `pesquisar(...args)`, `verificar(...args)` | `/api/servicos/docs/{pesquisar,verificar}` |
| `servicos.jogos` | `pesquisar(...args)`, `verificar(...args)` | `/api/servicos/jogos/{pesquisar,verificar}` |
| `servicos.streaming` | `pesquisar(...args)`, `verificar(...args)` | `/api/servicos/streaming/{pesquisar,verificar}` |
| `servicos.streaming.live` | `verificar(...args)` | `/api/servicos/streaming/live/verificar` |
| `sos` | `listarAlertas()` | `/api/sos/listar_alertas` |
| `tempo` | `verificar(...args)` | `/api/tempo/verificar` |

`...args` representa os parâmetros de consulta e as opções por chamada definidos pelo tipo de cada operação. O TypeScript exige os parâmetros obrigatórios e permite omitir os opcionais.

## Exemplos

```ts
await api.avisos.verificar();
await api.jornal.pesquisar({ q: "Macatuba" });
await api.mapa.pesquisar({ q: "praça" });
await api.servicos.streaming.live.verificar();
await api.sos.listarAlertas();
```

## Observação sobre a referência

O contrato OpenAPI é a fonte de verdade para nomes, tipos, parâmetros e respostas. Consulte [Contrato OpenAPI](/reference/openapi) para acessar o arquivo versionado. A tabela resume os métodos de alto nível disponibilizados pela SDK.
