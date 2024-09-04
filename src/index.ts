import { type UnpluginContextMeta, createUnplugin } from 'unplugin'
import { pageLoader } from './page'
import type { Options, ResolvedOptions } from './types'

const ids = [
  '/~inertia',
  '~inertia',
]

function resolveOptions(options: Options, meta: UnpluginContextMeta) {
  let extensions = options.extensions
  if (meta.framework === 'vite' && !extensions) {
    extensions = 'vue'
  } else if (meta.framework === 'webpack' && Array.isArray(extensions)) {
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

export default createUnplugin<Options>((userOptions, meta) => {
  const options = resolveOptions(userOptions || {}, meta)

  return {
    name: 'inertia-page-loader',
    enforce: 'pre',
    resolveId(id) {
      if (id.startsWith(ids[1])) {
        return id.replace(ids[1], ids[0])
      }
    },
    load(id: string) {
      if (id.startsWith(ids[0])) {
        const code = pageLoader(options, meta)
        return {
          code,
          map: { version: 3, mappings: '', sources: [] } as any,
        }
      }
    },
  }
})
