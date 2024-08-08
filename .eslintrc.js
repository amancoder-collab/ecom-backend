module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
      project: 'tsconfig.json',
      sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
      'plugin:@typescript-eslint/recommended',
      'google',
      'plugin:prettier/recommended',
  ],
  root: true,
  env: {
      node: true,
      jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'prettier/prettier': [
          'error',
          {
              bracketSpacing: true,
          },
      ],
      'require-jsdoc': 'off',
      'new-cap': 'off',
      'linebreak-style': 'off',
      'no-return-await': 'warn',
      'object-curly-spacing': 'off',
      'indent': 'off',
      'max-len': 'off',
  },
};
