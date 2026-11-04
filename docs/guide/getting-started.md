# Primeiros passos

Depois de instalar o pacote, crie uma instância de `CentralMacatubaSDK`.

```js
import { CentralMacatubaSDK } from "@centralmacatuba/api";

const api = new CentralMacatubaSDK();
const resultado = await api.jornal.pesquisar({ q: "Macatuba" });

console.log(resultado);
```

A URL padrão é `https://publica.api.centralmacatuba.qzz.io`. Em uma aplicação TypeScript, os parâmetros e os retornos são inferidos a partir do contrato OpenAPI incluído na SDK.

## Consultar o estado da API

```js
const status = await api.health.verificar();
console.log(status);
```

## Consultar o calendário

```js
const calendario = await api.calendario.verificar({ data: "2026-11-04" });
console.log(calendario);
```

A data é opcional e deve usar o formato `AAAA-MM-DD`. Sem ela, o endpoint utiliza a data atual do servidor.

## Gerar um calendário

```js
const arquivo = await api.calendario.gerar({ ano: 2026, formato: "pdf" });

if (arquivo instanceof Blob) {
  const url = URL.createObjectURL(arquivo);
  // Use a URL em um link ou elemento de visualização.
  URL.revokeObjectURL(url);
}
```

A operação de geração também pode retornar JSON, conforme o formato solicitado e o contrato do endpoint.

## Próximos passos

- [Configurar o cliente](/guide/configuration)
- [Entender os namespaces](/reference/endpoints)
- [Tratar erros](/guide/errors)
