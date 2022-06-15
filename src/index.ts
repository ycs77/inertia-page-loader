import { createUnplugin } from 'unplugin'
import { ids } from './plugin'
import type { Options } from './types'

export default createUnplugin<Options>(options => ({
  name: 'inertia-plugin',
  enforce: 'pre',
  resolveId(id) {
    if (id.startsWith(ids[1])) {
      return id.replace(ids[1], ids[0])
    }
  },
  load(id: string) {
    if (id.startsWith(ids[0])) {
      const separator = '::'
      const namespaceMapping = {
        'MyPackage': './modules/my-plugin/pages/${page}',
        'MyPackage2': './modules/my-plugin2/pages/${page}',
      } as Record<string, string>
      const extension = '.ts'

      const checkNamespaceCode = Object.keys(namespaceMapping).map(namespace => {
        return `
      if (namespace === '${namespace}') {
        return import(\`${namespaceMapping[namespace]}${extension}\`)
      }`
      }).join('')

      const code = `
export function resolvePluginPage(name) {
  if (name.includes('${separator}')) {
    const [namespace, page] = name.split('${separator}')
    if (namespace && page) {${checkNamespaceCode}
    }
  }
}`

      return {
        code,
        map: { version: 3, mappings: '', sources: [] } as any,
      }
    }
  },
}))
