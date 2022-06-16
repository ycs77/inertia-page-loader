import { createUnplugin } from 'unplugin'
import { pageLoader } from './page-loader'
import type { Options, ResolvedOptions } from './types'

const ids = [
  '/~inertia',
  '~inertia',
]

function resolveOptions(options: Options = {}) {
  return Object.assign({
    appPath: '',
    namespaces: [],
    separator: '::',
    extension: '',
    ssr: false,
  }, options) as ResolvedOptions
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
        const code = pageLoader(options, meta)
        return {
          code,
          map: { version: 3, mappings: '', sources: [] } as any,
        }
      }
    },
  }
})
