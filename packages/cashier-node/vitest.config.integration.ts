import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    name: 'cashier-node',
    include: ['src/**/*.test.ts'],
    setupFiles: ['./tests/setup.unit.ts'],
  },
})
