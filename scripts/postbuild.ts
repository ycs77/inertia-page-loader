import { basename, resolve } from 'path'
import { promises as fs } from 'fs'
import fg from 'fast-glob'
import chalk from 'chalk'

async function run() {
  const files = await fg('*.js', {
    ignore: ['chunk-*'],
    absolute: true,
    cwd: resolve(__dirname, '../dist'),
  })
  for (const file of files) {
    console.log(chalk.cyan.inverse(' POST '), `Fix ${basename(file)}`)

    // fix cjs exports
    let code = await fs.readFile(file, 'utf8')
    if (!code.includes('module.exports.default = module.exports;') &&
      code.includes('exports.default = ')
    ) {
      code = code.replace('exports.default =', 'module.exports =')
      code += 'module.exports.default = module.exports;\n'
      await fs.writeFile(file, code)
    }

    if (!/runtime\.*/.test(file)) {
      // generate submodule .d.ts redirecting
      const name = basename(file, '.js')
      await fs.writeFile(`${name}.d.ts`, `export { default } from './dist/${name}'\n`)
    }
  }
}

run()
