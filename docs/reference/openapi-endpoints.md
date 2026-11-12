# Referência detalhada dos endpoints

Contrato OpenAPI versão **1.1.2**.

Servidor padrão: `https://publica.api.centralmacatuba.qzz.io`.

> Esta página é gerada automaticamente a partir de `openapi/openapi.json`. Ela documenta as operações GET disponibilizadas pela SDK; operações auxiliares do contrato que não fazem parte da allowlist não são expostas como métodos de recurso.

[Abrir o contrato OpenAPI completo](https://github.com/centralmacatuba/api-sdk/blob/principal/openapi/openapi.json).

## GET `/api/avisos/verificar`

**verificar**

Retorna os avisos ativos e dentro do prazo.

### Parâmetros de consulta

Esta operação não declara parâmetros de consulta.

### Resposta de sucesso (HTTP 200)

Retorna aviso quando há exatamente um aviso ativo; caso contrário, retorna a lista avisos. Falhas de consulta usam HTTP 500.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/calendario/verificar`

**verificar**

Consulta eventos do calendário.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `data` | Não | string (date) | Data do calendário no formato AAAA-MM-DD. Se omitida, o endpoint usa a data atual do servidor. |

### Resposta de sucesso (HTTP 200)

Retorna a data consultada, o dia da semana, se é fim de semana e os eventos ativos daquela data.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/calendario/gerar`

**gerar**

Gera o calendário anual em JSON, PDF ou PNG.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `ano` | Não | integer | Ano do calendário. Se omitido, usa o ano atual do servidor. |
| `formato` | Não | "json" / "pdf" / "png" | — |

### Resposta de sucesso (HTTP 200)

Com formato=json retorna ano e meses. Com formato=pdf ou png retorna arquivo binário no content-type correspondente; formatos não aceitos usam HTTP 400.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/dominios/verificar`

**verificar**

Consulta informações de domínio.

### Parâmetros de consulta

Esta operação não declara parâmetros de consulta.

### Resposta de sucesso (HTTP 200)

Retorna o momento da última atualização e a lista de sites/domínios monitorados.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/informacoes/pesquisar`

**pesquisar**

Pesquisa informações públicas.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `p` | Não | string | — |
| `filtro` | Não | "nome" / "tipo" / "bairro" / "zona" | — |

### Resposta de sucesso (HTTP 200)

Lista informações que correspondem ao parâmetro `p` e ao filtro solicitado. Sem `p`, o filtro pode retornar todos os registros. Os cabeçalhos `X-Page`, `X-Per-Page`, `X-Total-Count`, `X-Total-Pages`, `X-Has-Next-Page` e `X-Has-Previous-Page` informam a paginação.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/informacoes/verificar`

**verificar**

Consulta informações. Com `funcao=tudo`, retorna uma lista paginada; com `funcao=uma`, exige `id` ou `nome` e retorna um registro. Parâmetros inválidos retornam HTTP 400; registros inexistentes retornam HTTP 404.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `funcao` | Não | "tudo" / "uma" | — |
| `id` | Não | integer | — |
| `nome` | Não | string | — |

### Resposta de sucesso (HTTP 200)

Com `funcao=tudo`, retorna uma lista; com `funcao=uma`, retorna um registro ou `null`. Parâmetros ou valores de função inválidos podem resultar em um objeto de erro com HTTP 200. Nas listagens, os cabeçalhos `X-Page`, `X-Per-Page`, `X-Total-Count`, `X-Total-Pages`, `X-Has-Next-Page` e `X-Has-Previous-Page` informam a paginação.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/jornal/pesquisar`

**pesquisar**

Pesquisa notícias. O parâmetro `q` é obrigatório e não pode estar vazio. O parâmetro `filtro` aceita `criador`, `titulo`, `subtitulo`, `conteudo` ou `tudo`. Os parâmetros `page` e `limit` controlam a página atual.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `q` | Sim | string | Termo de pesquisa obrigatório e não vazio. |
| `filtro` | Não | "criador" / "titulo" / "subtitulo" / "conteudo" / "tudo" | — |

### Resposta de sucesso (HTTP 200)

Retorna o envelope de resultados da pesquisa. A ausência de `q` ou seu valor vazio resulta em HTTP 400. Os cabeçalhos de resposta informam a paginação.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/jornal/verificar`

**verificar**

Com `funcao=todas`, retorna notícias paginadas; com `funcao=uma` e `id` positivo, retorna uma notícia. Parâmetros inválidos retornam HTTP 400; notícias inexistentes retornam HTTP 404.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `funcao` | Não | "todas" / "uma" | — |
| `id` | Não | integer | — |

### Resposta de sucesso (HTTP 200)

Com `funcao=todas`, lista as notícias; com `funcao=uma` e `id` positivo, retorna uma notícia. O formato dos campos depende dos registros. Nas listagens, os cabeçalhos `X-Page`, `X-Per-Page`, `X-Total-Count`, `X-Total-Pages`, `X-Has-Next-Page` e `X-Has-Previous-Page` informam a paginação.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/links/pesquisar`

**pesquisar**

Pesquisa links públicos.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `termo` | Não | string | — |

### Resposta de sucesso (HTTP 200)

Lista links cujo nome ou URL corresponde ao termo informado; sem termo, retorna uma lista vazia.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/links/verificar`

**verificar**

Consulta links públicos. A função pendentes pode conter dados operacionais; seu acesso público deve ser revisado.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `funcao` | Não | "tudo" / "uma" / "pendentes" | Escolhe entre a lista de links ativos, um link por ID ou as solicitações pendentes. |
| `id` | Não | integer | ID obrigatório quando funcao=uma. |

### Resposta de sucesso (HTTP 200)

Retorna a lista de links, um link individual ou as solicitações pendentes, conforme o parâmetro funcao. Os registros incluem o campo status; o filtro de ativos não é aplicado por esta operação.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Parâmetros inválidos, como ID ausente quando funcao=uma. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Link solicitado não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno ao consultar links. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/mapa/pesquisar`

**pesquisar**

Pesquisa pontos do mapa por termo e campo ou consulta diretamente a área visível. Aceita uma bounding box opcional, com os quatro valores `min_lat`, `min_lng`, `max_lat` e `max_lng`, enviada por completo para limitar os resultados. Sem `q`, a bounding box é obrigatória. O zoom deve estar entre 0 e 22. Quando `limit` não é informado, o limite padrão da página varia conforme o zoom: 20 (zoom de 0 a 8), 50 (de 9 a 13) ou 100 (de 14 a 22).

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `q` | Sim | string | Termo de pesquisa obrigatório e não vazio. |
| `filtro` | Não | "nome" / "tipo" / "criador" / "descricao" / "tudo" | — |

### Resposta de sucesso (HTTP 200)

Retorna os pontos encontrados e o total de registros que correspondem à pesquisa e à bounding box, quando fornecida. Os cabeçalhos `X-Page`, `X-Per-Page`, `X-Total-Count`, `X-Total-Pages`, `X-Has-Next-Page` e `X-Has-Previous-Page` informam a paginação.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/mapa/verificar`

**verificar**

Consulta dados do mapa.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `tipo` | Não | string | — |
| `criador` | Não | string | — |
| `verificado` | Não | string | — |

### Resposta de sucesso (HTTP 200)

Retorna mapas quando tipo=mapas; nos demais casos retorna pontos filtrados, sempre no envelope status/cidade/total/dados.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/novidades/pesquisar`

**pesquisar**

Pesquisa novidades.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `q` | Não | string | Termo opcional de pesquisa. O endpoint aceita até 200 caracteres; valores maiores retornam HTTP 422. |

### Resposta de sucesso (HTTP 200)

Retorna uma lista de novidades que correspondem ao termo q; o PHP permite no máximo 200 caracteres.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 422 | O termo de pesquisa excede 200 caracteres. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/novidades/verificar`

**verificar**

Lista novidades ou consulta uma novidade por id.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `funcao` | Não | "tudo" / "uma" | — |
| `id` | Não | integer | — |

### Resposta de sucesso (HTTP 200)

funcao=tudo retorna uma lista; funcao=uma com id válido retorna um registro. Erros de parâmetro, ausência do registro e falhas internas usam códigos HTTP próprios.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/paginas/pesquisar`

**pesquisar**

Pesquisa páginas por título ou slug. O parâmetro `q` é obrigatório e não pode estar vazio. Os parâmetros `page` e `limit` controlam a paginação.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `q` | Não | string | — |

### Resposta de sucesso (HTTP 200)

Retorna o total de correspondências e os resultados da página solicitada. Os cabeçalhos de resposta também informam os detalhes da paginação.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/paginas/verificar`

**verificar**

Consulta uma página pública.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `id` | Não | integer | — |

### Resposta de sucesso (HTTP 200)

Consulta por id quando id é positivo; sem id válido, retorna o contexto de páginas resolvido para o host e caminho.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/redicionador/verificar`

**verificar**

Verifica se um slug de redirecionamento existe e se está autorizado para o domínio da requisição.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `url` | Sim | string | — |

### Resposta de sucesso (HTTP 200)

Verifica se o slug derivado de url existe e se o domínio do cliente está autorizado.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/servicos/verificar`

**verificar**

funcao aceita tudo (padrão), uma ou pesquisar. Para uma, informe id ou nome; para pesquisar, informe termo. A implementação retorna HTTP 400 se os parâmetros condicionais estiverem ausentes e HTTP 422 se termo exceder 200 caracteres.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `funcao` | Não | "tudo" / "uma" / "pesquisar" | — |
| `id` | Não | integer | — |
| `nome` | Não | string | — |
| `termo` | Não | string | — |

### Resposta de sucesso (HTTP 200)

Lista, consulta ou pesquisa serviços, conforme funcao. O formato de sucesso é uma lista para tudo/pesquisar e um objeto para uma.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 422 | O termo de pesquisa excede 200 caracteres quando funcao=pesquisar. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/servicos/cursos/pesquisar`

**cursos / pesquisar**

Pesquisa cursos.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `q` | Não | string | — |
| `categoria` | Não | string | — |
| `nivel` | Não | string | — |
| `campo` | Não | "titulo" / "descricao" / "conteudo" / "todos" | — |

### Resposta de sucesso (HTTP 200)

Retorna cursos públicos filtrados, no envelope status/total/itens.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/servicos/cursos/verificar`

**cursos / verificar**

Consulta cursos.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `categoria` | Não | string | — |
| `slug` | Não | string | — |

### Resposta de sucesso (HTTP 200)

Retorna cursos públicos filtrados por categoria e slug, no envelope status/total/itens.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/servicos/docs/pesquisar`

**docs / pesquisar**

Pesquisa documentos.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `categoria` | Não | string | — |
| `q` | Não | string | — |
| `campo` | Não | "nome" / "descricao" / "conteudo" / "data_criacao" / "data_atualizacao" / "todos" | — |

### Resposta de sucesso (HTTP 200)

Retorna documentos públicos filtrados, no envelope status/total/itens.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/servicos/docs/verificar`

**docs / verificar**

Consulta documento por slug.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `slug` | Sim | string | — |

### Resposta de sucesso (HTTP 200)

Retorna o documento público correspondente ao slug.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/servicos/jogos/pesquisar`

**jogos / pesquisar**

Pesquisa jogos.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `q` | Não | string | — |
| `campo` | Não | "tudo" / "titulo" / "slug" / "descricao_curta" / "descricao_longa" | — |

### Resposta de sucesso (HTTP 200)

Retorna jogos correspondentes aos filtros de pesquisa.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/servicos/jogos/verificar`

**jogos / verificar**

Consulta jogo por id, nome ou slug.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `id` | Não | integer | — |
| `nome` | Não | string | — |
| `slug` | Não | string | — |

### Resposta de sucesso (HTTP 200)

Consulta um jogo por id, nome ou slug; sem identificador, retorna HTTP 400, e jogo inexistente retorna HTTP 404.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/servicos/streaming/pesquisar`

**streaming / pesquisar**

O parâmetro `tipo` é obrigatório. O parâmetro `filtro` seleciona um campo de pesquisa conforme o tipo: `radio` e `podcast` aceitam `nome`, `descricao_curta`, `descricao_longa` e `tipo`; `tv` aceita `nome`, `descricao_curta`, `descricao_longa`, `categoria` e `qualidade`; `vod` aceita `nome`, `descricao_curta`, `descricao_longa`, `categoria` e `classificacao`; `camera` aceita `nome`, `descricao_longa` e `tipo_stream`. O valor `filtro=tudo` (padrão) ou um filtro não disponível para o tipo informado faz a pesquisa em todos os campos daquele tipo.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `tipo` | Sim | "radio" / "tv" / "vod" / "camera" / "podcast" | — |
| `p` | Não | string | — |
| `filtro` | Não | "nome" / "descricao_curta" / "descricao_longa" / "tipo" / "categoria" / "qualidade" / "classificacao" / "tipo_stream" / "tudo" | — |

### Resposta de sucesso (HTTP 200)

Retorna os registros ativos que correspondem à busca. Os campos pesquisados dependem do tipo de streaming e do filtro. Com `filtro=tudo`, são usadas as colunas pesquisáveis existentes para aquele tipo. Os cabeçalhos `X-Page`, `X-Per-Page`, `X-Total-Count`, `X-Total-Pages`, `X-Has-Next-Page` e `X-Has-Previous-Page` informam a paginação.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Tipo de streaming inválido. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno ao pesquisar o catálogo de streaming. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/servicos/streaming/verificar`

**streaming / verificar**

Lista itens ativos paginados ou consulta um item por ID. Os tipos suportados são `radio`, `tv`, `vod`, `camera` e `podcast`.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `tipo` | Sim | "radio" / "tv" / "vod" / "camera" / "podcast" | — |
| `funcao` | Não | "tudo" / "uma" | — |
| `id` | Não | integer | — |

### Resposta de sucesso (HTTP 200)

Lista itens ativos ou consulta um item por ID. Os tipos suportados são `radio`, `tv`, `vod`, `camera` e `podcast`. Nas listagens, os cabeçalhos `X-Page`, `X-Per-Page`, `X-Total-Count`, `X-Total-Pages`, `X-Has-Next-Page` e `X-Has-Previous-Page` informam a paginação.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Tipo, função ou ID inválido. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Item ativo não encontrado para funcao=uma. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno ao consultar o catálogo de streaming. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/servicos/streaming/live/verificar`

**streaming / live / verificar**

Consulta informações do streaming ao vivo.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `funcao` | Não | string | — |

### Resposta de sucesso (HTTP 200)

Retorna transmissões ao vivo e transmissões agendadas consultadas no YouTube.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/sos/listar_alertas`

**listar_alertas**

Lista alertas SOS.

### Parâmetros de consulta

Esta operação não declara parâmetros de consulta.

### Resposta de sucesso (HTTP 200)

Lista alertas SOS e informa se o cookie de permissão de notificação está marcado como granted.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/api/tempo/verificar`

**verificar**

Consulta dados meteorológicos.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `source` | Não | string | Filtra os registros pela origem (source) armazenada no banco. |
| `start` | Não | string | Limite inferior opcional para timestamp, inclusivo. Use o formato armazenado pelo serviço, normalmente AAAA-MM-DD HH:MM:SS. |
| `end` | Não | string | Limite superior opcional para timestamp, inclusivo. Use o formato armazenado pelo serviço, normalmente AAAA-MM-DD HH:MM:SS. |

### Resposta de sucesso (HTTP 200)

Consulta dados meteorológicos. Falhas de banco são respondidas com HTTP 500.

### Respostas adicionais

| HTTP | Descrição |
|---:|---|
| 400 | Caminho inválido detectado pelo gateway ou parâmetro inválido conforme a validação específica do endpoint. |
| 403 | Domínio ou acesso não autorizado pelo gateway. |
| 404 | Rota ou recurso não encontrado. |
| 405 | Método não permitido para a operação de consulta. O endpoint aceita GET; o gateway trata HEAD separadamente, sem encaminhar a consulta. |
| 500 | Erro interno no endpoint PHP ou no serviço de dados. |
| 502 | Falha do gateway ao encaminhar a requisição ao serviço privado. |

## GET `/`

**Health check**

Verifica se o gateway da API pública está respondendo. Esta rota é servida diretamente pelo gateway e não encaminha a requisição ao endpoint privado.

### Parâmetros de consulta

Esta operação não declara parâmetros de consulta.

### Resposta de sucesso (HTTP 200)

Gateway disponível.

