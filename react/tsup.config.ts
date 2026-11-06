import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts', 'phone-input.tsx'],
  format: ['esm'],
  dts: { resolve: false },
  clean: true,
  outDir: 'dist',
  splitting: false,
  sourcemap: false,
  external: ['react', 'react-dom', 'libphonenumber-js'],
  tsconfig: './tsconfig.json'
});
