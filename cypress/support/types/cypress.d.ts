declare global {
  namespace Cypress {
    interface Chainable {
      signIn(): Chainable<void>
    }
  }
}

export {}
