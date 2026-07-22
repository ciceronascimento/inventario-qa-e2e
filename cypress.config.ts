import { defineConfig } from 'cypress'
import { plugin as cypressGrepPlugin } from '@cypress/grep/plugin'
import mochawesomeReporterPlugin from 'cypress-mochawesome-reporter/plugin'
import { settings } from '@/support/env/config'
import webpackPreprocessor from '@cypress/webpack-preprocessor'
import path from 'path'

export default defineConfig({
  viewportWidth: 1366,
  viewportHeight: 768,
  defaultCommandTimeout: 15000,
  requestTimeout: 15000,
  responseTimeout: 30000,
  video: true,
  screenshotOnRunFailure: true,
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  downloadsFolder: 'cypress/downloads',
  chromeWebSecurity: false,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports/mochawesome',
    charts: true,
    reportPageTitle: 'Inventario QA - Suite E2E',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    overwrite: false,
    html: true,
    json: true,
    saveJson: true,
  },

  e2e: {
    baseUrl: settings.baseUrl,
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',

    setupNodeEvents(on, config) {
      on(
        'file:preprocessor',
        webpackPreprocessor({
          webpackOptions: {
            resolve: {
              extensions: ['.ts', '.js'],
              alias: { '@': path.resolve(__dirname, 'cypress') },
            },
            module: {
              rules: [
                {
                  test: /\.ts$/,
                  use: [{ loader: 'esbuild-loader', options: { target: 'es2021' } }],
                  exclude: /node_modules/,
                },
              ],
            },
          },
        }),
      )
      cypressGrepPlugin(config)
      mochawesomeReporterPlugin(on)

      config.env = {
        ...config.env,
        userEmail: settings.userEmail,
        userPassword: settings.userPassword,
      }

      return config
    },
  },
})
