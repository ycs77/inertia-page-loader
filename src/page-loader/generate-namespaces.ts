import fs from 'fs'
import path from 'path'
import type { UnpluginContextMeta } from 'unplugin'
import type { ResolvedOptions } from '../types'
import { resolveNamespaces } from './namespace-option'

export function generateNamespacesCode(options: ResolvedOptions, meta: UnpluginContextMeta) {
  const cwd = options.cwd
  const appPath = getAppPath(options.appPath)
  const namespaces = resolveNamespaces(cwd, options.namespaces)

  let namespacesCode = Object.keys(namespaces).map(namespace => {
    const modules = namespaces[namespace]

    let code = `\n        '${namespace}': [`
    if (meta.framework === 'vite') {
      modules.forEach(mod => {
        code += `\n          () => resolvePageWithVite(page, import.meta.${!options.ssr ? 'glob' : 'globEager'}('/${resolvePagesDir(cwd, appPath, mod, false)}/**/*${options.extension}'), false),`
      })
    } else {
      modules.forEach(mod => {
        code += `\n          () => require(\`${resolvePagesDir(cwd, appPath, mod)}/\${page}${options.extension}\`),`
      })
    }
    code += '\n        ],'

    return code
  }).join('')

  namespacesCode += '\n      '

  return `{${namespacesCode}}`
}

export function getAppPath(appPath?: string) {
  const resolveAppPath = (appPath: string) => {
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

export function resolvePagesDir(cwd: string, appPath: string, dir: string, prefix = true) {
  const rootDir = path.dirname(appPath)
  const pagesDir = path.resolve(
    cwd,
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
