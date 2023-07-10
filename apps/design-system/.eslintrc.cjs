/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['custom', 'plugin:storybook/recommended'],
  ignorePatterns: ['**/storybook-static'],
};