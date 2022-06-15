/// <reference types="vite/client" />

declare module '~inertia' {
  export function resolvePluginPage<T = any>(name: string): Promise<T>;
}
