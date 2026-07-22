import { assetListSelectors as sel } from '@/support/selectors/asset.selectors'

export class AssetListScreen {
  public readonly route = '/portal_service/listing_assets'

  public open(): void {
    cy.visit(this.route)
  }

  public assertLoaded(): void {
    cy.location('pathname').should('include', this.route)
    cy.contains(sel.title, 'Ativos').should('be.visible')
  }

  public clickNewAsset(): void {
    cy.get(sel.newLink).click()
  }

  public assertBackToList(): void {
    cy.location('pathname').should('include', this.route)
    cy.location('pathname').should('not.include', '/new')
    cy.get(sel.table).should('be.visible')
  }

  public assertSuccessMessage(): void {
    cy.get(sel.systemMessage)
      .should('be.visible')
      .and(($message) => {
        expect($message.text().toLowerCase()).to.match(/sucesso|cadastrad|parab/)
      })
  }

  public assertAssetRegistered(tombo: string): void {
    this.search(tombo)
    cy.contains(sel.rows, tombo).should('be.visible')
  }

  private search(term: string): void {
    cy.get(sel.searchInput).clear().type(term)
    cy.get(sel.searchButton).last().click()
  }
}
