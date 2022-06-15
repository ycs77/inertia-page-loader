import { resolvePluginPage } from '~inertia'

async function resolvePage(name: string) {
  const page = await resolvePluginPage(name)
  if (page) return page
  return import(`./pages/${name}.ts`)
}

async function main(component: string) {
  const page = await Promise.resolve(resolvePage(component)).then(module => {
    return (module as Record<string, unknown>).default || module
  })

  document.getElementById('app')!.innerHTML = page.template
}

// 'Page1'
// 'MyPackage::Page1'
main('MyPackage::Page3')
