import { createApp, h } from 'vue'
import { App, plugin } from '@inertiajs/inertia-vue3'
import { resolvePage, resolvePageWithVite } from '~inertia'

createApp({
  mounted() {
    document.querySelector<HTMLElement>('#app ~ a')!.style.display = 'block'
  },
  // @ts-expect-error
  render: () => h(App, {
    initialPage: {
      component: 'Page1',
      // component: 'Page2',
      // component: 'MyPackage1::Page3',
      // component: 'MyPackage2::Page222',
      // component: 'MyPhpPackage::PhpPackagePage',
      props: {},
      url: '/',
      version: '',
    },
    resolveComponent: resolvePage((name: string) => {
      return resolvePageWithVite(name, import.meta.glob('./pages/**/*.vue'))
    }),
  }),
})
  .use(plugin)
  .mount('#app')
