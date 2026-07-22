import { assetFormSelectors as sel } from '@/support/selectors/asset.selectors'
import type { AssetData } from '@/fixtures/data-builders/asset.builder'

export class CreateAssetScreen {
  public readonly route = '/portal_service/listing_assets/new'

  public assertLoaded(): void {
    cy.location('pathname').should('include', this.route)
    cy.get(sel.tombo).should('be.visible')
  }

  public fillForm(asset: AssetData, tombo: string, serial: string): void {
    cy.get(sel.type).select(asset.type)
    cy.get(sel.brand).clear().type(asset.brand)
    cy.get(sel.model).clear().type(asset.model)
    cy.get(sel.serial).clear().type(serial)
    cy.get(sel.tombo).clear().type(tombo)
    cy.get(sel.acquisition).select(asset.acquisition)
    cy.get(sel.specification).clear().type(asset.specification)
  }

  public save(): void {
    cy.get(sel.body).then(($body) => {
      if ($body.find(sel.saveInput).length > 0) {
        cy.get(sel.saveInput).click()
        return
      }

      cy.contains(sel.saveButton, 'Salvar').click()
    })
  }
}
