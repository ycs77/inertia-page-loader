# Inertia Plugin

[![NPM version](https://img.shields.io/npm/v/inertia-plugin?style=flat-square)](https://www.npmjs.com/package/inertia-plugin)

The plugin system for Inertia.js

## Install

```bash
npm i inertia-plugin
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import Inertia from 'inertia-plugin/vite'

export default defineConfig({
  plugins: [
    Inertia({ /* options */ }),
  ],
})
```

Example: [`playground/`](./playground/)

<br></details>

<!-- <details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import Inertia from 'inertia-plugin/rollup'

export default {
  plugins: [
    Inertia({ /* options */ }),
  ],
}
```

<br></details> -->

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('inertia-plugin/webpack')({ /* options */ })
  ]
}
```

<br></details>

<details>
<summary>Laravel Mix</summary><br>

```ts
// webpack.mix.js
const inertiaPlugin = require('inertia-plugin/webpack').default

mix
  .webpackConfig({
    plugins: [
      inertiaPlugin({ /* options */ }),
    ],
  })

```

<br></details>
