import fs from 'node:fs'
import path from 'node:path'
import type { Namespace, Namespaces, ResolvedNamespace } from '../types'

export interface PackageNamespaceExtractorOptions {
  name: string
  filename: string
  dir: string
  cwd: string
  parse: (content: string) => Namespace
}

export function createPackageNamespaceExtractor(options: PackageNamespaceExtractorOptions) {
  return (pkg: string, dir: string = options.dir) => {
    const fullpath = path.resolve(options.cwd, dir, pkg, options.filename)
    if (!fs.existsSync(fullpath)) {
      throw new Error(`[inertia-page-loader]: The ${options.name} "${pkg}" does not exist`)
    }

    const namespaces = options.parse(fs.readFileSync(fullpath, { encoding: 'utf-8' }))
    if (!namespaces) {
      throw new Error(`[inertia-page-loader]: The ${options.filename} parse error of "${pkg}"`)
    }

    for (const namespace in namespaces) {
      const mod = namespaces[namespace]
      if (Array.isArray(mod)) {
        namespaces[namespace] = mod.map(mod => path.join(dir, pkg, mod).replaceAll('\\', '/'))
      } else {
        namespaces[namespace] = path.join(dir, pkg, mod).replaceAll('\\', '/')
      }
    }
    return namespaces
  }
}

export function createNpm(cwd: string = process.cwd()) {
  return createPackageNamespaceExtractor({
    name: 'NPM package',
    filename: 'package.json',
    cwd,
    dir: 'node_modules',
    parse(content) {
      return JSON.parse(content).inertia
    },
  })
}

export function createComposer(cwd: string = process.cwd()) {
  return createPackageNamespaceExtractor({
    name: 'Composer package',
    filename: 'composer.json',
    cwd,
    dir: 'vendor',
    parse(content) {
      return JSON.parse(content).extra.inertia
    },
  })
}

export function resolveNamespaces(cwd: string, namespaces: Namespaces): ResolvedNamespace {
  const resolvedNamespaces = typeof namespaces === 'function'
    ? namespaces({
      npm: createNpm(cwd),
      composer: createComposer(cwd),
    })
    : namespaces

  const output = {} as ResolvedNamespace

  for (const obj of resolvedNamespaces) {
    for (const key of Object.keys(obj)) {
      output[key] = Array.isArray(obj[key])
        ? (obj[key] as string[])
        : ([obj[key]] as string[])
    }
  }

  return output
}
