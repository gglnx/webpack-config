import { defineConfig, globalIgnores } from 'eslint/config';
import config from '@gglnx/eslint-config';

export default defineConfig([
  globalIgnores([
    '**/node_modules/**',
    'dist/**',
  ]),
  ...config,
  {
    rules: {
      'unicorn/consistent-function-scoping': ['off'],
    },
  },
]);
