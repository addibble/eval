import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./webworker/entrypoint.ts"],
  format: ["esm"],
  platform: "browser",
  // sourcemap: "inline",
  outDir: "dist/webworker",
  splitting: false,
  minify: false,
  // The worker runs in a browser with no node_modules, so anything inlined here
  // must bring its own dependencies with it. circuit-json imports
  // format-si-unit, so inlining circuit-json alone left 24 bare
  // `from "format-si-unit"` specifiers in the bundle and the worker died on
  // load with `Module name, 'format-si-unit' does not resolve to a valid URL`
  // -- which surfaces as every view rendering nothing, since no circuit is ever
  // produced.
  noExternal: [
    "@tscircuit/core",
    "@tscircuit/jscad-assembly-hardware",
    "@tscircuit/modelprinter",
    "jscad-planner",
    "gl-matrix",
    "circuit-json",
    "format-si-unit",
    "@tscircuit/parts-engine",
    "@tscircuit/fabricator-drc",
    "sucrase",
    "@tscircuit/math-utils",
    "@tscircuit/mm",
    "zod",
  ],
  clean: true,
  dts: true,
  esbuildOptions(options) {
    options.loader = {
      ...options.loader,
      ".wasm": "dataurl",
    }
    options.minifySyntax = true
    options.minifyWhitespace = true
    options.minifyIdentifiers = false
  },
})
