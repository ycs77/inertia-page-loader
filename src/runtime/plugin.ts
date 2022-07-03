import type { PageResolver } from '../types'

export default class InertiaPlugin {
  private _namespaces: Record<string, PageResolver | PageResolver[]>[] = []

  addNamespace(namespace: string, resolver: PageResolver | PageResolver[]) {
    this._namespaces.push({ [namespace]: resolver })
    return this
  }

  get namespaces() {
    return this._namespaces
  }
}
