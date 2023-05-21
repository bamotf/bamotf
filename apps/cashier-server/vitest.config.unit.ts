import './scripts/load-env-vars'
import {defineProject} from 'vitest/config'

process.env.LOG_LEVEL = 'error'

export default defineProject({
  test: {
    include: [
      'tests/**/*.test.ts',
      'api/**/*.test.ts',
      // If you want to test a route, you are probably looking for an integration test.
      '!api/**/*.routes.test.ts',
    ],
    setupFiles: ['./tests/setup.unit.ts'],
    deps: {
      inline: ['quirrel'],
    },
  },
})
