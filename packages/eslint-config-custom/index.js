/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    'next',
    'turbo',
    'prettier',
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
  ],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')],
    },
  },
}
