import { bondFormSelectors as sel } from '@/support/selectors/bond.selectors'
import type { BondData } from '@/fixtures/data-builders/bond.builder'

export class CreateBondScreen {
  public readonly route = '/portal_service/bonds/new'

  public open(): void {
    cy.visit(this.route)
  }

  public assertLoaded(): void {
    cy.location('pathname').should('include', this.route)
    cy.contains(sel.cardTitle, 'Nova Atribuição').should('be.visible')
  }

  public selectArea(area: string): void {
    cy.get(sel.area).select(area)
  }

  public selectSubarea(subarea: string): void {
    cy.get(sel.subarea).select(subarea)
  }

  public chooseCollaboratorResponsible(): void {
    cy.get(sel.responsibleCollaborator).check({ force: true })
  }

  public chooseNoCollaboratorResponsible(): void {
    cy.get(sel.responsibleNone).click({ force: true })
    cy.get(sel.responsibleNone).should('be.checked')
  }

  public selectCollaborator(collaborator: string): void {
    cy.get(sel.collaborator).then(($select) => {
      const hasOption = [...$select.find(sel.option)].some(
        (option) => option.textContent?.trim() === collaborator,
      )

      if (hasOption) {
        cy.wrap($select).select(collaborator, { force: true })
        return
      }

      cy.get(sel.collaboratorContainer).click()
      cy.get(sel.select2Options).contains(collaborator).click()
    })
  }

  public selectAttendedBy(attendedBy: string): void {
    cy.get(sel.attendedBy).select(attendedBy)
  }

  public selectModality(modality: string): void {
    if (modality === 'Presencial') {
      cy.get(sel.modalityInPerson).check({ force: true })
      return
    }

    if (modality === 'Home Office') {
      cy.get(sel.modalityHomeOffice).check({ force: true })
      return
    }

    throw new Error(`Modalidade invalida: ${modality}`)
  }

  public fillRequiredFields(bond: BondData): void {
    this.selectArea(bond.area)
    this.selectSubarea(bond.subarea)
    this.chooseCollaboratorResponsible()
    this.selectCollaborator(bond.collaborator ?? '')
    this.selectAttendedBy(bond.attendedBy)
    this.selectModality(bond.modality)
    this.fillObservation(bond.observation)
  }

  public fillRequiredFieldsWithoutCollaborator(bond: BondData): void {
    this.selectArea(bond.area)
    this.selectSubarea(bond.subarea)
    this.chooseNoCollaboratorResponsible()
    this.fillObservation(bond.observation)
    this.selectAttendedBy(bond.attendedBy)
    this.selectModality(bond.modality)
  }

  public enableOfficePackage(): void {
    cy.get(sel.officeCheckbox).check({ force: true })
  }

  public disableOfficePackage(): void {
    cy.get(sel.officeCheckbox).uncheck({ force: true })
  }

  public assertOfficePackageDisabled(): void {
    cy.get(sel.officeSelect).should('be.disabled')
  }

  public assertOfficePackageEnabled(): void {
    cy.get(sel.officeSelect).should('not.be.disabled')
  }

  public fillObservation(observation: string): void {
    cy.get(sel.observation).clear().type(observation)
  }

  public addAsset(): void {
    cy.get(sel.addAssetButton).click()
    cy.get(sel.assetSelect).should('exist')
  }

  public linkFirstAsset(bond: BondData): void {
    this.addAsset()
    this.selectFirstAssetByPrefix('AUTO').then((assetTombo) => {
      bond.assetTombo = assetTombo
    })
    this.selectFirstAssetDescription()
    this.selectFirstAssetStatus()
  }

  public linkFirstAutomatedAsset(bond: BondData): void {
    this.linkFirstAsset(bond)
  }

  public save(): void {
    cy.get(sel.body).then(($body) => {
      if ($body.find(sel.saveInput).length > 0) {
        cy.get(sel.saveInput).click({ force: true })
        return
      }

      cy.contains(sel.saveButton, 'Salvar').click({ force: true })
    })
  }

