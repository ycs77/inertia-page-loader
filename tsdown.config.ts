import { defineConfig } from 'tsdown'

export default [
  defineConfig({
    entry: ['src/*.ts'],
    format: ['cjs', 'esm'],
    clean: true,
    dts: true,
    fixedExtension: true,
  }),
  defineConfig({
    entry: {
      runtime: 'src/runtime/index.ts',
    },
    target: 'es5',
    format: ['cjs', 'esm', 'iife'],
    clean: false,
    dts: false,
    minify: true,
    fixedExtension: true,
  }),
]
