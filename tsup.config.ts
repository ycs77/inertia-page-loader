import type { Options } from 'tsup'

export default <Options>{
  entry: ['src/*.ts'],
  clean: true,
  splitting: true,
  format: ['cjs', 'esm'],
  outExtension({ format }) {
    if (format === 'cjs') {
      return { js: '.cjs' }
    } else if (format === 'esm') {
      return { js: '.mjs' }
    }
    return { js: `.${format}.js` }
  },
  dts: true,
  onSuccess: 'npm run build:fix',
}
