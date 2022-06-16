import { resolvePage, resolvePluginPage, resolvePageWithVite } from '~inertia'

// return await resolvePluginPage(name) ?? import(`./pages/${name}.ts`)

const resolve = resolvePage((name: string) => {
  return resolvePageWithVite(name, import.meta.glob('./pages/**/*.ts'))
})
// const resolve = resolvePage((name: string) => import(`./pages/${name}.ts`))

async function inertia(component: string) {
  const page = await Promise.resolve(resolve(component))
    .then(module => (module as Record<string, unknown>).default || module)

  document.getElementById('app')!.innerHTML = page.template
  document.querySelector<HTMLElement>('#app ~ a')!.style.display = 'block'
}

// inertia('Page1')
// inertia('Page2')
// inertia('MyPackage::Page3')
inertia('MyPackage2::Page222')
