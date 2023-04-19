// eslint-disable-next-line turbo/no-undeclared-env-vars -- This runs before turbo therefore this rule is not needed
const isCi = process.env.CI !== undefined

// Prevent husky install on CI
if (!isCi) {
  require('husky').install()
}
