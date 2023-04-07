import { defineConfig } from "tsup";

export default defineConfig({
  format: "cjs",
  entry: {
    cli: "src/cli.ts",
  },
});
