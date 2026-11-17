import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextVitals,
  globalIgnores(['.next-dev/**', 'public/**']),
  {
    rules: {
      '@next/next/no-img-element': 'off',
      // Keep the new React Compiler diagnostics visible during the framework upgrade.
      'react-hooks/immutability': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]);
