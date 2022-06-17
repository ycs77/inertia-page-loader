import path from 'path'
import { normalizePath } from 'vite'
import { describe, expect, it } from 'vitest'
import { createComposer, createNpm } from '../src/page-loader/namespace-option'

describe('namespace option', () => {
  const cwd = normalizePath(path.resolve(process.cwd(), 'tests'))

  it('resolve NPM namespace', () => {
    const npm = createNpm(cwd)
    const namespace = npm('my-plugin2', 'test_node_modules')

    expect(namespace).toMatchInlineSnapshot(`
{
  "MyPackage2": "test_node_modules/my-plugin2/other-pages",
}
`)
  })

  it('resolve Composer namespace', () => {
    const composer = createComposer(cwd)
    const namespace = composer('ycs77/my-php-package', 'test_vendor')

    expect(namespace).toMatchInlineSnapshot(`
{
  "MyPhpPackage": "test_vendor/ycs77/my-php-package/resources/js/Pages",
}
`)
  })
})
