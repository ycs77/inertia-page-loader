import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Inertia from '../src/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    Inertia(),
  ],
})
