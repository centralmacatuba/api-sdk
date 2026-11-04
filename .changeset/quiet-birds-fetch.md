---
"@centralmacatuba/api": patch
---

Preserva a URL original da requisição nos erros de JSON inválido, inclusive quando uma implementação Fetch personalizada retorna uma resposta sem `Response.url`.
