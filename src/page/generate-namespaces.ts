import type { UnpluginContextMeta } from 'unplugin'
import type { ResolvedOptions } from '../types'
import { resolveNamespaces } from './namespace-option'

export function generateNamespacesCode(options: ResolvedOptions, meta: UnpluginContextMeta) {
  const cwd = options.cwd
  const namespaces = resolveNamespaces(cwd, options.namespaces)

  let namespacesCode = Object.keys(namespaces).map(namespace => {
    const modules = namespaces[namespace]

    let code = `\n        '${namespace}': [`
    if (meta.framework === 'vite') {
      modules.forEach(moduleDir => {
        code += `\n          name => resolveVitePage(name, import.meta.${!options.ssr ? 'glob' : 'globEager'}('/${moduleDir}/**/*${options.extension}'), false),`
      })
    } else if (meta.framework === 'webpack') {
      modules.forEach(moduleDir => {
        const moduleImporter = options.ssr || (!options.ssr && !options.import) ? 'require' : 'import'
        code += `\n          name => ${moduleImporter}(\`../${moduleDir}/\${name}${options.extension}\`),`
      })
    }
    code += '\n        ],'

    return code
  }).join('')

  namespacesCode += '\n      '

  return `{${namespacesCode}}`
}
