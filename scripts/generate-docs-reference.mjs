import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const contractPath = resolve(root, "openapi/openapi.json");
const outputPath = resolve(root, "docs/reference/openapi-endpoints.md");
const contract = JSON.parse(await readFile(contractPath, "utf8"));

/** Escapes table delimiters and flattens newlines, using an em dash for nullish values. */
function escapeCell(value) {
  return String(value ?? "—").replaceAll("|", "\\|").replaceAll("\n", " ");
}

/**
 * Returns a display label for an OpenAPI schema, recursively describing arrays
 * and unions. References use their final path segment without being resolved;
 * unrecognized schemas use the generic OpenAPI label.
 */
function schemaType(schema = {}) {
  if (schema.$ref) return schema.$ref.split("/").at(-1);
  if (schema.enum) return schema.enum.map((value) => JSON.stringify(value)).join(" / ");
  if (schema.type === "array") return `array<${schemaType(schema.items)}>`;
  if (schema.type === "integer") return schema.format ? `integer (${schema.format})` : "integer";
  if (schema.type) return schema.format ? `${schema.type} (${schema.format})` : schema.type;
  if (schema.oneOf) return schema.oneOf.map(schemaType).join(" | ");
  if (schema.anyOf) return schema.anyOf.map(schemaType).join(" | ");
  return "conforme schema OpenAPI";
}

const descriptionRewrites = new Map([
  [
    "Lista informações que correspondem ao parâmetro p e ao filtro solicitado; sem p, o filtro pode retornar todos os registros.",
    "Lista as informações que correspondem ao parâmetro `p` e ao filtro solicitado. Sem `p`, o filtro pode retornar todos os registros.",
  ],
  [
    "funcao=tudo lista os registros. funcao=uma exige id ou nome; se ambos faltarem, a implementação retorna um objeto de erro com HTTP 200.",
    "Com `funcao=tudo`, lista os registros. Com `funcao=uma`, exige `id` ou `nome`; se ambos estiverem ausentes, a implementação retorna um objeto de erro com HTTP 200.",
  ],
  [
    "funcao=tudo retorna uma lista; funcao=uma retorna um registro ou null, e parâmetros/função inválidos podem retornar objeto de erro com HTTP 200.",
    "Com `funcao=tudo`, retorna uma lista; com `funcao=uma`, retorna um registro ou `null`. Parâmetros ou valores de função inválidos podem resultar em um objeto de erro com HTTP 200.",
  ],
  [
    "O parâmetro q não vazio é necessário para obter resultados; quando omitido ou vazio, a implementação atual retorna um objeto de erro com HTTP 200. O filtro aceita criador, titulo, subtitulo, conteudo; outros valores caem no comportamento de pesquisa em todos os campos.",
    "O parâmetro `q` deve conter um valor não vazio para obter resultados. Quando omitido ou vazio, a implementação atual retorna um objeto de erro com HTTP 200. O filtro aceita `criador`, `titulo`, `subtitulo` e `conteudo`; outros valores acionam a pesquisa em todos os campos.",
  ],
  [
    "Pesquisa. Com q não vazio, retorna o envelope de resultados; quando q está vazio ou ausente, o PHP retorna um objeto erro com HTTP 200.",
    "Com `q` não vazio, retorna o envelope de resultados. Quando `q` está vazio ou ausente, o PHP retorna um objeto de erro com HTTP 200.",
  ],
  [
    "funcao=uma consulta uma notícia e usa id como inteiro positivo; outros valores de funcao seguem o caminho de listagem de todas as notícias.",
    "Com `funcao=uma`, consulta uma notícia e usa `id` como inteiro positivo. Outros valores de `funcao` seguem o caminho de listagem de todas as notícias.",
  ],
  [
    "funcao=todas lista notícias; funcao=uma com id positivo retorna uma notícia. O formato dos campos de notícia depende dos registros.",
    "Com `funcao=todas`, lista as notícias; com `funcao=uma` e `id` positivo, retorna uma notícia. O formato dos campos depende dos registros.",
  ],
  [
    "O parâmetro q não vazio é necessário para obter resultados; quando omitido ou vazio, a implementação atual retorna um objeto de erro com HTTP 200. O filtro aceita nome, tipo, criador e descricao; outros valores caem no comportamento de pesquisa em todos os campos.",
    "O parâmetro `q` deve conter um valor não vazio para obter resultados. Quando omitido ou vazio, a implementação atual retorna um objeto de erro com HTTP 200. O filtro aceita `nome`, `tipo`, `criador` e `descricao`; outros valores acionam a pesquisa em todos os campos.",
  ],
  [
    "Pesquisa de páginas. Sem q, o PHP retorna status=false; com q, retorna total e resultados.",
    "Pesquisa páginas. Sem o parâmetro `q`, o PHP retorna `status=false`; com `q`, retorna o total e os resultados.",
  ],
  [
    "tipo é obrigatório. filtro seleciona um campo de pesquisa conforme o tipo: radio e podcast aceitam nome, descricao_curta, descricao_longa e tipo; tv aceita nome, descricao_curta, descricao_longa, categoria e qualidade; vod aceita nome, descricao_curta, descricao_longa, categoria e classificacao; camera aceita nome, descricao_longa e tipo_stream. filtro=tudo (padrão) ou um valor não disponível para o tipo informado pesquisa em todos os campos daquele tipo.",
    "O parâmetro `tipo` é obrigatório. O parâmetro `filtro` seleciona um campo de pesquisa conforme o tipo: `radio` e `podcast` aceitam `nome`, `descricao_curta`, `descricao_longa` e `tipo`; `tv` aceita `nome`, `descricao_curta`, `descricao_longa`, `categoria` e `qualidade`; `vod` aceita `nome`, `descricao_curta`, `descricao_longa`, `categoria` e `classificacao`; `camera` aceita `nome`, `descricao_longa` e `tipo_stream`. O valor `filtro=tudo` (padrão) ou um filtro não disponível para o tipo informado faz a pesquisa em todos os campos daquele tipo.",
  ],
  [
    "Retorna os registros ativos que correspondem à busca. Os campos usados na pesquisa dependem do tipo de streaming e do filtro; filtro=tudo usa as colunas pesquisáveis existentes para aquele tipo.",
    "Retorna os registros ativos que correspondem à busca. Os campos pesquisados dependem do tipo de streaming e do filtro. Com `filtro=tudo`, são usadas as colunas pesquisáveis existentes para aquele tipo.",
  ],
  [
    "tipo é obrigatório. funcao=uma com id consulta um item; nos demais casos a implementação lista os itens ativos.",
    "O parâmetro `tipo` é obrigatório. Com `funcao=uma` e `id`, consulta um item; nos demais casos, a implementação lista os itens ativos.",
  ],
]);

