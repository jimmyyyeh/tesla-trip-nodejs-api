module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    requireConfigFile: false,
  },
  env: {
    browser: true,
    node: true,
  },
  extends: ['airbnb-base'],
  rules: {
    'no-console': 0,
  },
};
