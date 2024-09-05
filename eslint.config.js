import ycs77 from '@ycs77/eslint-config'

export default ycs77({
  typescript: true,
  ignores: [
    '**/composer.json',
    '**/*.md',
  ],
})
