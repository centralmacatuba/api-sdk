# Autorização SOS

O endpoint SOS recebe a preferência de notificação pelo cabeçalho `X-CM-SOS-PERMISSION`; a autorização não é enviada por cookie.

Envie exatamente `granted` quando o usuário tiver autorizado as notificações. Se o cabeçalho estiver ausente ou contiver outro valor, a API considera `notificacaoAceita` como `false`.

```ts
import { CentralMacatubaSDK } from "@centralmacatuba/api";

const api = new CentralMacatubaSDK();

const alertas = await api.sos.listarAlertas(
  undefined,
  {
    headers: {
      "X-CM-SOS-PERMISSION": "granted",
    },
  },
);
```

Também é possível configurar o cabeçalho nas opções padrão do cliente:

```ts
const api = new CentralMacatubaSDK({
  headers: { "X-CM-SOS-PERMISSION": "granted" },
});
```

A aplicação deve enviar `granted` somente depois de obter a autorização explícita do usuário. A SDK apenas encaminha o cabeçalho fornecido; ela não solicita, armazena nem presume consentimento.

## Navegadores e CORS

Se a aplicação e a API estiverem em origens diferentes, o servidor precisa permitir o cabeçalho `X-CM-SOS-PERMISSION` na configuração de CORS (por exemplo, em `Access-Control-Allow-Headers`). Não é necessário habilitar `credentials: "include"` para esse mecanismo de autorização, pois ele não depende de cookie.

## Node.js

A Fetch API do Node.js aceita o cabeçalho normalmente. Não é necessário manter um cookie jar ou uma sessão entre chamadas para enviar a preferência SOS.
