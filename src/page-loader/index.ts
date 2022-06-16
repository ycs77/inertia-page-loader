import type { UnpluginContextMeta } from 'unplugin'
import type { ResolvedOptions } from '../types'
import { generateNamespacesCode } from './generate-namespaces'

export function pageLoader(options: ResolvedOptions, meta: UnpluginContextMeta) {
  const namespacesCode = generateNamespacesCode(options, meta)

  return `
export function resolvePage(resolver) {
  return async name => await resolvePluginPage(name) ?? await resolver(name)
}

export async function resolvePluginPage(name) {
  if (name.includes('${options.separator}')) {
    const [namespace, page] = name.split('${options.separator}')
    if (namespace && page) {
      const namespaces = ${namespacesCode}
      if (!namespaces[namespace]) {
        throw new Error(\`[inertia-plugin]: Namespace "\${namespace}" not found\`)
      }
      for (const importedNamespace of namespaces[namespace]) {
        if (importedNamespace && typeof importedNamespace === 'function') {
          return importedNamespace()
        }
      }
    }
  }
}

export async function resolvePageWithVite(name, pages, throwNotFoundError = true) {
  for (const path in pages) {
    if (path.endsWith(\`\${name.replace('.', '/')}${options.extension}\`)) {
      const module = typeof pages[path] === 'function'
        ? pages[path]()
        : pages[path]

      return await Promise.resolve(module).then(module => module.default || module)
    }
  }

  if (throwNotFoundError) {
    throw new Error(\`[inertia-plugin]: Page "\${name}" not found\`)
  }
}`
}
