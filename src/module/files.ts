import { join } from 'path'
import fg from 'fast-glob'
import Debug from 'debug'

const debug = Debug('inertia-plugin:module:files')

export interface GetPageFilesOptions {
  /**
   * The current working directory in which to search.
   */
  cwd?: string

  /**
   * Valid file extensions for page components.
   */
  extensions?: string[]

  /**
   * List of path globs to exclude when resolving pages.
   */
  exclude?: string[]
}

function getIgnore(exclude: string[]) {
  return ['.git', '**/__*__/**', ...exclude]
}

function extsToGlob(extensions: string[]) {
  return extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0] || ''
}

export function getPageFiles(path: string, options: GetPageFilesOptions = {}): string[] {
  const {
    extensions = [''],
    exclude = [],
  } = options

  const ext = extsToGlob(extensions)

  const files = fg.sync(join(path, `**/*.${ext}`).replaceAll('\\', '/'), {
    cwd: options.cwd,
    ignore: getIgnore(exclude),
    onlyFiles: true,
  })

  debug(files)

  return files
}
