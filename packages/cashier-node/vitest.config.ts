import {defineProject} from 'vitest/config'

process.env.LOG_LEVEL = 'error'

export default defineProject({
  test: {
    name: 'cashier-node',
    include: ['src/**/*.test.ts'],
    setupFiles: ['./tests/setup.unit.ts'],
  },
})
