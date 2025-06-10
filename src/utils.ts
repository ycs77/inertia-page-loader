import type { GenerateNamespacesCodeContextMeta } from './types'

export function isViteLike(framework: GenerateNamespacesCodeContextMeta['framework']): boolean {
  return ['vite', 'rolldown', 'farm'].includes(framework)
}

export function isRollupLike(framework: GenerateNamespacesCodeContextMeta['framework']): boolean {
  return ['rollup', 'vite', 'rolldown', 'farm'].includes(framework)
}

export function isWebpackLike(framework: GenerateNamespacesCodeContextMeta['framework']): boolean {
  return ['webpack', 'rspack'].includes(framework)
}
