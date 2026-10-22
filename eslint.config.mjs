import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import storybook from 'eslint-plugin-storybook';
import nx from '@nx/eslint-plugin';

export default [
  {
    ignores: ['**/dist/**', '**/coverage/**', '**/out-tsc/**', '.angular/**', '.nx/**', '.nx-cache/**'],
  },
  ...storybook.configs['flat/recommended'],
  ...nx.configs['flat/base'],
  { plugins: { '@stylistic': stylistic } },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  ...nx.configs['flat/typescript'],
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-extra-semi': 'off',
      '@stylistic/no-extra-semi': 'error',
    },
  },
  ...nx.configs['flat/javascript'],
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      'no-extra-semi': 'off',
      '@stylistic/no-extra-semi': 'error',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
    languageOptions: { globals: globals.jest },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@stylistic/no-extra-semi': 'error',
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'if' },
        { blankLine: 'always', prev: 'if', next: '*' },
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
    },
  },
];
