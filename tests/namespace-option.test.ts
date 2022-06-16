import path from 'path'
import { describe, expect, it, vi } from 'vitest'
import { createComposer, createNpm } from '../src/page-loader/namespace-option'

describe('page-loader', () => {
  const cwd = path.resolve(process.cwd(), 'tests')

  it('resolve NPM namespace', () => {
    const spy = vi.spyOn(process, 'cwd')
    spy.mockReturnValue('/home/inertia-plugin')

    const npm = createNpm(cwd)
    const namespace = npm('my-plugin2', 'test_node_modules')

    expect(namespace).toMatchSnapshot()
  })

  it('resolve Composer namespace', () => {
    const composer = createComposer(cwd)
    const namespace = composer('ycs77/my-php-package', 'test_vendor')

    expect(namespace).toMatchSnapshot()
  })
})
