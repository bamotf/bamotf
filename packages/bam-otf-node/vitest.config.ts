import {defineProject} from 'vitest/config'

import {env} from '../../env/env'

// eslint-disable-next-line turbo/no-undeclared-env-vars
env.LOG_LEVEL = 'error'

export default defineProject({
  test: {
    name: 'bam-otf-node',
    include: ['src/**/*.test.ts'],
    setupFiles: ['./tests/setup.unit.ts'],
  },
})
