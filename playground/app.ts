import { createApp, h } from 'vue'
import { App, plugin } from '@inertiajs/inertia-vue3'
import { resolvePage } from '~inertia'

createApp({
  mounted() {
    document.querySelector<HTMLElement>('#app ~ a')!.style.display = 'block'
  },
  // @ts-expect-error
  render: () => h(App, {
    initialPage: {
      component: 'Page1',
      // component: 'Page2',
      // component: 'my-package-1::Page3',
      // component: 'my-package-2::Page222',
      // component: 'my-php-package::PhpPackagePage',
      props: {},
      url: '/',
      version: '',
    },
    resolveComponent: resolvePage(() => {
      return import.meta.glob('./pages/**/*.vue')
    }),
  }),
})
  .use(plugin)
  .mount('#app')
