# Inertia Plugin

[![NPM version](https://img.shields.io/npm/v/inertia-plugin?style=flat-square)](https://www.npmjs.com/package/inertia-plugin)

The plugin page loader for Inertia.js

## Install

```bash
npm i inertia-plugin
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.js
import Inertia from 'inertia-plugin/vite'

export default defineConfig({
  plugins: [
    Inertia({ /* options */ }),
  ],
})
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
const inertiaPlugin = require('inertia-plugin/webpack').default

module.exports = {
  /* ... */
  plugins: [
    inertiaPlugin({ /* options */ })
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

## Usage with Vite

Add `inertia-plugin` to `vite.config.js`:

```js
import Inertia from 'inertia-plugin/vite'

export default defineConfig({
  plugins: [
    Inertia({
      namespaces: [
        { MyPackage1: 'node_modules/my-plugin1/src/Pages' },
        { MyPackage2: 'node_modules/my-plugin2/src/Pages' },
      ],
    }),
  ],
})
```

And use `resolvePage()` in `resources/js/app.js` to resolve the app pages and namespaced pages:

```js
import { resolvePage, resolvePageWithVite } from '~inertia'

createInertiaApp({
  resolve: resolvePage(name => {
    return resolvePageWithVite(name, import.meta.glob('./pages/**/*.vue'))
  }),
})
```

Or you can add persistent layout:

```js
import Layout from './Layout'

createInertiaApp({
  resolve: resolvePage(name => {
    return resolvePageWithVite(name, import.meta.glob('./pages/**/*.vue'))
  }, page => {
    page.layout = Layout
    return page
  }),
})
```

## Laravel Mix

Add `inertia-plugin` to `webpack.mix.js`:

```js
mix
  .webpackConfig({
    plugins: [
      inertiaPlugin({
        namespaces: ({ npm, composer }) => [
          { MyPackage1: 'node_modules/my-plugin1/src/Pages' },
          { MyPackage2: 'node_modules/my-plugin2/src/Pages' },
        ],
      }),
    ],
  })
```

And use `resolvePage()` in `resources/js/app.js` to resolve the app pages and namespaced pages:

```js
import { resolvePage } from '~inertia'

createInertiaApp({
  resolve: resolvePage(name => require(`./pages/${name}`)),
})
```

Or you can add persistent layout:

```js
import Layout from './Layout'

createInertiaApp({
  resolve: resolvePage(name => require(`./pages/${name}`), page => {
    page.layout = Layout
    return page
  }),
})
```

## Load namespace in package

If you create a plugin with Inertia pages, the plugin user can use the function `npm()` or `composer()` to load the namespace:

```js
export default defineConfig({
  plugins: [
    Inertia({
      namespaces: ({ npm, composer }) => [
        // define namespace mapping:
        { MyPackage1: 'node_modules/my-plugin1/src/Pages' },
        { MyPackage2: 'node_modules/my-plugin2/src/Pages' },

        // load namespace from npm package:
        npm('my-plugin2'),

        // load namespace from composer package:
        composer('ycs77/my-php-package'),
      ],
    }),
  ],
})
```

If you created is npm package, must be added the `inertia` field to define the namespace mapping, for example in `node_modules/my-plugin2/package.json`, and you would put pages into `src/other-pages` directory:

```json
{
  "name": "my-plugin2",
  "inertia": {
    "MyPackage2": "src/other-pages"
  }
}
```

If you created is composer package, must be added the `extra.inertia` field to define the namespace mapping, for example in `vendor/ycs77/my-php-package/composer.json`, and you would put pages into `resources/js/Pages` directory:

```json
{
    "name": "ycs77/my-php-package",
    "extra": {
        "inertia": {
            "MyPhpPackage": "resources/js/Pages"
        }
    }
}
```

## Options

```ts
export interface Options {
  /**
   * Current work directory.
   *
   * Default: process.cwd()
   */
  cwd?: string

  /**
   * Define namespace mapping.
   *
   * Default: []
   */
  namespaces?: Namespaces

  /**
   * Namespace separator.
   *
   * Default: '::'
   */
  separator?: string

  /**
   * Module extension.
   *
   * Default: '' (Defaults to '.vue' if not set and used with vite.)
   */
  extension?: string

  /**
   * Use `import()` to load pages for webpack, default is using `require()`.
   * Only for webpack.
   *
   * Default: false
   */
  import?: boolean

  /**
   * Enable SSR mode.
   *
   * Default: false
   */
  ssr?: boolean
}
```

## Credits

* [unplugin](https://github.com/unjs/unplugin)
* [Laravel](https://laravel.com/)
* [Laravel Vite](https://laravel-vite.dev/)

## License

[MIT LICENSE](LICENSE.md)
