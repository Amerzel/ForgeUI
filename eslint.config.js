import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default [
  {
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/.storybook/**',
      '**/storybook-static/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // TypeScript
      ...tsPlugin.configs['recommended-type-checked'].rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-non-null-assertion': 'error',

      // React
      ...reactPlugin.configs.recommended.rules,
      'react/prop-types': 'off', // TypeScript handles this
      'react/react-in-jsx-scope': 'off', // React 17+ JSX transform
      'react/display-name': 'error',

      // React Hooks
      ...reactHooks.configs.recommended.rules,

      // Accessibility
      ...jsxA11y.configs.recommended.rules,

      // General
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // TypeScript handles no-undef better than ESLint (supports JSX transform, types, etc.)
      'no-undef': 'off',
    },
  },
  {
    // Disable type-checked rules for files not included in tsconfig
    files: [
      '**/*.config.ts',
      '**/*.config.js',
      '**/scripts/**',
      '**/__tests__/**',
      '**/test-setup.ts',
      '**/stories/**',
    ],
    languageOptions: {
      parserOptions: {
        project: false,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-console': 'off',
      'react/no-unescaped-entities': 'off',
      'react/no-children-prop': 'off',
      // Disable all type-checked rules (they require project)
      ...tsPlugin.configs['disable-type-checked'].rules,
    },
  },
]
