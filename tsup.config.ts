import type { Options } from 'tsup'

export default <Options>{
  entry: ['src/*.ts'],
  clean: true,
  splitting: true,
  format: ['cjs', 'esm'],
  dts: true,
  onSuccess: 'npm run build:fix',
}
