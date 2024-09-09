# Inertia Page Loader

[![NPM version][ico-version]][link-npm]
[![Software License][ico-license]](LICENSE)
[![GitHub Tests Action Status][ico-github-action]][link-github-action]
[![Total Downloads][ico-downloads]][link-downloads]

The plugin page loader for Inertia.js, that allows the server-side to use `Inertia::render('my-package::Page');`.

## Features

* Powered by [unplugin](https://github.com/unjs/unplugin)
* Supports **static** build with [Vite](https://vitejs.dev/) and [Laravel Mix](https://laravel-mix.com/)
* Supports load pages on **runtime**
* Define the namespace mapping for plugins **pages** directory
* Or read namespace from the **npm** / **composer** package

## Install

First, install the Inertia Plugin to your main Inertia app:

```bash
npm i inertia-page-loader -D
```

<details>
<summary>Vite</summary><br>

```js
// vite.config.js
import InertiaPageLoader from 'inertia-page-loader/vite'

export default defineConfig({
  plugins: [
    InertiaPageLoader({ /* options */ }),
  ],
})
```

<br></details>

<details>
<summary>Webpack</summary><br>

```js
// webpack.config.js
const InertiaPageLoaderPlugin = require('inertia-page-loader/webpack')

module.exports = {
  /* ... */
  plugins: [
    InertiaPageLoaderPlugin({ /* options */ }),
  ],
}
```

<br></details>

<details>
<summary>Laravel Mix</summary><br>

```js
// webpack.mix.js
const InertiaPageLoaderPlugin = require('inertia-page-loader/webpack')

mix
  .webpackConfig({
    plugins: [
      InertiaPageLoaderPlugin({ /* options */ }),
    ],
  })
```

<br></details>

### Type

Add to `env.d.ts`:

```ts
/// <reference types="inertia-page-loader/client" />
```

## Usage

This package supports the **Static** and **Runtime** to load the pages (can be mixed to use), so you can select the way to build and use your Inertia pages:

<!-- no toc -->
* [Build for Static](#build-for-static)
* [Build for Runtime](#build-for-runtime)

## Build for Static

Then select the source from which you want to load the page:

<!-- no toc -->
* [NPM Package](#load-pages-from-npm-package)
* [Composer Package](#load-pages-from-composer-package)
* [Modules (in the main app)](#load-pages-from-modules-in-main-app)

If you created or have a package, you can select the build tool to use the package:

<!-- no toc -->
* [Usage with Vite](#usage-with-vite)
* [Usage with Laravel Mix](#usage-with-laravel-mix)

### Load Pages from NPM Package

You must create an npm package that contains the `pages` folder:

```
src/pages/
  ├── Some.vue
  └── Dir/
     └── Other.vue
```

And added the `inertia` field to define the namespace mapping, for example in `node_modules/my-plugin/package.json`:

```json
{
  "name": "my-plugin",
  "inertia": {
    "my-package": "src/pages"
  }
}
```

Publish this package and back to the main Inertia app to install this package:

```bash
npm i my-plugin
```

Next step you can select the build tool to use:

<!-- no toc -->
* [Usage with Vite](#usage-with-vite)
* [Usage with Laravel Mix](#usage-with-laravel-mix)

### Load Pages from Composer Package

You must create a composer package that contains the `pages` folder:

```
resources/js/pages/
  ├── Some.vue
  └── Dir/
     └── Other.vue
```

And added the `extra.inertia` field to define the namespace mapping, for example in `vendor/ycs77/my-php-package/composer.json`:

```json
{
    "name": "ycs77/my-php-package",
    "extra": {
        "inertia": {
            "my-php-package": "resources/js/pages"
        }
    }
}
```

Publish this package and back to the main Inertia app to install this package:

```bash
composer require ycs77/my-php-package
```

Next step you can select the build tool to use:

<!-- no toc -->
* [Usage with Vite](#usage-with-vite)
* [Usage with Laravel Mix](#usage-with-laravel-mix)

### Usage with Vite

Add `inertia-page-loader` to `vite.config.js`, and you can use the function `npm()` or `composer()` to load the namespace:

```js
import InertiaPageLoader from 'inertia-page-loader/vite'

export default defineConfig({
  plugins: [
    InertiaPageLoader({
      namespaces: ({ npm, composer }) => [
        // load namespace from npm package:
        npm('my-plugin'),

        // load namespace from composer package:
        composer('ycs77/my-php-package'),
      ],
    }),
  ],
})
```

And use `resolvePage()` in `resources/js/app.js` to resolve the app pages and npm / composer pages (**don't use one line function**):

```js
import { resolvePage } from '~inertia'

createInertiaApp({
  resolve: resolvePage(() => {
    return import.meta.glob('./pages/**/*.vue', { eager: true })
  }),
})
```

Or you can add the persistent layout:

```js
import Layout from './Layout'

createInertiaApp({
  resolve: resolvePage(name => {
    return import.meta.glob('./pages/**/*.vue', { eager: true })
  }, page => {
    page.layout = Layout
    return page
  }),
})
```

Now you can use the page in your controller:

```php
Inertia::render('my-package::Some'); // in npm package
Inertia::render('my-php-package::Some'); // in composer package
```

### Usage with Laravel Mix

Add `inertia-page-loader` to `webpack.mix.js`, and you can use the function `npm()` or `composer()` to load the namespace:

```js
mix
  .webpackConfig({
    plugins: [
      InertiaPageLoaderPlugin({
        namespaces: ({ npm, composer }) => [
          // load namespace from npm package:
          npm('my-plugin'),

          // load namespace from composer package:
          composer('ycs77/my-php-package'),
        ],
      }),
    ],
  })
```

And use `resolvePage()` in `resources/js/app.js` to resolve the app pages and npm / composer pages:

```js
import { resolvePage } from '~inertia'

createInertiaApp({
  resolve: resolvePage(name => require(`./pages/${name}`)),
})
```

Or you can add the persistent layout:

```js
import Layout from './Layout'

createInertiaApp({
  resolve: resolvePage(name => require(`./pages/${name}`), page => {
    page.layout = Layout
    return page
  }),
})
```

Now you can use the page in your controller:

```php
Inertia::render('my-package::Some'); // in npm package
Inertia::render('my-php-package::Some'); // in composer package
```

### Load pages from Modules (in the main app)

If you use the modules package to manage your Laravel application, such as [Laravel Modules](https://github.com/nWidart/laravel-modules), you can also define namespace mapping:

> **Note**: Of course, can also be load pages from other locations in the main application.

```js
export default defineConfig({
  plugins: [
    InertiaPageLoader({
      namespaces: [
        // define namespace mapping:
        { 'my-module': 'Modules/MyModule/Resources/js/pages' },

        // define more namespace mapping:
        {
          'my-module-2': 'Modules/MyModule2/Resources/js/pages',
          'special-modal': 'resources/js/SpecialModals',
        },
      ],
    }),
  ],
})
```

Now you can use the page in your controller:

```php
Inertia::render('my-module::Some');
Inertia::render('my-module-2::Some');
Inertia::render('special-modal::VeryCoolModal');
```

## Build for Runtime

Sometimes you may want users to use the pages without compiling them after installing the composer package, at this time you can load them at runtime. This is the package directory structure:

```
resources/js/
  ├── my-runtime-plugin.js
  └── pages/
     ├── Some.vue
     └── Other.vue
```

Use the **InertiaPlugin** runtime API in `resources/js/my-runtime-plugin.js` to load pages:

```js
window.InertiaPlugin.addNamespace('my-runtime', name => require(`./pages/${name}`))
```

And setting `webpack.mix.js` to build assets:

```js
const mix = require('laravel-mix')

mix
  .setPublicPath('public')
  .js('resources/js/my-runtime-plugin.js', 'public/js')
  .vue({ runtimeOnly: true })
  .version()
  .disableNotifications()
```

Now you can publish this package and install it in the Inertia app, publish assets (`my-runtime-plugin.js`) to `public/vendor/inertia-plugins`, and open `app.blade.php` to include scripts to load pages:

```html
<head>
  <script src="https://cdn.jsdelivr.net/npm/inertia-page-loader@0.7.0/dist/runtime.iife.js"></script>
  <script src="/vendor/inertia-plugins/my-runtime-plugin.js" defer></script>
  <!-- app.js must be last one -->
  <script src="{{ mix('/js/app.js') }}" defer></script>
</head>
```

But the `app.js` must build with `inertia-page-loader`, you can follow [Install](#install) chapter to install it (does not need to include any option), like this:

```js
// vite.config.js
import InertiaPageLoader from 'inertia-page-loader/vite'

export default defineConfig({
  plugins: [
    InertiaPageLoader(),
  ],
})
```

Or using in Laravel Mix:

```js
// webpack.mix.js
const InertiaPageLoaderPlugin = require('inertia-page-loader/webpack')

mix
  .webpackConfig({
    plugins: [
      InertiaPageLoaderPlugin(),
    ],
  })
```

Now you can use the page in your controller:

```php
Inertia::render('my-runtime::Some');
```

## Configuration

```js
InertiaPageLoader({
  // Current work directory.
  cwd: process.cwd(),

  // Define namespace mapping.
  namespaces: [],

  // Namespace separator.
  separator: '::',

  // Module extensions.
  extensions: '',
  // extensions: '',            // webpack default
  // extensions: 'vue',         // webpack example
  // extensions: 'vue',         // vite default
  // extensions: ['vue', 'js'], // vite example

  // Use `import()` to load pages for webpack, default is using `require()`.
  // Only for webpack.
  import: false,

  // Enable SSR mode.
  ssr: false,
})
```

## Sponsor

If you think this package has helped you, please consider [Becoming a sponsor](https://www.patreon.com/ycs77) to support my work~ and your avatar will be visible on my major projects.

<p align="center">
  <a href="https://www.patreon.com/ycs77">
    <img src="https://cdn.jsdelivr.net/gh/ycs77/static/sponsors.svg"/>
  </a>
</p>

<a href="https://www.patreon.com/ycs77">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patron" />
</a>

## Credits

* [inertia-laravel#92](https://github.com/inertiajs/inertia-laravel/issues/92)
* [unplugin](https://github.com/unjs/unplugin)
* [Laravel](https://laravel.com/)

## License

[MIT LICENSE](LICENSE)

[ico-version]: https://img.shields.io/npm/v/inertia-page-loader?style=flat-square
[ico-license]: https://img.shields.io/badge/license-MIT-brightgreen?style=flat-square
[ico-github-action]: https://img.shields.io/github/actions/workflow/status/ycs77/inertia-page-loader/ci.yml?branch=main&label=tests&style=flat-square
[ico-downloads]: https://img.shields.io/npm/dt/inertia-page-loader?style=flat-square

[link-npm]: https://www.npmjs.com/package/inertia-page-loader
[link-github-action]: https://github.com/ycs77/inertia-page-loader/actions/workflows/ci.yml?query=branch%3Amain
[link-downloads]: https://www.npmjs.com/package/inertia-page-loader
