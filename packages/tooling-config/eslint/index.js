const js = require('@eslint/js');
const globals = require('globals');
const prettierConfig = require('eslint-config-prettier');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-undef': 'error',
      'prefer-const': 'warn',
      // Prevent arrow functions (custom requirement)
      'prefer-arrow-callback': 'off',
    
    },
  },
  // TypeScript specific configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // Disable JS rules that TypeScript handles
      'no-unused-vars': 'off',
      'no-undef': 'off',
      // Enable TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_', 
        varsIgnorePattern: '^_' 
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-var-requires': 'warn',
      // Prevent arrow functions (custom requirement)
      'prefer-arrow-callback': 'off',
    },
  },
  prettierConfig,
  {
    ignores: [
      'node_modules',
      '.turbo',
      'dist',
      'build',
      '.next',
      'coverage',
      'public',
      'packages/tooling-config/eslint/*',
      'packages/tooling-config/prettier/*',
      'packages/tooling-config/tsconfig/*',
    ],
  },
];
