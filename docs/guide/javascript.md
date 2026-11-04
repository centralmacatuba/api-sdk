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

Valores de array são serializados como chaves repetidas na query string. Valores `null` e `undefined` são omitidos.

```js
await api.request("/api/exemplo", {
  filtro: ["um", "dois"],
});
```

Use somente endpoints existentes na allowlist pública. O exemplo de rota acima é ilustrativo; a SDK rejeita caminhos que não estejam autorizados.
