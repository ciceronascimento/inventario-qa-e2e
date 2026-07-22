module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  env: {
    browser: true,
    node: true,
    mocha: true,
    es2021: true,
  },
  globals: {
    cy: 'readonly',
    Cypress: 'readonly',
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
  overrides: [
    {
      files: ['cypress/support/types/cypress.d.ts'],
      rules: {
        '@typescript-eslint/no-namespace': 'off',
      },
    },
  ],
}
