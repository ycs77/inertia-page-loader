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

export type Namespace = Record<string, string | string[]>
export type ResolvedNamespace = Record<string, string[]>
export type NamespacesAry = Namespace[]
export interface NamespacesArgs {
  npm(pkg: string, dir: string): Namespace
  composer(pkg: string, dir: string): Namespace
}
export type Namespaces = NamespacesAry | ((args: NamespacesArgs) => NamespacesAry)