  public cancel(): void {
    cy.contains(sel.cancelButton, 'Cancelar').click()
  }

  public closeOpenDropdowns(): void {
    cy.get(sel.observation).click({ force: true })
  }

  public assertRequiredIndicators(): void {
    cy.get(sel.requiredMark).should('contain.text', '*')
  }

  public assertHasRequiredFields(): void {
    cy.get(sel.area).should('have.attr', 'required')
    cy.get(sel.subarea).should('have.attr', 'required')
    cy.get(sel.collaborator).should('have.attr', 'required')
  }

  public assertFormStaysOpen(): void {
    cy.location('pathname').should('include', '/portal_service/bonds')
    cy.get(sel.area).should('exist')
    cy.get(sel.subarea).should('exist')
  }

  private selectFirstAssetDescription(): void {
    this.selectFirstValidOption(sel.assetDescription)
  }

  private selectFirstAssetByPrefix(prefix: string): Cypress.Chainable<string> {
    this.openAssetSearch()
    cy.get(sel.select2OpenSearch).clear().type(prefix)

    return cy.get(sel.select2Options).then(($options) => {
      const option = [...$options].find((item) =>
        (item.textContent ?? '').trim().toUpperCase().startsWith(prefix.toUpperCase()),
      )
      const tombo = option?.textContent?.trim()

      if (!option || !tombo) {
        throw new Error(`Nenhum ativo com tombo iniciado por ${prefix} foi encontrado.`)
      }

      return cy
        .wrap(option)
        .click()
        .then(() =>
          cy
            .get(sel.assetSelect)
            .last()
            .should('not.have.value', '')
            .then(() => tombo),
        )
    })
  }

  private openAssetSearch(): void {
    cy.get(sel.assetSelect)
      .last()
      .should('exist')
      .then(($select) => {
        cy.wrap($select)
          .next('.select2-container')
          .find('.select2-selection')
          .click({ force: true })
      })
  }

  private selectFirstAssetStatus(): void {
    cy.get(sel.responsibleNone).then(($noCollaborator) => {
      const shouldLinkWithoutUse = $noCollaborator.is(':checked')

      this.selectDefaultAssetStatus(shouldLinkWithoutUse)
    })
  }

  private selectDefaultAssetStatus(shouldLinkWithoutUse: boolean): void {
    const priorityOrder = shouldLinkWithoutUse
      ? ['DISPONÍVEL', 'EM MANUTENÇÃO', 'COM DEFEITO', 'EM USO']
      : ['EM USO', 'DISPONÍVEL', 'COM DEFEITO']

    cy.get(sel.assetStatus)
      .last()
      .then(($select) => {
        const options = [...$select.find(sel.option)] as HTMLOptionElement[]
        const validOptions = options.filter((o) => o.value !== '')

        if (validOptions.length === 0) {
          throw new Error(`Nenhuma opcao valida encontrada para o seletor ${sel.assetStatus}`)
        }

        let chosenValue: string | undefined

        for (const label of priorityOrder) {
          const match = validOptions.find((o) => o.textContent?.trim().toUpperCase() === label)

          if (match) {
            chosenValue = match.value
            break
          }
        }

        chosenValue = chosenValue ?? validOptions[0].value
        cy.wrap($select).invoke('val', chosenValue).trigger('change', { force: true })
      })
  }

  private selectFirstValidOption(selector: string): void {
    cy.get(selector)
      .last()
      .then(($select) => {
        cy.wrap($select)
          .find('option:not([value=""])')
          .first()
          .then(($option) => {
            const value = ($option[0] as HTMLOptionElement).value

            if (!value) {
              throw new Error(`Nenhuma opcao valida encontrada para o seletor ${selector}`)
            }

            cy.wrap($select).invoke('val', value).trigger('change', { force: true })
          })
      })
  }
}
