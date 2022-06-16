import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Inertia from '../src/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    Inertia({
      // appPath: '',
      namespaces: [
        { 'MyPackage': 'modules/my-plugin/Pages' },
        { 'MyPackage2': ['modules/my-plugin2/other-pages'] },
      ],
      // separator: '::',
      extension: '.ts',
    }),
  ],
})
