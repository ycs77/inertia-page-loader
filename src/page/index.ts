import type { UnpluginContextMeta } from 'unplugin'
import type { ResolvedOptions } from '../types'
import { generateNamespacesCode } from './generate-namespaces'

export function pageLoader(options: ResolvedOptions, meta: UnpluginContextMeta) {
  const { namespacesCode, importsCode } = generateNamespacesCode(options, meta)

  return `
${importsCode}

export function resolvePage(resolver, transformPage) {
  return async name => {
    let page = await resolvePluginPage(name)
    if (!page) {
      page = ${
        meta.framework === 'vite'
          ? 'await resolveVitePage(name, await resolver(name.replace(\'.\', \'/\')))'
          : 'await resolver(name.replace(\'.\', \'/\'))'
      }
    }
    page = page.default || page
    if (transformPage) {
      page = transformPage(page, name)
    }
    return page
  }
}

export async function resolvePluginPage(name) {
  if (name.includes('${options.separator}')) {
    const [namespace, page] = name.split('${options.separator}')
    const meta = { framework: '${meta.framework}' }

    if (namespace && page) {
      const namespaces = ${namespacesCode}

      /* Load namespaces on runtime from window global variable. */
      if (window.InertiaPlugin) {
        for (const namespaceGroup of window.InertiaPlugin.namespaces) {
          for (const namespace in namespaceGroup) {
            namespaces[namespace] = (namespaces[namespace] || []).concat(namespaceGroup[namespace])
          }
        }
      }

      if (!namespaces[namespace]) {
        throw new Error(\`[inertia-plugin]: Namespace "\${namespace}" not found\`)
      }

      for (const importedNamespace of namespaces[namespace]) {
        if (importedNamespace && typeof importedNamespace === 'function') {
          return await importedNamespace(page, meta)
        }
      }
    }
  }
}

export async function resolveVitePage(name, pages, throwNotFoundError = true) {
  for (const path in pages) {
    if (${JSON.stringify(options.extensions)}.some(ext => path.endsWith(\`\${name.replaceAll('.', '/')}.\${ext}\`))) {
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
