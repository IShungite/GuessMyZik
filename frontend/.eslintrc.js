module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  extends: ['airbnb', 'airbnb-typescript'],
  root: true,
  env: {
    browser: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    "max-len": ["error", { "code": 120 }],
  }
};
