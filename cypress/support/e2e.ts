import '@/support/commands'
import '@/support/types/cypress.d'
import { register as registerCypressGrep } from '@cypress/grep'
import 'cypress-mochawesome-reporter/register'

registerCypressGrep()

Cypress.on('uncaught:exception', (error) => {
  if (
    error.message.includes("Cannot read properties of null (reading 'disabled')") ||
    error.message.includes("Cannot set properties of null (setting 'disabled')")
  ) {
    return false
  }

  return true
})
