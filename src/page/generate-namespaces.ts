import path from 'node:path'
import Debug from 'debug'
import { generateImportGlobCode } from '../module/import'
import { isViteLike, isWebpackLike } from '../utils'
import type { GenerateNamespacesCodeContextMeta, ResolvedOptions } from '../types'
import { resolveNamespaces } from './namespace-option'

const debug = Debug('inertia-page-loader:page:generate-namespaces')

export function generateNamespacesCode(options: ResolvedOptions, meta: GenerateNamespacesCodeContextMeta) {
  const cwd = options.cwd
  const namespaces = resolveNamespaces(cwd, options.namespaces)

  let importsCode = ''
  let importStartNum = 0

  let namespacesCode = Object.keys(namespaces).map(namespace => {
    const modules = namespaces[namespace]

    let code = `        '${namespace}': [\n`
    if (isViteLike(meta.framework)) {
      modules.forEach(moduleDir => {
        const { imports, pages, start } = generateImportGlobCode(moduleDir, {
          start: importStartNum,
          eager: options.ssr,
          cwd,
          extensions: options.extensions,
        })
        importStartNum = start
        importsCode += `${importsCode ? '\n' : ''}${imports}`
        code += `          name => resolveVitePage(name, ${pages}, false),\n`
      })
    } else if (isWebpackLike(meta.framework)) {
      modules.forEach(moduleDir => {
        const moduleImporter = options.ssr || (!options.ssr && !options.import) ? 'require' : 'import'
        const extension = options.extensions[0] ? `.${options.extensions[0]}` : ''

        let modulePath = path.relative(cwd, path.resolve(cwd, moduleDir, `\${name}${extension}`)).replace(/\\/g, '/')
        if (!modulePath.startsWith('.'))
          modulePath = `./${modulePath}`

        code += `          name => ${moduleImporter}(\`${modulePath}\`),\n`
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
