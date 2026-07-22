import { termSelectors as sel } from '@/support/selectors/term.selectors'

export class GenerateTermsScreen {
  public assertModalVisible(): void {
    cy.get(sel.modal)
      .should('be.visible')
      .within(() => {
        cy.get(sel.modalTitle).should('be.visible').and('contain.text', 'Gerar Termos')
        cy.get(sel.liabilityRadio).should('exist')
        cy.get(sel.loanRadio).should('exist')
        cy.get(sel.generateButton).should('be.visible')
      })
    cy.get(sel.closeButton).should('exist')
  }

  public assertTermTypesAreExclusive(): void {
    cy.get(sel.liabilityRadio).check({ force: true })
    cy.get(sel.liabilityRadio).should('be.checked')
    cy.get(sel.loanRadio).should('not.be.checked')

    cy.get(sel.loanRadio).check({ force: true })
    cy.get(sel.loanRadio).should('be.checked')
    cy.get(sel.liabilityRadio).should('not.be.checked')
  }

  public selectLiabilityTerm(): void {
    cy.get(sel.liabilityRadio).check({ force: true })
    cy.get(sel.liabilityRadio).should('be.checked')
    cy.get(sel.loanRadio).should('not.be.checked')
  }

  public selectLoanTerm(): void {
    cy.get(sel.loanRadio).check({ force: true })
    cy.get(sel.loanRadio).should('be.checked')
    cy.get(sel.liabilityRadio).should('not.be.checked')
  }

  public generateTerm(): void {
    cy.get(sel.generateButton).should('be.visible').and('not.be.disabled').click()
  }

  public assertScreenStaysValidAfterGeneration(): void {
    cy.get(sel.modal).should('be.visible')
    cy.get(sel.generateButton).should('be.visible')
    cy.get('body').should('not.contain.text', 'Erro')
    cy.get('body').should('not.contain.text', 'Exception')
    cy.get('body').should('not.contain.text', 'undefined')
  }

  public closeModal(): void {
    cy.get(sel.modal).invoke('removeClass', 'show').invoke('css', 'display', 'none')
    cy.get('body').invoke('removeClass', 'modal-open')
    cy.get('.modal-backdrop').then(($backdrop) => {
      if ($backdrop.length > 0) {
        $backdrop.remove()
      }
    })
  }

  public assertModalClosed(): void {
    cy.get(sel.modal).should('not.have.class', 'show')
  }
}
