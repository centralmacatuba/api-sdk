#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TEMP_DIR"' EXIT

cd "$ROOT_DIR"
npm pack --ignore-scripts --pack-destination "$TEMP_DIR" >/dev/null
TARBALL="$(find "$TEMP_DIR" -maxdepth 1 -name '*.tgz' -print -quit)"

if [[ -z "$TARBALL" ]]; then
  echo "O tarball do SDK não foi gerado." >&2
  exit 1
fi

CONSUMER_DIR="$TEMP_DIR/consumer"
mkdir -p "$CONSUMER_DIR"
cd "$CONSUMER_DIR"
npm init -y >/dev/null
npm install --ignore-scripts --no-audit --no-fund "$TARBALL" >/dev/null

node --input-type=module <<'JS'
import { CentralMacatubaSDK, PUBLIC_ENDPOINTS } from "@centralmacatuba/api";

const client = new CentralMacatubaSDK();
if (typeof client.jornal.pesquisar !== "function" || !Object.isFrozen(PUBLIC_ENDPOINTS)) {
  throw new Error("A exportação ESM do SDK não corresponde à interface pública esperada.");
}
JS

node <<'JS'
const { CentralMacatubaSDK, PUBLIC_ENDPOINTS } = require("@centralmacatuba/api");

const client = new CentralMacatubaSDK();
if (typeof client.jornal.pesquisar !== "function" || !Object.isFrozen(PUBLIC_ENDPOINTS)) {
  throw new Error("A exportação CommonJS do SDK não corresponde à interface pública esperada.");
}
JS

cat > consumer.mts <<'TS'
import { CentralMacatubaSDK } from "@centralmacatuba/api";

const api = new CentralMacatubaSDK();
void api.jornal.pesquisar({ q: "Macatuba" });
TS

cat > consumer.cts <<'TS'
import { CentralMacatubaSDK } from "@centralmacatuba/api";

const api = new CentralMacatubaSDK();
void api.jornal.pesquisar({ q: "Macatuba" });
TS

for resolution in NodeNext Node16; do
  "$ROOT_DIR/node_modules/.bin/tsc" \
    --noEmit \
    --strict \
    --skipLibCheck \
    --target ES2022 \
    --lib ES2022,DOM \
    --module "$resolution" \
    --moduleResolution "$resolution" \
    consumer.mts consumer.cts
done

echo "Consumo ESM, CommonJS, NodeNext e Node16 validado."

# Browser-target ESM bundle smoke test.
BROWSER_DIR="$TEMP_DIR/browser"
mkdir -p "$BROWSER_DIR"
"$ROOT_DIR/node_modules/.bin/tsup" --config "$ROOT_DIR/tsup.browser.config.ts" --out-dir "$BROWSER_DIR"
printf '{"type":"module"}\n' > "$BROWSER_DIR/package.json"

node --input-type=module - "$BROWSER_DIR/index.js" <<'JS'
import { pathToFileURL } from "node:url";

globalThis.fetch = async () => new Response(
  JSON.stringify({ status: "ok", service: "Central Macatuba - API Pública", env: "browser-test" }),
  { headers: { "content-type": "application/json" } },
);

const { CentralMacatubaSDK } = await import(pathToFileURL(process.argv[2]).href);
const api = new CentralMacatubaSDK({ baseUrl: "https://example.test" });
const result = await api.health.verificar();

if (result.status !== "ok" || result.env !== "browser-test") {
  throw new Error("O bundle ESM direcionado a navegadores não conseguiu executar uma requisição Fetch.");
}
JS

echo "Bundle ESM direcionado a navegadores validado."
