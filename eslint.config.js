// @ts-check
const antfu = require('@antfu/eslint-config').default

module.exports = antfu(
  {
    ignores: [
      // eslint ignore globs here
      'test/**/*',
    ],
  },
  {
    rules: {
      // overrides
      'no-restricted-syntax': 'off',
      'unused-imports/no-unused-vars': 'off',
    },
  },
)
