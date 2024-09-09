import type { Options } from 'tsup'

export default {
  entry: ['src/*.ts'],
  clean: true,
  format: ['cjs', 'esm'],
  outExtension({ format }) {
    if (format === 'cjs') {
      return { js: '.cjs' }
    } else if (format === 'esm') {
      return { js: '.mjs' }
    }
    return {}
  },
  dts: true,
  cjsInterop: true,
  splitting: true,
  onSuccess: 'npm run build:fix',
} satisfies Options
