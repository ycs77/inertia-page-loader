import type { Options } from 'tsup'

export default <Options>{
  entry: {
    runtime: 'src/runtime/index.ts',
  },
  target: 'es5',
  format: ['cjs', 'esm', 'iife'],
  minify: true,
  outExtension({ format }) {
    if (format === 'cjs') {
      return { js: '.js' }
    } else if (format === 'esm') {
      return { js: '.mjs' }
    }
    return { js: `.${format}.js` }
  },
}
