module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parser: 'vue-eslint-parser',
  extends: [
    'plugin:nuxt/recommended',
    'plugin:vue/essential',
    'plugin:vue/strongly-recommended',
    'plugin:vue/recommended'
  ],
  plugins: [],
  // add your custom rules here
  rules: {
    'no-console': [
      'warn',
      { allow: ['clear', 'info', 'error', 'dir', 'trace'] }
    ],
    'space-before-function-paren': [
      'error',
      { anonymous: 'never', named: 'never', asyncArrow: 'always' }
    ],
    'arrow-parens': ['warn', 'as-needed'],
    'quote-props': ['error', 'as-needed'],
    'vue/multi-word-component-names': 'off',
    'vue/require-name-property': 'warn',
    'vue/match-component-file-name': [
      'warn',
      {
        extensions: ['vue'],
        shouldMatchCase: false
      }
    ],
    'vue/block-tag-newline': 'warn',
    'vue/no-potential-component-option-typo': 'warn',
    'vue/html-quotes': ['warn', 'single']
  },
  overrides: [
    {
      files: ['pages/**/*.vue', 'layouts/**/*.vue'],
      rules: {
        'vue/match-component-file-name': 'off'
      }
    }
  ]
}
