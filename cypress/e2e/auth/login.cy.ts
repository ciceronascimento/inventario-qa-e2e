import { LoginScreen } from '@/support/screens'

describe('Realizar Login', () => {
  const loginScreen = new LoginScreen()

  beforeEach(() => {
    loginScreen.open()
    loginScreen.assertLoaded()
  })

  it(
    'autentica o usuario quando as credenciais sao validas',
    { tags: ['@regression', '@positive', '@auth', '@auth-1'] },
    () => {
      loginScreen.signIn(Cypress.env('userEmail'), Cypress.env('userPassword'))

      loginScreen.assertAuthenticated()
    },
  )

  it(
    'encerra a sessao ao sair do sistema',
    { tags: ['@regression', '@positive', '@auth', '@auth-2'] },
    () => {
      cy.signIn()

      loginScreen.signOut()
      loginScreen.assertBackToLogin()
    },
  )
})
