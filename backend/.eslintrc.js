module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  extends: ['airbnb-base', 'airbnb-typescript/base'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    "import/prefer-default-export": "off",
    "class-methods-use-this": "off",
    "import/no-extraneous-dependencies": "warn"
  }
};
