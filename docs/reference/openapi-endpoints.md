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

Lista informações que correspondem ao parâmetro p e ao filtro solicitado; sem p, o filtro pode retornar todos os registros.

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

funcao=tudo lista os registros. funcao=uma exige id ou nome; se ambos faltarem, a implementação retorna um objeto de erro com HTTP 200.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `funcao` | Não | "tudo" / "uma" | — |
| `id` | Não | integer | — |
| `nome` | Não | string | — |

### Resposta de sucesso (HTTP 200)

funcao=tudo retorna uma lista; funcao=uma retorna um registro ou null, e parâmetros/função inválidos podem retornar objeto de erro com HTTP 200.

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

O parâmetro q não vazio é necessário para obter resultados; quando omitido ou vazio, a implementação atual retorna um objeto de erro com HTTP 200. O filtro aceita criador, titulo, subtitulo, conteudo; outros valores caem no comportamento de pesquisa em todos os campos.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `q` | Sim | string | Termo de pesquisa obrigatório e não vazio. |
| `filtro` | Não | "criador" / "titulo" / "subtitulo" / "conteudo" / "tudo" | — |

### Resposta de sucesso (HTTP 200)

Pesquisa. Com q não vazio, retorna o envelope de resultados; quando q está vazio ou ausente, o PHP retorna um objeto erro com HTTP 200.

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

funcao=uma consulta uma notícia e usa id como inteiro positivo; outros valores de funcao seguem o caminho de listagem de todas as notícias.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `funcao` | Não | "todas" / "uma" | — |
| `id` | Não | integer | — |

### Resposta de sucesso (HTTP 200)

funcao=todas lista notícias; funcao=uma com id positivo retorna uma notícia. O formato dos campos de notícia depende dos registros.

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

O parâmetro q não vazio é necessário para obter resultados; quando omitido ou vazio, a implementação atual retorna um objeto de erro com HTTP 200. O filtro aceita nome, tipo, criador e descricao; outros valores caem no comportamento de pesquisa em todos os campos.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `q` | Sim | string | Termo de pesquisa obrigatório e não vazio. |
| `filtro` | Não | "nome" / "tipo" / "criador" / "descricao" / "tudo" | — |

### Resposta de sucesso (HTTP 200)

Pesquisa. Com q não vazio, retorna o envelope de resultados; quando q está vazio ou ausente, o PHP retorna um objeto erro com HTTP 200.

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

Pesquisa páginas públicas.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `q` | Não | string | — |

### Resposta de sucesso (HTTP 200)

Pesquisa de páginas. Sem q, o PHP retorna status=false; com q, retorna total e resultados.

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

tipo é obrigatório. filtro aceita nome, descricao_curta, descricao_longa, tipo ou tudo; valores desconhecidos usam tudo.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `tipo` | Sim | "radio" / "tv" / "vod" / "camera" / "podcast" | — |
| `p` | Não | string | — |
| `filtro` | Não | "nome" / "descricao_curta" / "descricao_longa" / "tipo" / "categoria" / "qualidade" / "classificacao" / "tipo_stream" / "tudo" | — |

### Resposta de sucesso (HTTP 200)

Retorna os registros ativos que correspondem à busca. Os campos usados na pesquisa dependem do tipo de streaming e do filtro; filtro=tudo usa as colunas pesquisáveis existentes para aquele tipo.

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

tipo é obrigatório. funcao=uma com id consulta um item; nos demais casos a implementação lista os itens ativos.

### Parâmetros de consulta

| Parâmetro | Obrigatório | Tipo | Descrição |
|---|---:|---|---|
| `tipo` | Sim | "radio" / "tv" / "vod" / "camera" / "podcast" | — |
| `funcao` | Não | "tudo" / "uma" | — |
| `id` | Não | integer | — |

### Resposta de sucesso (HTTP 200)

Lista itens ativos ou consulta um item por ID. Tipos suportados: radio, tv, vod, camera e podcast.

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

