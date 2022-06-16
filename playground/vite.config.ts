import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import Inertia from '../src/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    Vue(),
    Inertia({
      namespaces: ({ npm, composer }) => [
        { MyPackage1: 'test_node_modules/my-plugin1/Pages' },
        npm('my-plugin2', 'test_node_modules'),
        composer('ycs77/my-php-package', 'test_vendor'),
      ],
      extension: '.vue',
    }),
  ],
})
