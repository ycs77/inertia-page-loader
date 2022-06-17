import path from 'path'
import { describe, expect, it } from 'vitest'
import { generateNamespacesCode } from '../src/page-loader/generate-namespaces'
import type { Namespaces, ResolvedOptions } from '../src/types'

describe('generate namespaces', () => {
  const baseOptions = <ResolvedOptions>{
    cwd: path.resolve(process.cwd(), 'tests'),
    namespaces: [],
    separator: '::',
    extension: '.vue',
    import: false,
    ssr: false,
  }

  const namespaces = <Namespaces>[
    { MyPackage1: 'test_node_modules/my-plugin1/Pages' },
    { MyPackage2: 'test_node_modules/my-plugin2/other-pages' },
    { MyPhpPackage: 'test_vendor/ycs77/my-php-package/resources/js/Pages' },
  ]

  it('simple options', () => {
    const namespacesCode = generateNamespacesCode(baseOptions, { framework: 'vite' })

    expect(namespacesCode).toMatchSnapshot()
  })

  it('namespaces with vite', () => {
    const options = <ResolvedOptions>{
      ...baseOptions,
      namespaces,
    }

    const namespacesCode = generateNamespacesCode(options, { framework: 'vite' })

    expect(namespacesCode).toMatchSnapshot()
  })

  it('vite with ssr', () => {
    const options = <ResolvedOptions>{
      ...baseOptions,
      namespaces,
      ssr: true,
    }

    const namespacesCode = generateNamespacesCode(options, { framework: 'vite' })

    expect(namespacesCode).toMatchSnapshot()
  })

  it('namespaces with webpack', () => {
    const options = <ResolvedOptions>{
      ...baseOptions,
      namespaces,
      extension: '',
    }

    const namespacesCode = generateNamespacesCode(options, { framework: 'webpack' })

    expect(namespacesCode).toMatchSnapshot()
  })

  it('webpack with import', () => {
    const options = <ResolvedOptions>{
      ...baseOptions,
      namespaces,
      extension: '',
      import: true,
    }

    const namespacesCode = generateNamespacesCode(options, { framework: 'webpack' })

    expect(namespacesCode).toMatchSnapshot()
  })
})
