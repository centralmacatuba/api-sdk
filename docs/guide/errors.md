# Erros e respostas

Falhas tratadas pela SDK são representadas por `CentralMacatubaError`.

```ts
import { CentralMacatubaError } from "@centralmacatuba/api";

try {
  await api.tempo.verificar();
} catch (error) {
  if (error instanceof CentralMacatubaError) {
    console.error({
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      response: error.response,
      headers: error.headers,
      cause: error.cause,
    });
  } else {
    throw error;
  }
}
```

## Propriedades

| Propriedade | Descrição |
|---|---|
| `message` | Mensagem de erro. |
| `status` | Status HTTP, quando disponível. |
| `statusText` | Texto do status HTTP, quando disponível. |
| `url` | URL associada à requisição. |
| `response` | Corpo recebido ou informação adicional da falha. |
| `headers` | Cabeçalhos da resposta, quando disponíveis. |
| `cause` | Causa original, quando fornecida. |

## Situações que podem gerar erro

- Endpoint fora da allowlist.
- URL base inválida ou timeout fora do intervalo aceito.
- Falha HTTP retornada pela API.
- JSON malformado.
- Resposta vazia incompatível com o contrato do endpoint.
- Tipo de resposta binária incompatível com o endpoint.
- Falha de rede, leitura do corpo, timeout ou cancelamento.

Erros de configuração de cabeçalhos também podem ser lançados pela plataforma como `TypeError`. Nem toda exceção externa é convertida em `CentralMacatubaError`.
