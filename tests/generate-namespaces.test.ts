import path from 'path'
import { describe, expect, it } from 'vitest'
import { generateNamespacesCode } from '../src/page-loader/generate-namespaces'
import type { ResolvedOptions } from '../src/types'

describe('generate-namespaces', () => {
  const baseOptions = <ResolvedOptions>{
    cwd: path.resolve(process.cwd(), 'tests'),
    appPath: 'tests/fixtures/app.ts',
    namespaces: [],
    separator: '::',
    extension: '.vue',
    ssr: false,
  }

  it('simple options', () => {
    const namespacesCode = generateNamespacesCode(baseOptions, { framework: 'vite' })

    expect(namespacesCode).toMatchSnapshot()
  })

  it('some namespaces', () => {
    const options = <ResolvedOptions>{
      ...baseOptions,
      namespaces: [
        { MyPackage1: 'test_node_modules/my-plugin1/Pages' },
        { MyPackage2: 'test_node_modules/my-plugin2/other-pages' },
        { MyPhpPackage: 'test_vendor/ycs77/my-php-package/resources/js/Pages' },
      ],
    }

    const namespacesCode = generateNamespacesCode(options, { framework: 'vite' })

    expect(namespacesCode).toMatchSnapshot()
  })

  it('ssr', () => {
    const options = <ResolvedOptions>{
      ...baseOptions,
      namespaces: [
        { MyPackage1: 'test_node_modules/my-plugin1/Pages' },
        { MyPackage2: 'test_node_modules/my-plugin2/other-pages' },
        { MyPhpPackage: 'test_vendor/ycs77/my-php-package/resources/js/Pages' },
      ],
      ssr: true,
    }

    const namespacesCode = generateNamespacesCode(options, { framework: 'vite' })

    expect(namespacesCode).toMatchSnapshot()
  })
})
