/** @format */

module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
    jquery: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'max-len': [
      'error',
      {
        code: 120,
        tabWidth: 2,
        ignoreUrls: true,
      },
    ],
    'no-tabs': [
      'error',
      {
        allowIndentationTabs: false,
      },
    ],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'prettier/prettier': ['error'],
  },
  overrides: [
    {
      files: ['src/*'],
      env: {
        node: false,
        browser: true,
      },
    },
  ],
};
