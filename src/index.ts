import fs from 'fs'
import path from 'path'
import { createUnplugin } from 'unplugin'
import { ids } from './plugin'
import type { Options, ResolvedOptions } from './types'

function resolveOptions(options: Options = {}) {
  options = Object.assign({
    appPath: '',
    namespaces: [],
    separator: '::',
    extension: '',
    ssr: false,
  }, options)

  // @ts-ignore
  options.namespaces = formatNamespaces(options.namespaces!)

  return options as ResolvedOptions
}

export default createUnplugin<Options>((userOptions, meta) => {
  const options = resolveOptions(userOptions)

  return {
    name: 'inertia-plugin',
    enforce: 'pre',
    resolveId(id) {
      if (id.startsWith(ids[1])) {
        return id.replace(ids[1], ids[0])
      }
    },
    load(id: string) {
      if (id.startsWith(ids[0])) {
        const namespacesCode = Object.keys(options.namespaces).map(namespace => {
          const modules = options.namespaces[namespace]

          let code = `'${namespace}': [`
          if (meta.framework === 'vite') {
            modules.forEach(mod => {
              code += `() => resolvePageWithVite(page, import.meta.${!options.ssr ? 'glob' : 'globEager'}('/${resolvePagesDir(options.appPath, mod, false)}/**/*${options.extension}'), false),`
            })
          } else {
            modules.forEach(mod => {
              code += `() => require(\`${resolvePagesDir(options.appPath, mod)}/\${page}${options.extension}\`),`
            })
          }
          code += '],'

          return code
        }).join('')

        const code = `
export function resolvePage(resolver) {
  return async name => await resolvePluginPage(name) ?? resolver(name)
}

export function resolvePluginPage(name) {
  if (name.includes('${options.separator}')) {
    const [namespace, page] = name.split('${options.separator}')
    if (namespace && page) {
      const namespaces = {${namespacesCode}}
      for (const importPages of namespaces[namespace]) {
        if (importPages && typeof importPages === 'function') {
          return importPages()
        }
      }
      throw new Error(\`inertia-plugin: page not found: \${name}\`)
    }
  }
}

export function resolvePageWithVite(name, pages, throwNotFoundError = true) {
  for (const path in pages) {
    if (path.endsWith(\`\${name.replace('.', '/')}${options.extension}\`)) {
      return typeof pages[path] === 'function'
        ? pages[path]()
        : pages[path]
    }
  }

  if (throwNotFoundError) {
    throw new Error(\`inertia-plugin: page not found: \${name}\`)
  }
}`

        return {
          code,
          map: { version: 3, mappings: '', sources: [] } as any,
        }
      }
    },
  }
})

function formatNamespaces(namespaces: Record<string, string | string[]>[]) {
  const output = {} as Record<string, string[]>
  for (const obj of namespaces) {
    for (const key of Object.keys(obj)) {
      output[key] = [...obj[key]]
    }
  }
  return output
}

function getAppPath(appPath?: string) {
  function resolveAppPath(appPath: string) {
    const appFullPath = path
      .resolve(process.cwd(), appPath)
      .replaceAll('\\', '/')

    if (fs.existsSync(appFullPath)) {
      return appFullPath
    }
  }

  if (appPath) {
    const appFullPath = resolveAppPath(appPath)
    if (appFullPath) return appFullPath
    throw new Error(`inertia-plugin: app file is not exists: ${appFullPath}`)
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
  throw new Error(`inertia-plugin: app file is not exists.`)
}

function resolvePagesDir(appPath: string, dir: string, prefix: boolean = true) {
  const rootDir = path.dirname(appPath)
  const pagesDir = path.resolve(
    process.cwd(),
    dir
      .replace(/^\.\//, '')
      .replace(/\/$/, '')
  )

  if (!fs.existsSync(pagesDir)) {
    throw new Error(`inertia-plugin: pages dir is not exists: ${pagesDir}`)
  }

  const relativePath = path
    .relative(rootDir, pagesDir)
    .replaceAll('\\', '/')

  const relativePrefix = prefix
    ? (/^\.?\.\//.test(relativePath) ? '' : './')
    : ''

  return relativePrefix + relativePath
}
