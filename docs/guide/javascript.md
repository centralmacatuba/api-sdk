# JavaScript

A SDK pode ser utilizada diretamente em projetos JavaScript com ESM ou CommonJS.

## ESM

```js
import { CentralMacatubaSDK, CentralMacatubaError } from "@centralmacatuba/api";

const api = new CentralMacatubaSDK();

try {
  const resultado = await api.tempo.verificar();
  console.log(resultado);
} catch (error) {
  if (error instanceof CentralMacatubaError) {
    console.error(error.status, error.message, error.url);
  } else {
    throw error;
  }
}
```

## CommonJS

```js
const {
  CentralMacatubaSDK,
  CentralMacatubaError,
} = require("@centralmacatuba/api");

const api = new CentralMacatubaSDK();

api.avisos.verificar()
  .then(console.log)
  .catch((error) => {
    if (error instanceof CentralMacatubaError) {
      console.error(error.status, error.message);
      return;
    }
    throw error;
  });
```

## Arrays em parâmetros de consulta

Quando uma operação aceita um valor de array, cada item é serializado como uma ocorrência repetida da mesma chave na query string. Valores `null` e `undefined` são omitidos.

O contrato OpenAPI atual não declara parâmetros de consulta do tipo array nos endpoints públicos. Portanto, não há uma chamada real da API para demonstrar esse caso. A serialização será aplicada automaticamente caso um endpoint público passe a declarar esse tipo de parâmetro.
