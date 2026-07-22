import { bondsByAreaReportSelectors as sel } from '@/support/selectors/report.selectors'

export class BondsByAreaReportScreen {
  public readonly route = '/portal_service/reports/assignments_by_area'

  public open(): void {
    cy.visit(this.route)
  }

  public assertLoaded(): void {
    cy.location('pathname').should('include', this.route)

    cy.get(sel.title).should('be.visible').and('contain.text', 'Atribuições por Área/Subárea')

    cy.get(sel.syntheticRadio).should('exist')
    cy.get(sel.analyticRadio).should('exist')
    cy.get(sel.area).should('be.visible')
    cy.get(sel.subarea).should('be.visible')
    cy.get(sel.searchButton).should('be.visible')
    cy.get(sel.generateButton).should('be.visible')
  }

  public selectSyntheticType(): void {
    cy.get(sel.syntheticRadio).check()
  }

  public selectAnalyticType(): void {
    cy.get(sel.analyticRadio).check()
  }

  public assertSyntheticSelected(): void {
    cy.get(sel.syntheticRadio).should('be.checked')
    cy.get(sel.analyticRadio).should('not.be.checked')
  }

  public assertAnalyticSelected(): void {
    cy.get(sel.analyticRadio).should('be.checked')
    cy.get(sel.syntheticRadio).should('not.be.checked')
  }

  public selectArea(area: string): void {
    cy.get(sel.area).select(area)
  }

  public selectSubarea(subarea: string): void {
    cy.get(sel.subarea).select(subarea)
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

  public assertAnalyticResultColumns(): void {
    cy.get(sel.title).should('be.visible').and('contain.text', 'Atribuições por Área/Subárea')
    cy.contains('Relatório Analítico').should('be.visible')
    cy.contains('Área/Subárea').should('exist')
    cy.contains('Atribuições').should('exist')
    cy.get('table').should('exist')
    this.assertScreenStaysValid()
  }

  public assertRenderedResult(): void {
    cy.get(sel.title).should('be.visible').and('contain.text', 'Atribuições por Área/Subárea')

    cy.contains('Total de Atribuições').should('be.visible')
    cy.contains('Atribuições por Modalidade').should('be.visible')
    cy.contains('Atribuições por Colaboradores').should('be.visible')
    cy.contains('Atribuições por Termo Responsabilidade').should('be.visible')
    cy.contains('Atribuições por Termo Empréstimo').should('be.visible')
    cy.contains('Atribuições por Sistema Operacional').should('be.visible')
    cy.contains('Atribuições por Pacote Office').should('be.visible')

    cy.get('#chart-1 canvas').should('be.visible')
    cy.get('#chart-2 canvas').should('be.visible')
    cy.get('#chart-3 canvas').should('be.visible')
    cy.get('#chart-4 canvas').should('be.visible')
    cy.get('#chart-5 canvas').should('be.visible')
    cy.get('#chart-6 canvas').should('be.visible')

    cy.get('table.table-bordered').should('have.length.at.least', 6)
    this.assertScreenStaysValid()
  }
}
