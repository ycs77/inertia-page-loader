import InertiaPages from './plugin'

if (!window.InertiaPages) {
  // @ts-ignore
  window.InertiaPages = new InertiaPages()
}

export { InertiaPages }
