import { basename, dirname, resolve } from 'node:path'
import { promises as fs } from 'node:fs'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import chalk from 'chalk'

async function run(): Promise<void> {
  const files = await fg('*.cjs', {
    ignore: ['chunk-*'],
    absolute: true,
    cwd: resolve(dirname(fileURLToPath(import.meta.url)), '../dist'),
  })
  for (const file of files) {
    console.log(chalk.cyan.inverse(' POST '), `Fix ${basename(file)}`)

    // fix cjs exports
    let code = await fs.readFile(file, 'utf8')
    if (code.includes('exports.default = ') && !code.includes('module.exports = exports.default;')) {
      code += 'module.exports = exports.default;\n'
      await fs.writeFile(file, code)
    }
  }
}

run()
