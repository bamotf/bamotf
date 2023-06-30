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
    name: 'bam-otf-server',
    include: ['app/routes/**/*.test.ts'],
    setupFiles: [
      'dotenv/config',
      // './tests/setup.unit.ts'
    ],
  },
})
