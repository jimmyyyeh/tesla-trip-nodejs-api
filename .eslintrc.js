module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  rules: {
    'no-console': 0,
  },
};
