import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  // Base JavaScript recommendations (equivalent to "eslint:recommended")
  js.configs.recommended,

  // Next.js configurations (equivalent to "next", "next/core-web-vitals", "plugin:prettier/recommended")
  ...compat.extends('next', 'next/core-web-vitals', 'plugin:prettier/recommended'),

  // Custom rules configuration matching your .eslintrc.json
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Exact same rules as in your .eslintrc.json
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      'no-unused-vars': 'off',
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
    },
  },

  // Global ignores
  {
    ignores: ['node_modules/**', '.next/**', 'dist/**', 'build/**'],
  },
];
