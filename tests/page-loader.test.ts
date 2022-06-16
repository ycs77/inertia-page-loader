import path from 'path'
import { describe, expect, it } from 'vitest'
import { pageLoader } from '../src/page-loader'
import type { ResolvedOptions } from '../src/types'

describe('page-loader', () => {
  it('base', () => {
    const options = <ResolvedOptions>{
      cwd: path.resolve(process.cwd(), 'tests'),
      appPath: 'tests/fixtures/app.ts',
      namespaces: [
        { MyPackage1: 'test_node_modules/my-plugin1/Pages' },
        { MyPackage2: 'test_node_modules/my-plugin2/other-pages' },
        { MyPhpPackage: 'test_vendor/ycs77/my-php-package/resources/js/Pages' },
      ],
      separator: '::',
      extension: '.vue',
      ssr: false,
    }

    const inertiaVirtualModule = pageLoader(options, { framework: 'vite' })

    expect(inertiaVirtualModule).toMatchSnapshot()
  })
})
