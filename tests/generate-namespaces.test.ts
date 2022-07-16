import path from 'path'
import { describe, expect, it } from 'vitest'
import { generateNamespacesCode } from '../src/page/generate-namespaces'
import type { Namespaces, ResolvedOptions } from '../src/types'

describe('generate namespaces', () => {
  const baseOptions = <ResolvedOptions>{
    cwd: path.join(process.cwd(), 'tests'),
    namespaces: [],
    separator: '::',
    extensions: ['vue'],
    import: false,
    ssr: false,
  }

  const namespaces = <Namespaces>[
    { 'my-package-1': 'test_node_modules/my-plugin1/src/Pages' },
    { 'my-package-2': 'test_node_modules/my-plugin2/src/other-pages' },
    { 'my-php-package': 'test_vendor/ycs77/my-php-package/resources/js/Pages' },
  ]

  it('simple options', () => {
    const code = generateNamespacesCode(baseOptions, { framework: 'vite' })

    expect(code.importsCode).toMatchInlineSnapshot('""')
    expect(code.namespacesCode).toMatchInlineSnapshot(`
      "{
            }"
    `)
  })

  it('namespaces with vite', () => {
    const options = <ResolvedOptions>{
      ...baseOptions,
      namespaces,
    }

    const code = generateNamespacesCode(options, { framework: 'vite' })

    expect(code.importsCode).toMatchInlineSnapshot('""')
    expect(code.namespacesCode).toMatchInlineSnapshot(`
      "{
              'my-package-1': [
                name => resolveVitePage(name, {
                  \\"/test_node_modules/my-plugin1/src/Pages/Page3.vue\\": () => import(\\"/test_node_modules/my-plugin1/src/Pages/Page3.vue\\"),
                }, false),
              ],
              'my-package-2': [
                name => resolveVitePage(name, {
                  \\"/test_node_modules/my-plugin2/src/other-pages/Page222.vue\\": () => import(\\"/test_node_modules/my-plugin2/src/other-pages/Page222.vue\\"),
                  \\"/test_node_modules/my-plugin2/src/other-pages/Page223.vue\\": () => import(\\"/test_node_modules/my-plugin2/src/other-pages/Page223.vue\\"),
                }, false),
              ],
              'my-php-package': [
                name => resolveVitePage(name, {
                  \\"/test_vendor/ycs77/my-php-package/resources/js/Pages/PhpPackagePage.vue\\": () => import(\\"/test_vendor/ycs77/my-php-package/resources/js/Pages/PhpPackagePage.vue\\"),
                }, false),
              ],
            }"
    `)
  })

  it('vite with ssr', () => {
    const options = <ResolvedOptions>{
      ...baseOptions,
      namespaces,
      ssr: true,
    }

    const code = generateNamespacesCode(options, { framework: 'vite' })

    expect(code.importsCode).toMatchInlineSnapshot(`
      "import __import_page_0__ from '/test_node_modules/my-plugin1/src/Pages/Page3.vue'
      import __import_page_1__ from '/test_node_modules/my-plugin2/src/other-pages/Page222.vue'
      import __import_page_2__ from '/test_node_modules/my-plugin2/src/other-pages/Page223.vue'
      import __import_page_3__ from '/test_vendor/ycs77/my-php-package/resources/js/Pages/PhpPackagePage.vue'"
    `)
    expect(code.namespacesCode).toMatchInlineSnapshot(`
      "{
              'my-package-1': [
                name => resolveVitePage(name, {
                  \\"/test_node_modules/my-plugin1/src/Pages/Page3.vue\\": () => import(__import_page_0__),
                }, false),
              ],
              'my-package-2': [
                name => resolveVitePage(name, {
                  \\"/test_node_modules/my-plugin2/src/other-pages/Page222.vue\\": () => import(__import_page_1__),
                  \\"/test_node_modules/my-plugin2/src/other-pages/Page223.vue\\": () => import(__import_page_2__),
                }, false),
              ],
              'my-php-package': [
                name => resolveVitePage(name, {
                  \\"/test_vendor/ycs77/my-php-package/resources/js/Pages/PhpPackagePage.vue\\": () => import(__import_page_3__),
                }, false),
              ],
            }"
    `)
  })

  it('namespaces with webpack', () => {
    const options = <ResolvedOptions>{
      ...baseOptions,
      namespaces,
      extensions: [''],
    }

    const code = generateNamespacesCode(options, { framework: 'webpack' })

    expect(code.importsCode).toMatchInlineSnapshot('""')
    expect(code.namespacesCode).toMatchInlineSnapshot(`
      "{
              'my-package-1': [
                name => require(\`../test_node_modules/my-plugin1/src/Pages/\${name}\`),
              ],
              'my-package-2': [
                name => require(\`../test_node_modules/my-plugin2/src/other-pages/\${name}\`),
              ],
              'my-php-package': [
                name => require(\`../test_vendor/ycs77/my-php-package/resources/js/Pages/\${name}\`),
              ],
            }"
    `)
  })

  it('webpack with import', () => {
    const options = <ResolvedOptions>{
      ...baseOptions,
      namespaces,
      extensions: [''],
      import: true,
    }

    const code = generateNamespacesCode(options, { framework: 'webpack' })

    expect(code.importsCode).toMatchInlineSnapshot('""')
    expect(code.namespacesCode).toMatchInlineSnapshot(`
      "{
              'my-package-1': [
                name => import(\`../test_node_modules/my-plugin1/src/Pages/\${name}\`),
              ],
              'my-package-2': [
                name => import(\`../test_node_modules/my-plugin2/src/other-pages/\${name}\`),
              ],
              'my-php-package': [
                name => import(\`../test_vendor/ycs77/my-php-package/resources/js/Pages/\${name}\`),
              ],
            }"
    `)
  })
})
