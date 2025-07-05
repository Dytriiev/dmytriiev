
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';

export default defineConfig([
  {
    files: ['**/*.js'],

    // Вказуємо, що це Node.js проєкт
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,    // Buffer, process, require, __dirname, …
      },
    },

    plugins: { js, },
    extends: ['js/recommended'],

    ignores: [
    'dist/**',          // Игнорировать всю папку dist
    '*.config.js',      // Все конфигурационные файлы
    '**/*.spec.js',     // Все тестовые файлы
    'node_modules/',     // Папка node_modules
    '.eslintrc.js',     // Сам конфиг ESLint
    '!.eslintignore',   // Исключение (не игнорировать этот файл)
    'build/',
    'coverage/'
  ],

    rules: {
      'no-unused-vars': 'warn',
      'no-undef':       'warn',
      'indent': ['warn', 2],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'prefer-const': 'warn'

    },
  },
]);