import { LoginScreen } from '@/support/screens'

Cypress.Commands.add('signIn', () => {
  cy.session('usuario-autenticado', () => {
    const loginScreen = new LoginScreen()

    loginScreen.open()
    loginScreen.signIn(Cypress.env('userEmail'), Cypress.env('userPassword'))

    cy.location('pathname').should('not.include', '/admins/sign_in')
  })
})
