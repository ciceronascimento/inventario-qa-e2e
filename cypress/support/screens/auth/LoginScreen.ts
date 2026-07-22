import { loginSelectors as sel } from '@/support/selectors/login.selectors'

export class LoginScreen {
  public readonly route = '/admins/sign_in'

  public open(): void {
    cy.visit(this.route)
  }

  public assertLoaded(): void {
    cy.location('pathname').should('include', this.route)
    cy.get(sel.form).should('be.visible')
    cy.get(sel.email).should('be.visible')
    cy.get(sel.password).should('be.visible')
    cy.get(sel.submit).should('be.visible')
  }

  public typeEmail(email: string): void {
    cy.get(sel.email).clear().type(email)
  }

  public typePassword(password: string): void {
    cy.get(sel.password).clear().type(password, { log: false })
  }

  public clickSubmit(): void {
    cy.get(sel.submit).click()
  }

  public signIn(email: string, password: string): void {
    this.typeEmail(email)
    this.typePassword(password)
    this.clickSubmit()
  }

  public assertAuthenticated(): void {
    cy.location('pathname').should('not.include', this.route)
    cy.get(sel.userMenu).should('be.visible')
  }

  public signOut(): void {
    cy.get('body').then(($body) => {
      if ($body.find(sel.userMenu).length === 0) {
        cy.visit('/portal_service/bonds')
      }
    })

    cy.get(sel.userMenu).should('be.visible').click()
    cy.contains(sel.signOutLink, 'Sair').click()
  }

  public assertBackToLogin(): void {
    cy.location('pathname').should('include', this.route)
    cy.get(sel.form).should('be.visible')
  }
}
