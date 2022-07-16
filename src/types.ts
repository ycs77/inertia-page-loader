declare global {
  // @ts-ignore
  // eslint-disable-next-line vars-on-top, no-var
  var InertiaPlugin: InstanceType<typeof import('./runtime/plugin')['default']>
}

export interface Options {
  /**
   * Current work directory.
   *
   * @default process.cwd()
   */
  cwd?: string

  /**
   * Define namespace mapping.
   *
   * @default []
   */
  namespaces?: Namespaces

  /**
   * Namespace separator.
   *
   * @default '::'
   */
  separator?: string

  /**
   * Module extensions.
   *
   * vite:
   * @type {string|string[]}
   * @default 'vue'
   *
   * webpack:
   * @type {string}
   * @default ''
   */
  extensions?: string | string[]

  /**
   * Module extensions.
   *
   * vite:
   * @type {string|string[]}
   * @default 'vue'
   *
   * webpack:
   * @type {string}
   * @default ''
   *
   * @deprecated Use `extensions` instead
   */
  extension?: string | string[]

  /**
   * Use `import()` to load pages for webpack, default is using `require()`.
   * Only for webpack.
   *
   * @default false
   */
  import?: boolean

  /**
   * Enable SSR mode.
   *
   * @default false
   */
  ssr?: boolean
}

export type ResolvedOptions = Required<Omit<Options, 'extensions' | 'extension'>> & {
  /**
   * Module extensions.
   */
  extensions: string[]
}

export type PageResolver<T = any> = (name: string) => T | Promise<T>

export type Namespace = Record<string, string | string[]>
export type ResolvedNamespace = Record<string, string[]>
export interface NamespacesArgs {
  npm(pkg: string, dir: string): Namespace
  composer(pkg: string, dir: string): Namespace
}
export type Namespaces = Namespace[] | ((args: NamespacesArgs) => Namespace[])
