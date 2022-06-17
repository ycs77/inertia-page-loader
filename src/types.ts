export interface Options {
  cwd?: string
  namespaces?: Namespaces
  separator?: string
  extension?: string
  import?: boolean
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
