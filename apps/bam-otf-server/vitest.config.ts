import tsconfigPaths from 'vite-tsconfig-paths'
import {defineProject} from 'vitest/config'

import {env} from '../../env/env'

// eslint-disable-next-line turbo/no-undeclared-env-vars
env.LOG_LEVEL = 'error'

export default defineProject({
  plugins: [tsconfigPaths()],
  test: {
    name: 'bam-otf-server',
    include: ['tests/**/*.test.ts', 'app/**/*.test.ts'],
    exclude: [
      'build/**/*',
      // If you want to test a route, you are probably looking for an integration test.
      'app/routes/**/*.test.ts',
    ],
    setupFiles: ['dotenv/config', './tests/setup.unit.ts'],
  },
})
