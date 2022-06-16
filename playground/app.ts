import { createApp, h } from 'vue'
import { App, plugin } from '@inertiajs/inertia-vue3'
import { resolvePage, resolvePageWithVite } from '~inertia'

createApp({
  render: () => h(App, {
    initialPage: {
      component: 'Page1',
      // component: 'Page2',
      // component: 'MyPackage1::Page3',
      // component: 'MyPackage2::Page222',
      props: {},
      url: '/',
      version: '',
    },
    resolveComponent: resolvePage((name: string) => {
      return resolvePageWithVite(name, import.meta.glob('./pages/**/*.vue'))
    }),
  }),
  mounted() {
    document.querySelector<HTMLElement>('#app ~ a')!.style.display = 'block'
  },
}).use(plugin).mount('#app')
