declare module 'cypress-mochawesome-reporter/plugin' {
  import type { PluginEvents } from 'cypress'

  const plugin: (on: PluginEvents) => void

  export default plugin
}

declare module '@cypress/grep' {
  export function register(): void
}

declare module '@cypress/grep/plugin' {
  import type { PluginConfigOptions } from 'cypress'

  export function plugin(config: PluginConfigOptions): void
}

declare namespace Cypress {
  interface TestConfigOverrides {
    tags?: string | string[]
  }
}
