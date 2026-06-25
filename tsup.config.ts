import { defineConfig } from 'tsup';

export default defineConfig({
  dts: {
    compilerOptions: {
      ignoreDeprecations: '6.0',
    },
  },
  bundle: true,
  treeshake: true,
  format: ['esm', 'cjs'],
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
});
