import { bondListSelectors as sel } from '@/support/selectors/bond.selectors'
import type { BondData } from '@/fixtures/data-builders/bond.builder'

export class BondListScreen {
  public readonly route = '/portal_service/bonds'

  public open(): void {
    cy.visit(this.route)
  }

  public assertLoaded(): void {
    cy.location('pathname').should('include', this.route)
    cy.contains(sel.title, 'Atribuições').should('be.visible')
    cy.get(sel.newLink).should('exist')
  }

  public clickNewBond(): void {
    cy.get(sel.newLink).click()
  }

  public openGenerateTermsModal(): void {
    cy.get(sel.generateTermsButton).should('be.visible').click()
  }

  public filterByTombo(tombo: string): void {
    cy.get(sel.tomboFilterContainer).click({ force: true })
    cy.get(sel.select2OpenSearch).clear().type(tombo)
    cy.contains(sel.select2Options, tombo).click()
  }

  public filterByAutomatedTombo(): void {
    this.filterByTombo('AUTO')
  }

  public selectFirstBondWithAutomatedTombo(): void {
    this.assertBondWithAutomatedTombo()

    cy.contains(sel.rows, 'AUTO')
      .should('be.visible')
      .within(() => {
        cy.get(sel.rowCheckbox).check({ force: true })
      })
  }

  public editFirstBondWithAutomatedTombo(): void {
    this.assertBondWithAutomatedTombo()

    cy.contains(sel.rows, 'AUTO')
      .should('be.visible')
      .within(() => {
        this.openEditFromRowLink()
      })
  }

  public assertTable(): void {
    cy.get(sel.table).should('be.visible')
    cy.get(sel.rows).should('have.length.greaterThan', 0)
  }

  public assertBondWithAutomatedTombo(): void {
    this.assertTable()
    cy.contains(sel.rows, 'AUTO').should('be.visible')
  }

  public assertBondRegistered(observation: string): void {
    cy.contains(sel.table, observation).should('be.visible')
  }

  public assertSuccessMessage(bond?: BondData): void {
    if (!bond) {
      this.assertGenericSuccessMessage()
      return
    }

    cy.get(sel.successMessage)
      .should('be.visible')
      .and(($message) => {
        expect($message.text()).to.contain(`Ativos vinculados a: ${bond.collaborator}, Parabéns!`)
      })
  }

  public assertGenericSuccessMessage(): void {
    cy.get(sel.successMessage)
      .should('be.visible')
      .and(($message) => {
        expect($message.text().toLowerCase()).to.match(/sucesso|atualiz|alterad|parab/)
      })
  }

  public assertBondInTable(bond: BondData): void {
    cy.contains(sel.rows, bond.observation)
      .should('be.visible')
      .within(() => {
        cy.contains(bond.area).should('be.visible')
        cy.contains(bond.subarea).should('be.visible')
        cy.contains(bond.modality).should('be.visible')

        if (bond.collaborator) {
          cy.contains(bond.collaborator).should('be.visible')
        }
      })
  }

  public assertLinkedAssetInTable(bond: BondData): void {
    cy.then(() => {
      if (!bond.assetTombo) {
        throw new Error('Tombo do ativo nao foi definido na massa de cadastro da atribuicao.')
      }

      this.filterByTombo(bond.assetTombo)
      this.assertBondInTable(bond)
    })
  }

  public assertBackToList(): void {
    cy.location('pathname').should('include', this.route)
    cy.location('pathname').should('not.include', '/edit')
    cy.get(sel.table).should('be.visible')
  }

  private openEditFromRowLink(): void {
    cy.get(sel.editAction)
      .invoke('attr', 'href')
      .then((href) => {
        if (!href) {
          throw new Error('Link de edicao da atribuicao nao possui href.')
        }

        cy.visit(href)
      })
  }
}
