import type { GenerateNamespacesCodeContextMeta } from './types'

export function isViteLike(framework: GenerateNamespacesCodeContextMeta['framework']) {
  return ['vite', 'rolldown', 'farm'].includes(framework)
}

export function isRollupLike(framework: GenerateNamespacesCodeContextMeta['framework']) {
  return ['rollup', 'vite', 'rolldown', 'farm'].includes(framework)
}

export function isWebpackLike(framework: GenerateNamespacesCodeContextMeta['framework']) {
  return ['webpack', 'rspack'].includes(framework)
}
