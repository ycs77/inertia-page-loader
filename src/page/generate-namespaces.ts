import type { UnpluginContextMeta } from 'unplugin'
import Debug from 'debug'
import type { ResolvedOptions } from '../types'
import { generateImportGlobCode } from '../module/import'
import { resolveNamespaces } from './namespace-option'

const debug = Debug('inertia-plugin:page:generate-namespaces')

export function generateNamespacesCode(options: ResolvedOptions, meta: UnpluginContextMeta) {
  const cwd = options.cwd
  const namespaces = resolveNamespaces(cwd, options.namespaces)

  let importsCode = ''
  let importStartNum = 0

  let namespacesCode = Object.keys(namespaces).map(namespace => {
    const modules = namespaces[namespace]

    let code = `        '${namespace}': [\n`
    if (meta.framework === 'vite') {
      modules.forEach(moduleDir => {
        const { imports, pages, start } = generateImportGlobCode(moduleDir, {
          start: importStartNum,
          eager: options.ssr,
          cwd: options.cwd,
          extensions: options.extensions,
        })
        importStartNum = start
        importsCode += `${importsCode ? '\n' : ''}${imports}`
        code += `          name => resolveVitePage(name, ${pages}, false),\n`
      })
    } else if (meta.framework === 'webpack') {
      modules.forEach(moduleDir => {
        const moduleImporter = options.ssr || (!options.ssr && !options.import) ? 'require' : 'import'
        const extension = options.extensions[0] ? `.${options.extensions[0]}` : ''
        code += `          name => ${moduleImporter}(\`../${moduleDir}/\${name}${extension}\`),\n`
      })
    }
    code += '        ],\n'

    return code
  }).join('')

  namespacesCode = `{\n${namespacesCode}      }`

  debug(namespacesCode)
  debug(importsCode)

  return { namespacesCode, importsCode }
}
