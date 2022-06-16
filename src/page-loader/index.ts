import fs from 'fs'
import path from 'path'
import type { UnpluginContextMeta } from 'unplugin'
import type { ResolvedOptions } from '../types'
import { resolveNamespaces } from './namespace'

export function pageLoader(options: ResolvedOptions, meta: UnpluginContextMeta) {
  const appPath = getAppPath(options.appPath)
  const namespaces = resolveNamespaces(options.namespaces)
  const extension = !options.extension && meta.framework === 'vite' ? '.vue' : options.extension

  let namespacesCode = Object.keys(namespaces).map(namespace => {
    const modules = namespaces[namespace]

    let code = `\n        '${namespace}': [`
    if (meta.framework === 'vite') {
      modules.forEach(mod => {
        code += `\n          () => resolvePageWithVite(page, import.meta.${!options.ssr ? 'glob' : 'globEager'}('/${resolvePagesDir(appPath, mod, false)}/**/*${extension}'), false),`
      })
    } else {
      modules.forEach(mod => {
        code += `\n          () => require(\`${resolvePagesDir(appPath, mod)}/\${page}${extension}\`),`
      })
    }
    code += '\n        ],'
    return code
  }).join('')

  namespacesCode += '\n      '

  return `
export function resolvePage(resolver) {
  return async name => await resolvePluginPage(name) ?? await resolver(name)
}

export async function resolvePluginPage(name) {
  if (name.includes('${options.separator}')) {
    const [namespace, page] = name.split('${options.separator}')
    if (namespace && page) {
      const namespaces = {${namespacesCode}}
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
    if (path.endsWith(\`\${name.replace('.', '/')}${extension}\`)) {
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

function getAppPath(appPath?: string) {
  function resolveAppPath(appPath: string) {
    const appFullPath = path.resolve(process.cwd(), appPath).replaceAll('\\', '/')
    if (fs.existsSync(appFullPath)) {
      return appFullPath
    }
  }

  if (appPath) {
    const appFullPath = resolveAppPath(appPath)
    if (appFullPath) return appFullPath
    throw new Error(`[inertia-plugin]: App file "${appFullPath}" does not exist`)
  }

  for (const appPath of [
    'resources/js/app.js',
    'resources/js/app.ts',
    'resources/js/main.js',
    'resources/js/main.ts',
    'src/app.js',
    'src/app.ts',
    'src/main.js',
    'src/main.ts',
    'app.js',
    'app.ts',
    'main.js',
    'main.ts',
  ]) {
    const appFullPath = resolveAppPath(appPath)
    if (appFullPath) return appFullPath
  }
  throw new Error('[inertia-plugin]: App file does not exist')
}

function resolvePagesDir(appPath: string, dir: string, prefix = true) {
  const rootDir = path.dirname(appPath)
  const pagesDir = path.resolve(
    process.cwd(),
    dir.replace(/^\.\//, '').replace(/\/$/, '')
  )

  if (!fs.existsSync(pagesDir)) {
    throw new Error(`[inertia-plugin]: Pages directory "${pagesDir}" does not exists`)
  }

  const relativePath = path
    .relative(rootDir, pagesDir)
    .replaceAll('\\', '/')

  const relativePrefix = prefix
    ? (/^\.?\.\//.test(relativePath) ? '' : './')
    : ''

  return relativePrefix + relativePath
}
