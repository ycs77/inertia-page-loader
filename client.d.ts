declare module '~inertia' {
  function resolvePage<T = any>(resolver: (name: string) => any | Promise<any>, transformPage?: (page: T, name: string) => T): (name: string) => any
  function resolvePluginPage<T = any>(name: string): Promise<T>
  function resolveVitePage<T = any>(name: string, pages: Record<string, any>, throwNotFoundError?: boolean): T
}
