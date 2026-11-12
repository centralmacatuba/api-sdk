import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  platform: "browser",
  target: "es2022",
  outDir: "dist-browser",
  clean: true,
  dts: false,
  sourcemap: false,
  treeshake: true,
});
