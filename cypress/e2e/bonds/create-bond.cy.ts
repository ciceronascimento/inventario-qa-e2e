import { buildBondForCollaborator, buildBondWithoutCollaborator } from '@/fixtures/data-builders/bond.builder'
import { BondListScreen, CreateBondScreen } from '@/support/screens'

describe('Cadastrar Atribuicao', () => {
  const bondListScreen = new BondListScreen()
  const createBondScreen = new CreateBondScreen()

  beforeEach(() => {
    cy.signIn()

    bondListScreen.open()
    bondListScreen.assertLoaded()
    bondListScreen.clickNewBond()

    createBondScreen.assertLoaded()
  })

  it(
    'libera o campo Pacote Office apenas com a opcao marcada',
    { tags: ['@extended', '@negative', '@bond-new', '@bond-new-1'] },
    () => {
      createBondScreen.assertOfficePackageDisabled()
      createBondScreen.enableOfficePackage()
      createBondScreen.assertOfficePackageEnabled()
      createBondScreen.disableOfficePackage()
      createBondScreen.assertOfficePackageDisabled()
    },
  )

  it(
    'bloqueia o salvamento quando os campos obrigatorios estao vazios',
    { tags: ['@extended', '@negative', '@bond-new', '@bond-new-2'] },
    () => {
      createBondScreen.save()
      createBondScreen.assertFormStaysOpen()
      createBondScreen.assertRequiredIndicators()
      createBondScreen.assertHasRequiredFields()
    },
  )

  it(
    'cria uma atribuicao para colaborador com ativo vinculado',
    { tags: ['@regression', '@positive', '@bond-new', '@bond-new-3'] },
    () => {
      const bond = buildBondForCollaborator()

      createBondScreen.fillRequiredFields(bond)
      createBondScreen.linkFirstAutomatedAsset(bond)
      createBondScreen.save()

      bondListScreen.assertBackToList()
      bondListScreen.assertSuccessMessage(bond)
      bondListScreen.assertLinkedAssetInTable(bond)
    },
  )

  it(
    'descarta os dados informados ao cancelar o cadastro',
    { tags: ['@extended', '@negative', '@bond-new', '@bond-new-4'] },
    () => {
      const bond = buildBondForCollaborator()

      createBondScreen.fillRequiredFields(bond)
      createBondScreen.cancel()

      bondListScreen.assertBackToList()
    },
  )

  it(
    'cria uma atribuicao sem colaborador por subarea',
    { tags: ['@regression', '@positive', '@bond-new', '@bond-new-5'] },
    () => {
      const bond = buildBondWithoutCollaborator()

      createBondScreen.fillRequiredFieldsWithoutCollaborator(bond)
      createBondScreen.linkFirstAutomatedAsset(bond)
      createBondScreen.closeOpenDropdowns()
      createBondScreen.save()

      bondListScreen.assertBackToList()
      bondListScreen.assertGenericSuccessMessage()
    },
  )
})
