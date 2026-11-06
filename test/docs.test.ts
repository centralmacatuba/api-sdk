import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, relative, resolve, sep } from "node:path";
import ts from "typescript";
import { beforeAll, describe, expect, it } from "vitest";

const root = process.cwd();
const docsRoot = resolve(root, "docs");
const generatedReference = resolve(docsRoot, "reference/openapi-endpoints.md");
const generator = resolve(root, "scripts/generate-docs-reference.mjs");

function markdownFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.isFile() && extname(entry.name) === ".md" ? [path] : [];
  });
}

function collectStringProperties(source: string, propertyName: string): string[] {
  const file = ts.createSourceFile(
    "config.mts",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const values: string[] = [];

  function visit(node: ts.Node): void {
    if (
      ts.isPropertyAssignment(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === propertyName &&
      ts.isStringLiteral(node.initializer)
    ) {
      values.push(node.initializer.text);
    }
    ts.forEachChild(node, visit);
  }

  visit(file);
  return values;
}

function routeToMarkdownPath(route: string): string {
  const pathname = route.split(/[?#]/, 1)[0].replace(/^\/+/, "");
  if (!pathname) return "index.md";
  if (pathname.endsWith("/")) return `${pathname}index.md`;
  return pathname.endsWith(".md") ? pathname : `${pathname}.md`;
}

function markdownLinks(source: string): string[] {
  const withoutCode = source.replace(/^\`\`\`[\s\S]*?^\`\`\`\s*$/gm, "");
  const withoutInlineCode = withoutCode.replace(/\`[^\`]*\`/g, "");
  const links: string[] = [];
  const pattern = /!?\[[^\]]*\]\(([^)]+)\)/g;

  for (const match of withoutInlineCode.matchAll(pattern)) {
    const destination = match[1].trim().match(/^<([^>]+)>|^([^\s]+)/);
    if (destination) links.push(destination[1] ?? destination[2]);
  }

  return links;
}

function resolveLocalLink(sourceFile: string, destination: string): string | null {
  if (/^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(destination) || destination.startsWith("//")) {
    return null;
  }

  const pathname = decodeURIComponent(destination.split(/[?#]/, 1)[0]);
  if (!pathname) return null;

  const isAbsolute = pathname.startsWith("/");
  const normalized = pathname.replace(/^\/+/, "");
  const base = isAbsolute ? docsRoot : dirname(sourceFile);

  if (!extname(normalized) || normalized.endsWith("/")) {
    const page = normalized.endsWith("/")
      ? `${normalized}index.md`
      : normalized.endsWith(".md")
        ? normalized
        : `${normalized}.md`;
    return resolve(base, page);
  }

  // VitePress serves docs/public files from the site root.
  return resolve(isAbsolute ? resolve(docsRoot, "public") : dirname(sourceFile), normalized);
}

function codeBlocks(source: string): Array<{ language: string; code: string }> {
  const blocks: Array<{ language: string; code: string }> = [];
  const pattern = /^\`\`\`([a-z0-9_-]+)[^\n]*\r?\n([\s\S]*?)^\`\`\`\s*$/gim;

  for (const match of source.matchAll(pattern)) {
    blocks.push({ language: match[1].toLowerCase(), code: match[2] });
  }

  return blocks;
}

beforeAll(() => {
  // Capture the committed reference before generation can overwrite it.
  const committedReference = readFileSync(generatedReference, "utf8");
  execFileSync(process.execPath, [generator], { cwd: root, stdio: "pipe" });
  const generated = readFileSync(generatedReference, "utf8");

  expect(generated).toBe(committedReference);
});

describe("documentation", () => {
  it("includes every Markdown page in the VitePress navigation", () => {
    const config = readFileSync(resolve(docsRoot, ".vitepress/config.mts"), "utf8");
    const configuredLinks = collectStringProperties(config, "link")
      .filter((link) => !/^(?:https?:|mailto:)/i.test(link))
      .map(routeToMarkdownPath);
    const configured = new Set(configuredLinks);
    const pages = markdownFiles(docsRoot).map((path) =>
      relative(docsRoot, path).split(sep).join("/"),
    );

    expect(pages.length).toBeGreaterThan(0);
    for (const page of pages) {
      expect(configured.has(page), `Página sem entrada na navegação: ${page}`).toBe(true);
    }
  });

  it("keeps every local Markdown link and local asset resolvable", () => {
    const pages = markdownFiles(docsRoot);
    const broken: string[] = [];

    for (const page of pages) {
      const source = readFileSync(page, "utf8");
      for (const destination of markdownLinks(source)) {
        const target = resolveLocalLink(page, destination);
        if (!target) continue;

        const relativeTarget = relative(docsRoot, target);
        if (relativeTarget.startsWith(`..${sep}`) || relativeTarget === ".." || !existsSync(target)) {
          broken.push(`${relative(docsRoot, page)} -> ${destination}`);
        }
      }
    }

    expect(broken).toEqual([]);
  });

  it("keeps the VitePress custom stylesheet and Pages domain files present", () => {
    const config = readFileSync(resolve(docsRoot, ".vitepress/config.mts"), "utf8");
    const stylesheets = collectStringProperties(config, "href").filter((href) => href.startsWith("/"));
    for (const stylesheet of stylesheets) {
      expect(existsSync(resolve(docsRoot, "public", stylesheet.slice(1)))).toBe(true);
    }

    expect(readFileSync(resolve(docsRoot, "public/CNAME"), "utf8").trim()).toBe(
      "sdk.centralmacatuba.qzz.io",
    );
    expect(existsSync(resolve(docsRoot, "public/.nojekyll"))).toBe(true);
  });

  it("generates one detailed reference entry for every GET operation in OpenAPI", () => {
    const contract = JSON.parse(readFileSync(resolve(root, "openapi/openapi.json"), "utf8"));
    const generated = readFileSync(generatedReference, "utf8");
    const expectedRoutes = Object.entries(contract.paths ?? {})
      .filter(([, pathItem]) => Boolean((pathItem as { get?: unknown }).get))
      .map(([route]) => route);
    const generatedRoutes = Array.from(
      generated.matchAll(/^## GET \`([^\`]+)\`$/gm),
      (match) => match[1],
    );

    expect(generated).toContain(`Contrato OpenAPI versão **${contract.info.version}**.`);
    expect(generatedRoutes).toEqual(expectedRoutes);
  });

  it("keeps the generated OpenAPI reference deterministic", () => {
    const before = readFileSync(generatedReference, "utf8");
    execFileSync(process.execPath, [generator], { cwd: root, stdio: "pipe" });
    const after = readFileSync(generatedReference, "utf8");

    expect(after).toBe(before);
  });

  it("contains labeled JavaScript and TypeScript examples with valid syntax", () => {
    const pages = markdownFiles(docsRoot);
    const blocks = pages.flatMap((page) =>
      codeBlocks(readFileSync(page, "utf8")).map((block) => ({ ...block, page })),
    );
    const languages = new Set(blocks.map((block) => block.language));

    expect(languages.has("js")).toBe(true);
    expect(languages.has("ts")).toBe(true);
    expect(blocks.length).toBeGreaterThan(0);

    for (const [index, block] of blocks.entries()) {
      expect(["js", "ts", "bash", "ini"]).toContain(block.language);
      if (block.language === "bash" || block.language === "ini") continue;

      const result = ts.transpileModule(block.code, {
        fileName: `documentation-example-${index}.${block.language}`,
        reportDiagnostics: true,
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
        },
      });
      const errors = (result.diagnostics ?? [])
        .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error)
        .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));

      expect(errors, `Exemplo inválido em ${relative(docsRoot, block.page)}`).toEqual([]);
      expect(result.outputText.trim().length).toBeGreaterThan(0);
    }
  });
});
