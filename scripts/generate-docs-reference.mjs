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
  if (operation.description) lines.push(operation.description, "");

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
  if (success?.description) lines.push("### Resposta de sucesso (HTTP 200)", "", success.description, "");

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
