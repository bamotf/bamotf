import './scripts/load-env-vars'
import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    include: [
      'tests/**/*.test.ts',
      'server/**/*.test.ts',
      // If you want to test a route, you are probably looking for an integration test.
      '!server/**/*.routes.test.ts',
    ],
    setupFiles: ['./tests/setup.unit.ts'],
  },
})
