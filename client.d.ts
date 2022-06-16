declare module '~inertia' {
  export function resolvePage<T = any>(resolver: T): T;
  export function resolvePluginPage<T = any>(name: string): Promise<T>;
  export function resolvePageWithVite<T = any>(name: string, pages: Record<string, any>, throwNotFoundError?: boolean): T | undefined;
}
