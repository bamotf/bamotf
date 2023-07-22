/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ['custom'],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
    react: {
      version: '18',
    },
  },

  ignorePatterns: [
    '**/storybook-static',
    '**/prisma/client',
    '**/.next/*',
    '**/dist/*',
    '**/build/*',
  ],
}
