# Cookies e SOS

O endpoint SOS utiliza o cookie `centralmacatuba_sos-permissao` quando aplicável. A SDK não tenta ler, criar ou modificar esse cookie: em navegadores, deixa a Fetch API gerenciar os cookies.

## Requisições entre origens

Se a aplicação e a API estiverem em origens diferentes e a chamada precisar enviar o cookie, configure credenciais:

```ts
const api = new CentralMacatubaSDK({ credentials: "include" });
const alertas = await api.sos.listarAlertas();
```

Também é possível configurar `credentials: "include"` somente na chamada.

O envio depende da configuração do servidor e das políticas do navegador. Para chamadas cross-origin com credenciais, o gateway precisa responder com uma origem explícita em CORS e `Access-Control-Allow-Credentials: true`. O cookie precisa ter atributos compatíveis com o contexto, incluindo `SameSite=None; Secure` quando a chamada for realmente cross-site.

A SDK não consegue contornar bloqueios de CORS, políticas de cookies ou ausência de encaminhamento do cookie no gateway.

## Node.js

A Fetch API do Node.js não mantém automaticamente um cookie jar entre chamadas. Para sessões persistentes, forneça uma implementação `fetch` que gerencie cookies de acordo com as necessidades do ambiente.
