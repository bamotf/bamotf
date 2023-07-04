import {defineProject} from 'vitest/config'

export default defineProject({
  test: {
    name: 'bam-otf-utils',
    include: ['src/**/*.test.ts'],
  },
})
