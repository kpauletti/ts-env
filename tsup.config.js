import { defineConfig } from "tsup";

export default defineConfig((opts) => ({
  entryPoints: ["index.ts"],
  splitting: true,
  format: ["esm", "cjs"],
  dts: true,
  clean: !opts.watch,
  sourcemap: true,
  outDir: "dist",
  target: "es2020",
}));