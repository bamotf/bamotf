import 'dotenv/config'

import tsconfigPaths from 'vite-tsconfig-paths'
import {defineProject} from 'vitest/config'

// Disable logging during tests
// eslint-disable-next-line turbo/no-undeclared-env-vars
process.env.LOG_LEVEL = 'error'
// eslint-disable-next-line turbo/no-undeclared-env-vars
process.env.MODE = 'development'

export default defineProject({
  // @ts-expect-error vitest was updated
  plugins: [tsconfigPaths()],
  test: {
    name: 'bamotf/server:unit',
    include: ['tests/**/*.test.ts', 'app/**/*.test.ts'],
    exclude: [
      'build/**/*',
      // If you want to test a route, you are probably looking for an integration test.
      'app/routes/**/*.test.ts',
    ],
    setupFiles: ['./tests/setup.unit.ts'],
  },
})
