declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var InertiaPlugin: InstanceType<typeof import('./runtime/plugin')['default']>
}

export interface Options {
  /**
   * Current work directory.
   *
   * Default: process.cwd()
   */
  cwd?: string

  /**
   * Define namespace mapping.
   *
   * Default: []
   */
  namespaces?: Namespaces

  /**
   * Namespace separator.
   *
   * Default: '::'
   */
  separator?: string

  /**
   * Module extension.
   *
   * Default: '' (Defaults to '.vue' if not set and used with vite.)
   */
  extension?: string

  /**
   * Use `import()` to load pages for webpack, default is using `require()`.
   * Only for webpack.
   *
   * Default: false
   */
  import?: boolean

  /**
   * Enable SSR mode.
   *
   * Default: false
   */
  ssr?: boolean
}

export type ResolvedOptions = Required<Options>

export type PageResolver<T = any> = (name: string) => T | Promise<T>

export type Namespace = Record<string, string | string[]>
export type ResolvedNamespace = Record<string, string[]>
export interface NamespacesArgs {
  npm(pkg: string, dir: string): Namespace
  composer(pkg: string, dir: string): Namespace
}
export type Namespaces = Namespace[] | ((args: NamespacesArgs) => Namespace[])
