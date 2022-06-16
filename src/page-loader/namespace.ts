import fs from 'fs'
import path from 'path'
import type { Namespaces } from '../types'

interface PackageNamespaceExtractorOptions {
  name: string
  filename: string
  dir: string
  parse(content: string): Record<string, string | string[]>
}

function createPackageNamespaceExtractor(options: PackageNamespaceExtractorOptions) {
  return (pkg: string, dir: string = options.dir) => {
    const fullpath = path.resolve(process.cwd(), dir, pkg, options.filename)
    if (!fs.existsSync(fullpath)) {
      throw new Error(`[inertia-plugin]: The ${options.name} "${pkg}" does not exist`)
    }

    const namespaces = options.parse(fs.readFileSync(fullpath, { encoding: 'utf-8' }))
    if (!namespaces) {
      throw new Error(`[inertia-plugin]: The ${options.filename} parse error of "${pkg}"`)
    }

    for (const namespace in namespaces) {
      const mod = namespaces[namespace]
      if (Array.isArray(mod)) {
        namespaces[namespace] = mod.map(mod => path.resolve(dir, pkg, mod))
      } else {
        namespaces[namespace] = path.resolve(dir, pkg, mod)
      }
    }
    return namespaces
  }
}

const npm = createPackageNamespaceExtractor({
  name: 'NPM package',
  filename: 'package.json',
  dir: 'node_modules',
  parse(content) {
    return JSON.parse(content).inertia
  },
})

const composer = createPackageNamespaceExtractor({
  name: 'Composer package',
  filename: 'composer.json',
  dir: 'vendor',
  parse(content) {
    return JSON.parse(content).extra.inertia
  },
})

export function resolveNamespaces(namespaces: Namespaces) {
  const resolvedNamespaces = typeof namespaces === 'function'
    ? namespaces({ npm, composer })
    : namespaces

  const output = {} as Record<string, string[]>

  for (const obj of resolvedNamespaces) {
    for (const key of Object.keys(obj)) {
      output[key] = Array.isArray(obj[key])
        ? (obj[key] as string[])
        : ([obj[key]] as string[])
    }
  }

  return output
}
