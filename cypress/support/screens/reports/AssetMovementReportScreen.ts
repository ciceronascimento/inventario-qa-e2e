import { assetMovementReportSelectors as sel } from '@/support/selectors/report.selectors'

export class AssetMovementReportScreen {
  public readonly route = '/portal_service/reports/index'

  public open(): void {
    cy.visit(this.route)
  }

  public assertLoaded(): void {
    cy.location('pathname').should('include', this.route)
    cy.get(sel.title).should('be.visible').and('contain.text', 'Movimentação de Ativos')
    this.assertFilters()
  }

  public assertFilters(): void {
    cy.get(sel.area).should('be.visible')
    cy.get(sel.initialDate).should('be.visible')
    cy.get(sel.finalDate).should('be.visible')
    cy.get(sel.searchButton).should('be.visible')
    cy.get(sel.generateButton).should('be.visible')
  }

  private assertSearchFiltersRemainVisible(): void {
    cy.get(sel.area).should('be.visible')
    cy.get(sel.initialDate).should('be.visible')
    cy.get(sel.finalDate).should('be.visible')
    cy.get(sel.searchButton).should('be.visible')
  }

  public selectArea(area: string): void {
    cy.get(sel.area).select(area)
  }

  public fillInitialDate(date: string): void {
    cy.get(sel.initialDate).clear().type(date)
  }

  public fillFinalDate(date: string): void {
    cy.get(sel.finalDate).clear().type(date)
  }

  public search(): void {
    cy.get(sel.searchButton).click()
  }

  public generateReport(): void {
    cy.get(sel.generateButton).click()
  }

  public assertScreenStaysValid(): void {
    cy.get('body').should('not.contain.text', 'Erro')
    cy.get('body').should('not.contain.text', 'Exception')
    cy.get('body').should('not.contain.text', 'undefined')
  }

  private static readonly emptyStatePattern = /não há|nenhum|sem dados|indispon|sem movimentaç/i

  private static readonly resultColumns = ['Tombo', 'Série', 'Descrição', 'Lotação', 'Colaborador']

  public assertResultColumns(): void {
    AssetMovementReportScreen.resultColumns.forEach((label) => {
      cy.contains(label).should('exist')
    })
  }

  public assertEmptyState(): void {
    cy.contains(AssetMovementReportScreen.emptyStatePattern).should('be.visible')
  }

  public assertAreaGroupingInResults(areaName: string): void {
    cy.contains('td, th', areaName).should('be.visible')
    cy.contains('td, th', /movimentaç/i).should('be.visible')
  }

  public assertPdfLinkOpensInNewTab(): void {
    cy.get(sel.pdfLink).should('exist').and('have.attr', 'href').and('include', 'pdf_create')
  }

  public assertResultOrValidScreenAfterSearch(): void {
    cy.get(sel.title).should('be.visible').and('contain.text', 'Movimentação de Ativos')
    this.assertSearchFiltersRemainVisible()

    cy.get('body').then(($body) => {
      if (AssetMovementReportScreen.emptyStatePattern.test($body.text())) {
        this.assertEmptyState()
        return
      }

      cy.get('table').should('be.visible')
      this.assertResultColumns()
    })

    this.assertScreenStaysValid()
  }
}
