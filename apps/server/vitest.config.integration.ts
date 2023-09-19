import 'dotenv/config'

import tsconfigPaths from 'vite-tsconfig-paths'
import {defineProject} from 'vitest/config'

// Disable logging during tests
// eslint-disable-next-line turbo/no-undeclared-env-vars
process.env.LOG_LEVEL = 'error'
// eslint-disable-next-line turbo/no-undeclared-env-vars
process.env.MODE = 'development'

export default defineProject({
  // @ts-expect-error - vite-tsconfig-paths has a different vite version
  plugins: [tsconfigPaths()],
  test: {
    threads: false,
    name: 'bamotf/server:integration',
    include: ['app/routes/**/*.test.ts'],
    setupFiles: ['tests/setup.integration.ts'],
  },
})
