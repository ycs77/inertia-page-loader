import Debug from 'debug'
import { type GetPageFilesOptions, getPageFiles } from './files'

const debug = {
  pages: Debug('inertia-page-loader:module:import:pages'),
  imports: Debug('inertia-page-loader:module:import:imports'),
}

export interface GenerateImportGlobCodeOptions extends GetPageFilesOptions {
  /**
   * The imported page number of start.
   */
  start?: number

  /**
   * Whether the module is eagerly loaded.
   */
  eager?: boolean
}

export function generateImportGlobCode(pattern: string, options: GenerateImportGlobCodeOptions = {}) {
  const { eager = false } = options
  let start = options.start ?? 0

  const files = getPageFiles(pattern, options).map(file => {
    // remove '/' and './'
    file = file.replace(/^(\/|\.\/)/, '')
    if (!file.startsWith('.')) {
      file = `/${file}`
    }
    return file
  })

  const imporetedModules: Record<string, string> = {}

  let pages = files.map(file => {
    if (eager) {
      imporetedModules[file] = `__import_page_${start}__`
      start++
      return `            "${file}": () => import(${imporetedModules[file]}),\n`
    }
    return `            "${file}": () => import("${file}"),\n`
  }).join('')
  pages = `{\n${pages}          }`

  debug.pages(pages)

  let imports = ''
  if (eager) {
    imports = files.map(file => `import ${imporetedModules[file]} from '${file}'`).join('\n')
  }

  debug.imports(imports)

  return { imports, pages, start }
}
