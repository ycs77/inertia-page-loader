declare module '~inertia' {
  export function resolvePage<T = any>(resolver: (name: string) => any, transformPage?: (page: T) => T): (name: string) => any
  export function resolvePluginPage<T = any>(name: string): Promise<T>
  export function resolveVitePage<T = any>(name: string, pages: Record<string, any>, throwNotFoundError?: boolean): T
}
