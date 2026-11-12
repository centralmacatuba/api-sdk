---
"@centralmacatuba/api": minor
---

Publica a primeira versão do SDK JavaScript e TypeScript para a API pública da Central Macatuba. Inclui cliente HTTP baseado em Fetch, recursos organizados por namespaces, allowlist de endpoints, tipos gerados a partir do contrato OpenAPI, suporte a ESM e CommonJS e compatibilidade de runtime com Node.js 18 ou superior.

Atualiza o SDK para acompanhar o contrato OpenAPI público versão 1.1.2: adiciona o recurso de pesquisa geral de serviços, incorpora os parâmetros de paginação e sincroniza os tipos TypeScript e a referência de endpoints. Atualiza também a integração SOS para utilizar o cabeçalho `X-CM-SOS-PERMISSION`, em vez do antigo cookie de autorização, e documenta o comportamento correspondente.

Adiciona `requestWithMetadata()` para disponibilizar, além dos dados da resposta, o status HTTP, a URL e os cabeçalhos — incluindo os metadados de paginação — sem alterar o retorno de `request()`. Mantém opções de timeout, cancelamento, headers e credentials, tratamento contextual de erros e suporte a respostas JSON e binárias.

Inclui testes unitários, de integração, de tipos e de documentação, além dos fluxos de CI para Node.js 18, 20, 22 e 24, geração e verificação dos artefatos derivados do OpenAPI, sincronização do lockfile e preparação de releases com Changesets e Trusted Publishing.
