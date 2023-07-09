import {defineConfig, type Options} from 'tsup'

export default defineConfig((options: Options) => ({
  treeshake: true,
  splitting: true,
  entry: ['src/index.ts', 'src/styles.tsx'],
  format: ['esm', 'cjs'],
  // dts: true,
  minify: true,
  clean: true,
  external: ['react'],
  sourcemap: 'inline',
  ...options,
}))
