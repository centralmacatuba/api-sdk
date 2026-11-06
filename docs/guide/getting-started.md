# Primeiros passos

Depois de instalar o pacote, crie uma instância de `CentralMacatubaSDK`.

```js
import { CentralMacatubaSDK } from "@centralmacatuba/api";

const api = new CentralMacatubaSDK();
const resultado = await api.jornal.pesquisar({ q: "Macatuba" });

console.log(resultado);
```

A URL padrão é `https://publica.api.centralmacatuba.qzz.io`. Em uma aplicação TypeScript, os parâmetros e os retornos usam declarações geradas a partir do contrato OpenAPI versionado neste repositório. O arquivo `openapi/openapi.json` é mantido no repositório e não é incluído no pacote publicado.

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
  const link = document.createElement("a");
  link.href = url;
  link.download = "calendario.pdf";
  link.textContent = "Baixar calendário";
  document.body.append(link);

  // Mantenha a URL enquanto o link estiver disponível.
  link.addEventListener("click", () => {
    setTimeout(() => {
      URL.revokeObjectURL(url);
      link.remove();
    }, 60_000);
  }, { once: true });
}
```

A operação de geração também pode retornar JSON, conforme o formato solicitado e o contrato do endpoint.

## Próximos passos

- [Configurar o cliente](/guide/configuration)
- [Entender os namespaces](/reference/endpoints)
- [Tratar erros](/guide/errors)
