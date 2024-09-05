import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePage } from '~inertia'

createInertiaApp({
  resolve: resolvePage(() => {
    return import.meta.glob('./pages/**/*.vue', { eager: true })
  }),
  setup({ el, App, props, plugin }) {
    createApp({
      render: () => h(App, props),
      mounted() {
        document.querySelector<HTMLElement>('#app ~ a')!.style.display = 'block'
      },
    })
      .use(plugin)
      .mount(el)
  },
  page: {
    component: 'Page1',
    // component: 'Page2',
    // component: 'my-package-1::Page3',
    // component: 'my-package-2::Page222',
    // component: 'my-package-2::Page223',
    // component: 'my-php-package::PhpPackagePage',
    props: {
      errors: {},
    },
    url: '/',
    version: null,
    scrollRegions: [],
    rememberedState: {},
  },
})
