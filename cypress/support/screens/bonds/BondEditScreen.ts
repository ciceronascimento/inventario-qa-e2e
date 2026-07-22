import { bondEditSelectors as sel } from '@/support/selectors/bond.selectors'
import type { BondEditData } from '@/fixtures/data-builders/bond.builder'

export class BondEditScreen {
  public readonly route = '/portal_service/bonds'

  public assertLoaded(): void {
    cy.location('pathname').should('include', this.route)
    cy.location('pathname').should('include', '/edit')
    cy.get(sel.area).should('exist')
    cy.get(sel.subarea).should('exist')
    cy.get(sel.observation).should('exist')
  }

  public assertDataLoaded(): void {
    cy.get(sel.area).find(sel.selectedOption).should('not.have.value', '')
    cy.get(sel.subarea).find(sel.selectedOption).should('not.have.value', '')
    cy.get(`${sel.responsibleCollaborator}, ${sel.responsibleNone}`)
      .filter(':checked')
      .should('have.length', 1)
    cy.get(sel.attendedBy).should('be.visible')
    cy.get(`${sel.modalityInPerson}, ${sel.modalityHomeOffice}`)
      .filter(':checked')
      .should('have.length', 1)
    cy.get(sel.operatingSystem).should('be.visible')
    cy.get(sel.officeCheckbox).should('exist')
    cy.get(sel.observation).should('be.visible')
  }

  public selectArea(area: string): void {
    this.selectOptionByText(sel.area, area)
  }

  public selectSubarea(subarea: string): void {
    this.selectOptionByText(sel.subarea, subarea)
  }

  public selectAttendedBy(attendedBy: string): void {
    this.selectOptionByText(sel.attendedBy, attendedBy)
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

  public selectOperatingSystem(operatingSystem: string): void {
    this.selectOptionByText(sel.operatingSystem, operatingSystem)
  }

  public fillObservation(observation: string): void {
    cy.get(sel.observation).clear().type(observation)
  }

  public fillRequiredFields(bond: BondEditData): void {
    this.selectArea(bond.area)
    this.selectSubarea(bond.subarea)
    this.selectAttendedBy(bond.attendedBy)
    this.selectModality(bond.modality)

    if (bond.observation) {
      this.fillObservation(bond.observation)
    }
  }

  public fillAllFields(bond: BondEditData): void {
    this.fillRequiredFields(bond)

    if (bond.operatingSystem) {
      this.selectOperatingSystem(bond.operatingSystem)
    }

    this.fillOfficePackageUsage(bond)
  }

  public addAsset(): void {
    cy.get(sel.addAssetButton).click({ force: true })
    cy.get(sel.assetSelect).should('exist')
  }

  public linkFirstAutomatedAsset(bond: BondEditData): void {
    this.addAsset()
    this.selectFirstAssetByPrefix('AUTO').then((assetTombo) => {
      bond.assetTombo = assetTombo
    })
    this.selectFirstAssetDescription()
    this.selectFirstNewAssetStatus()
  }

  public selectFirstAssetStatus(status: string): void {
    cy.get(sel.assetRows)
      .first()
      .within(() => {
        cy.get(sel.assetStatusSelect).select(status, { force: true })
      })
  }

  public fillFirstAssetDefectDescription(description: string): void {
    cy.get(sel.assetRows)
      .first()
      .within(() => {
        cy.get(sel.defectDescriptionInput).clear().type(description)
      })
  }

  public removeFirstAsset(): void {
    cy.get(sel.assetRows).first().find(sel.removeAssetButton).click({ force: true })
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

  public cancel(): void {
    cy.contains(sel.cancelButton, 'Cancelar').click()
  }

  public assertHasRequiredFields(): void {
    cy.get(sel.area).should('have.attr', 'required')
    cy.get(sel.subarea).should('have.attr', 'required')
  }

  public assertFormStaysOpen(): void {
    cy.location('pathname').should('include', this.route)
    cy.get(sel.area).should('exist')
    cy.get(sel.subarea).should('exist')
  }

  public assertLinkedAssetsSection(): void {
    cy.get(sel.assetRows).should('have.length.greaterThan', 0)
    cy.get(sel.assetRows)
      .first()
      .within(() => {
        cy.get(sel.assetSelect).should('exist').and('not.have.value', '')
        cy.get(sel.assetDescription).should('exist').and('not.have.value', '')
        cy.get(sel.assetStatusSelect).should('exist').and('not.have.value', '')
      })
  }

  public assertLeftEditRoute(): void {
    cy.location('pathname').should('include', this.route)
    cy.location('pathname').should('not.include', '/edit')
    cy.get(sel.observation).should('be.visible')
  }

  public assertObservation(observation: string): void {
    cy.get(sel.observation).should('have.value', observation)
  }

  private selectFirstAssetDescription(): void {
    this.selectFirstValidOption(sel.assetDescription)
  }

  private selectFirstAssetByPrefix(prefix: string): Cypress.Chainable<string> {
    return cy
      .get(sel.assetSelect)
      .last()
      .find(sel.option)
      .then(($options) => {
        const option = [...$options].find((item) =>
          (item.textContent ?? '').trim().toUpperCase().startsWith(prefix.toUpperCase()),
        ) as HTMLOptionElement | undefined
        const tombo = option?.textContent?.trim()
        const value = option?.value

        if (!tombo || !value) {
          throw new Error(`Nenhum ativo com tombo iniciado por ${prefix} foi encontrado.`)
        }

        return cy
          .get(sel.assetSelect)
          .last()
          .invoke('val', value)
          .trigger('change', { force: true })
          .then(() =>
            cy
              .get(sel.assetSelect)
              .last()
              .should('not.have.value', '')
              .then(() => tombo),
          )
      })
  }

  private selectFirstNewAssetStatus(): void {
    this.selectDefaultNewAssetStatus()
  }

  private fillOfficePackageUsage(bond: BondEditData): void {
    if (bond.usesOfficePackage) {
      cy.get(sel.officeCheckbox).check({ force: true })
      cy.get(sel.officeSelect).should('not.be.disabled')
      cy.get(sel.officeSelect).select(bond.officePackage ?? '')
      return
    }

    cy.get(sel.officeCheckbox).uncheck({ force: true })
    cy.get(sel.officeSelect).should('be.disabled')
  }

  private selectDefaultNewAssetStatus(): void {
    const statusPriority = ['EM USO', 'DISPONÍVEL', 'COM DEFEITO']

    cy.get(sel.newAssetStatus)
      .last()
      .then(($select) => {
        const options = [...$select.find(sel.option)] as HTMLOptionElement[]
        const validOptions = options.filter((o) => o.value !== '')

        if (validOptions.length === 0) {
          throw new Error(`Nenhuma opcao valida encontrada para o seletor ${sel.newAssetStatus}`)
        }

        let chosenValue: string | undefined

        for (const label of statusPriority) {
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

  private selectOptionByText(selector: string, text: string): void {
    cy.get(selector)
      .should('exist')
      .then(($select) => {
        const option = [...$select.find(sel.option)].find(
          (item) => item.textContent?.trim() === text,
        ) as HTMLOptionElement | undefined
        const value = option?.value

        if (!value) {
          throw new Error(`Opcao ${text} nao encontrada para o seletor ${selector}`)
        }

        cy.wrap($select).invoke('val', value).trigger('change', { force: true })
      })
  }
}
