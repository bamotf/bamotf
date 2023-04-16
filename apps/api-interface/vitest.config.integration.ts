import './scripts/load-env-vars'
import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    include: ['server/**/*.routes.test.ts'],

    // This is extremely important because our integration tests will be
    // interacting with a database and expecting specific sets of data.
    // If multiple tests are running at the same time and interacting with our
    // database, you will likely cause problems in our tests due to unexpected data.
    threads: false,

    setupFiles: ['./tests/setup.integration.ts'],
  },
})
