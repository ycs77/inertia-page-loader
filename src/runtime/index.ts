import InertiaPlugin from './plugin'

if (!window.InertiaPlugin) {
  // @ts-ignore
  window.InertiaPlugin = new InertiaPlugin()
}

export { InertiaPlugin }
