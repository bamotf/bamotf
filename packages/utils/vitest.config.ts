import {defineProject} from 'vitest/config'

export default defineProject({
  test: {
    name: 'bamotf/utils',
    include: ['src/**/*.test.ts'],
  },
})
