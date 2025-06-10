import type { PageResolver } from '../types'

export default class InertiaPages {
  private _namespaces: Record<string, PageResolver | PageResolver[]>[] = []

  addNamespace(namespace: string, resolver: PageResolver | PageResolver[]): this {
    this._namespaces.push({ [namespace]: resolver })
    return this
  }

  get namespaces(): Record<string, PageResolver | PageResolver[]>[] {
    return this._namespaces
  }
}
