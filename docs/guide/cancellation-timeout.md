# Cancelamento e timeout

Cada chamada aceita `signal` e `timeoutMs` em suas opções.

## Cancelar com AbortController

```ts
const controller = new AbortController();

const requisicao = api.jornal.pesquisar(
  { q: "Macatuba" },
  { signal: controller.signal },
);

// Cancele quando a aplicação não precisar mais do resultado.
controller.abort();

try {
  await requisicao;
} catch (error) {
  console.error("A requisição foi interrompida.", error);
}
```

## Timeout global e por chamada

```ts
const api = new CentralMacatubaSDK({ timeoutMs: 10_000 });

// Esta chamada usa um timeout de 3 segundos.
await api.tempo.verificar(undefined, { timeoutMs: 3_000 });
```

O timeout por chamada substitui o padrão do cliente. Use `timeoutMs: 0` para desativar o temporizador naquela chamada.

O valor deve ser finito e estar entre zero e `2_147_483_647` milissegundos. O timeout aborta a operação Fetch; o tempo gasto pelo código da aplicação após a resposta não faz parte desse limite.
