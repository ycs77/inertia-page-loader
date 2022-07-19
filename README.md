# Inertia Plugin

[![NPM version][ico-version]][link-npm]
[![Software License][ico-license]](LICENSE)
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
npm i inertia-plugin -D
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
const InertiaPlugin = require('inertia-plugin/webpack')

module.exports = {
  /* ... */
  plugins: [
    InertiaPlugin({ /* options */ }),
  ],
}
```

<br></details>

<details>
<summary>Laravel Mix</summary><br>

```ts
// webpack.mix.js
const InertiaPlugin = require('inertia-plugin/webpack')

mix
  .webpackConfig({
    plugins: [
      InertiaPlugin({ /* options */ }),
    ],
  })
```

<br></details>

### Type

Add to `env.d.ts`:

```ts
/// <reference types="inertia-plugin/client" />
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
* [Modules (in main app)](#load-pages-from-modules-in-main-app)

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

Add `inertia-plugin` to `vite.config.js`, and you can use the function `npm()` or `composer()` to load the namespace:

```js
import Inertia from 'inertia-plugin/vite'

export default defineConfig({
  plugins: [
    Inertia({
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
    return import.meta.glob('./pages/**/*.vue')
  }),
})
```

Or you can add the persistent layout:

```js
import Layout from './Layout'

createInertiaApp({
  resolve: resolvePage(name => {
    return import.meta.glob('./pages/**/*.vue')
  }, page => {
    page.layout = Layout
    return page
  }),
})
```

Now you can use the pages:

```php
Inertia::render('my-package::Some'); // in npm package
Inertia::render('my-php-package::Some'); // in composer package
```

### Usage with Laravel Mix

Add `inertia-plugin` to `webpack.mix.js`, and you can use the function `npm()` or `composer()` to load the namespace:

```js
mix
  .webpackConfig({
    plugins: [
      inertiaPlugin({
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

Now you can use the pages:

```php
Inertia::render('my-package::Some'); // in npm package
Inertia::render('my-php-package::Some'); // in composer package
```

### Load pages from Modules (in main app)

If you use the modules package to manage your Laravel application, such as [Laravel Modules](https://github.com/nWidart/laravel-modules), you can also define namespace mapping:

> **Note**: Of course, can also be load pages from other locations in the main application.

```js
export default defineConfig({
  plugins: [
    Inertia({
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

Now you can use the pages:

```php
Inertia::render('my-module::Some');
Inertia::render('my-module-2::Some');
Inertia::render('special-modal::VeryCoolModal');
```

## Build for Runtime

Sometimes you may want users to use the pages without compiling them after installing the composer package, at this time you can load them at runtime. This is the package directory structure:

```
resources/js/
  ├── my-runtime-pluin.js
  └── pages/
     ├── Some.vue
     └── Other.vue
```

Use the **InertiaPlugin** runtime API in `resources/js/my-runtime-pluin.js` to load pages:

```js
window.InertiaPlugin.addNamespace('MyRuntimePluin', name => require(`./Pages/${name}`))
```

And setting `webpack.mix.js` to build assets:

```js
const mix = require('laravel-mix')

mix
  .setPublicPath('public')
  .js('resources/js/my-runtime-pluin.js', 'public/js')
  .vue({ runtimeOnly: true })
  .version()
  .disableNotifications()
```

Now you can publish this package and install it in the Inertia app, publish assets (`my-runtime-pluin.js`) to `public/vendor/inertia-plugins`, and open `app.blade.php` to include scripts to load pages:

```html
<head>
  <script src="https://cdn.jsdelivr.net/npm/inertia-plugin@^0.4.0"></script>
  <script src="/vendor/inertia-plugins/my-runtime-pluin.js" defer></script>
  <!-- app.js must be last one -->
  <script src="{{ mix('/js/app.js') }}" defer></script>
</head>
```

But the `app.js` must build with `inertia-plugin`, you can follow [Install](#install) chapter to install it (does not need to include any option), like this:

```js
// vite.config.js
import Inertia from 'inertia-plugin/vite'

export default defineConfig({
  plugins: [
    Inertia(),
  ],
})

// webpack.mix.js
const InertiaPlugin = require('inertia-plugin/webpack')

mix
  .webpackConfig({
    plugins: [
      InertiaPlugin(),
    ],
  })
```

Over, using pages:

```php
Inertia::render('MyRuntimePluin::Some');
```

## Configuration

```js
Inertia({
  // Current work directory.
  cwd: process.cwd(),

  // Define namespace mapping.
  namespaces: [],

  // Namespace separator.
  separator: '::',

  // Module extensions.
  extensions: '',
  // extensions: 'vue', // if use vite the defaults is 'vue'
  // extensions: 'vue', // webpack example
  // extensions: ['vue', 'js'], // vite example

  // Use `import()` to load pages for webpack, default is using `require()`.
  // Only for webpack.
  import: false,

  // Enable SSR mode.
  ssr: false,
})
```

## Sponsor

If you think this package have helped you, can [Become a sponsor](https://www.patreon.com/ycs77) to support my work~ and your avatar will be visible on my major projects.

---

**Now there are no sponsors yet, [join it](https://www.patreon.com/ycs77).**

---

## Credits

* [inertia-laravel#92](https://github.com/inertiajs/inertia-laravel/issues/92)
* [unplugin](https://github.com/unjs/unplugin)
* [Laravel](https://laravel.com/)
* [Laravel Vite](https://laravel-vite.dev/)

## License

[MIT LICENSE](LICENSE)

[ico-version]: https://img.shields.io/npm/v/inertia-plugin?style=flat-square
[ico-license]: https://img.shields.io/badge/license-MIT-brightgreen?style=flat-square
[ico-downloads]: https://img.shields.io/npm/dt/inertia-plugin?style=flat-square

[link-npm]: https://www.npmjs.com/package/inertia-plugin
[link-downloads]: https://www.npmjs.com/package/inertia-plugin
