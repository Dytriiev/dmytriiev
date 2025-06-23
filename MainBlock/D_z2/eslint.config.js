// eslint.config.js
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

    plugins: { js },
    extends: ['js/recommended'],

    rules: {
      'no-unused-vars': 'warn',
      'no-undef':       'warn',
    },
  },
]);