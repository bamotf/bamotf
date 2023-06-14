import {defineProject} from 'vitest/config'

// eslint-disable-next-line turbo/no-undeclared-env-vars
process.env.LOG_LEVEL = 'error'

export default defineProject({
  test: {
    name: 'bam-otf-node',
    include: ['src/**/*.test.ts'],
    setupFiles: ['./tests/setup.unit.ts'],
  },
})
