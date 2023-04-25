import './scripts/load-env-vars'
import {defineProject} from 'vitest/config'

export default defineProject({
  test: {
    name: 'cashier-server:unit',
    include: [
      'tests/**/*.test.ts',
      'server/**/*.test.ts',
      // If you want to test a route, you are probably looking for an integration test.
      '!server/**/*.routes.test.ts',
    ],
    setupFiles: ['./tests/setup.unit.ts'],
  },
})
