module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module',
  },
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
    '/generated/**/*', // Ignore generated files.
  ],
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  rules: {
    'import/no-unresolved': 0,
    'no-undef': 'error',
    'linebreak-style': 0,
    'object-curly-spacing': ['error', 'always'],
    'quotes': ['error', 'single'],
    'indent': ['error', 2, {
      'SwitchCase': 1,
      'ignoredNodes': ['JSXElement', 'JSXElement *', 'JSXAttribute'],
    }],
    'semi': ['error', 'never'],
  },
}
