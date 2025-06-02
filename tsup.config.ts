import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: 'esm',
    outDir: 'dist',
    dts: true,
    sourcemap: true,
    target: 'es2020',
    splitting: false,
    minify: false,
    clean: true,
    outExtension: () => ({ js: '.mjs' }) // 输出 .mjs
  },
  {
    entry: ['src/index.ts'],
    format: 'cjs',
    outDir: 'dist',
    sourcemap: true,
    target: 'es2020',
    splitting: false,
    minify: false,
    outExtension: () => ({ js: '.cjs' }) // 输出 .cjs
  }
]);
