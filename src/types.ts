export interface Options {
  appPath?: string
  namespaces?: Record<string, string | string[]>[]
  separator?: string
  extension?: string
  ssr?: boolean
}

export type ResolvedOptions = Required<Exclude<Options, 'namespaces'>> & {
  namespaces: Record<string, string[]>
}
