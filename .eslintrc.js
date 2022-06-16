module.exports = {
  extends: '@ycs77',
  overrides: [
    {
      files: ['composer.json'],
      parser: 'jsonc-eslint-parser',
      rules: {
        'jsonc/indent': ['error', 4],
      },
    },
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
  },
}
