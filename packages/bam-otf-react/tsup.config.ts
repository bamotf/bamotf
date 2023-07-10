import {defineConfig, type Options} from 'tsup'

export default defineConfig((options: Options) => ({
  treeshake: true,
  splitting: true,
  entry: [
    'src/index.ts',
    'src/styles.css',
    'src/base.css',
    'src/components.css',
  ],
  format: ['esm', 'cjs'],
  minify: true,
  clean: true,
  external: ['react'],
  sourcemap: 'inline',
  ...options,
}))
