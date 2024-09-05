import { createUnplugin } from 'unplugin'
import type { UnpluginContextMeta, UnpluginFactory } from 'unplugin'
import { pageLoader } from './page'
import { isViteLike, isWebpackLike } from './utils'
import type { Options, ResolvedOptions } from './types'

const ids = [
  '/~inertia',
  '~inertia',
  'virtual:inertia',
  'virtual/inertia',
]

function resolveOptions(options: Options, meta: UnpluginContextMeta) {
  let extensions = options.extensions
  if (isViteLike(meta.framework) && !extensions) {
    extensions = 'vue'
  } else if (isWebpackLike(meta.framework) && Array.isArray(extensions)) {
    extensions = extensions[0]
  }
  extensions = (Array.isArray(extensions) ? extensions : [extensions ?? '']) as string[]
  extensions = extensions.map(ext => ext.replace(/^\./, ''))

  return Object.assign({
    cwd: process.cwd(),
    namespaces: [],
    separator: '::',
    extensions: [''],
    import: false,
    ssr: false,
  }, options, {
    extensions,
  }) as ResolvedOptions
}

export const unpluginFactory: UnpluginFactory<Options | undefined> = (userOptions, meta) => {
  const options = resolveOptions(userOptions || {}, meta)

  return {
    name: 'inertia-page-loader',
    enforce: 'pre',
    resolveId(id) {
      if (ids.includes(id)) {
        return ids[1]
      }
    },
    load(id: string) {
      if (ids.includes(id)) {
        const code = pageLoader(options, meta)
        return {
          code,
          map: { version: 3, mappings: '', sources: [] } as any,
        }
      }
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