function formatDescription(description) {
  return descriptionRewrites.get(description) ?? description;
}

const lines = [
  "# Referência detalhada dos endpoints",
  "",
  `Contrato OpenAPI versão **${contract.info.version}**.`,
  "",
  `Servidor padrão: \`${contract.servers?.[0]?.url ?? "não definido"}\`.`,
  "",
  "> Esta página é gerada automaticamente a partir de `openapi/openapi.json`. Ela documenta as operações GET disponibilizadas pela SDK; operações auxiliares do contrato que não fazem parte da allowlist não são expostas como métodos de recurso.",
  "",
  "[Abrir o contrato OpenAPI completo](https://github.com/centralmacatuba/api-sdk/blob/principal/openapi/openapi.json).",
  "",
];

for (const [route, pathItem] of Object.entries(contract.paths ?? {})) {
  const operation = pathItem.get;
  if (!operation) continue;

  lines.push(`## GET \`${route}\``, "");
  if (operation.summary) lines.push(`**${operation.summary}**`, "");
  if (operation.description) lines.push(formatDescription(operation.description), "");

  const parameters = (operation.parameters ?? []).filter((parameter) => parameter.in === "query");
  lines.push("### Parâmetros de consulta", "");
  if (parameters.length === 0) {
    lines.push("Esta operação não declara parâmetros de consulta.", "");
  } else {
    lines.push("| Parâmetro | Obrigatório | Tipo | Descrição |", "|---|---:|---|---|");
    for (const parameter of parameters) {
      lines.push(
        `| \`${escapeCell(parameter.name)}\` | ${parameter.required ? "Sim" : "Não"} | ${escapeCell(schemaType(parameter.schema))} | ${escapeCell(parameter.description ?? parameter.schema?.description)} |`,
      );
    }
    lines.push("");
  }

  const success = operation.responses?.["200"];
  if (success?.description) lines.push("### Resposta de sucesso (HTTP 200)", "", formatDescription(success.description), "");

  const errors = Object.entries(operation.responses ?? {}).filter(([status]) =>
    status !== "200" && status !== "default" && !status.startsWith("2"),
  );
  if (errors.length) {
    lines.push("### Respostas adicionais", "", "| HTTP | Descrição |", "|---:|---|");
    for (const [status, response] of errors) {
      lines.push(`| ${escapeCell(status)} | ${escapeCell(response.description)} |`);
    }
    lines.push("");
  }
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Referência gerada em ${outputPath}`);
