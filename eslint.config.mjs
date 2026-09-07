import js from '@eslint/js';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

const eslintConfig = [
  // Base JavaScript recommendations
  js.configs.recommended,

  // Next.js + Core Web Vitals (native flat config in eslint-config-next 16)
  ...nextCoreWebVitals,

  // Prettier
  prettierRecommended,

  // Custom rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-undef': 'off',
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      'no-unused-vars': 'off',
      // Disable React Compiler rules (not adopting React Compiler yet)
      'react-hooks/purity': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/set-state-in-effect': 'off',
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

export default eslintConfig;
