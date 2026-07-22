import {
  buildAssetReplacementAvailable,
  buildAssetReplacementDefective,
  buildBondEditAllFields,
  buildBondEditRequiredFields,
} from '@/fixtures/data-builders/bond.builder'
import { BondEditScreen, BondListScreen } from '@/support/screens'

describe('Editar Atribuicao', () => {
  const bondListScreen = new BondListScreen()
  const bondEditScreen = new BondEditScreen()

  beforeEach(() => {
    cy.signIn()

    bondListScreen.open()
    bondListScreen.assertLoaded()
    bondListScreen.filterByAutomatedTombo()
    bondListScreen.assertBondWithAutomatedTombo()
    bondListScreen.editFirstBondWithAutomatedTombo()

    bondEditScreen.assertLoaded()
  })

  it(
    'exibe os dados da atribuicao ao abrir a tela de edicao',
    { tags: ['@regression', '@positive', '@bond-edit', '@bond-edit-1'] },
    () => {
      bondEditScreen.assertDataLoaded()
    },
  )

  it(
    'mantem os campos obrigatorios na edicao',
    { tags: ['@extended', '@negative', '@bond-edit', '@bond-edit-2'] },
    () => {
      bondEditScreen.assertHasRequiredFields()
      bondEditScreen.assertFormStaysOpen()
    },
  )

  it(
    'atualiza a atribuicao informando somente os campos obrigatorios',
    { tags: ['@regression', '@positive', '@bond-edit', '@bond-edit-3'] },
    () => {
      const bond = buildBondEditRequiredFields()

      bondEditScreen.fillRequiredFields(bond)
      bondEditScreen.save()

      bondListScreen.assertBackToList()
      bondListScreen.assertSuccessMessage()
    },
  )

  it(
    'atualiza a atribuicao preenchendo o formulario completo',
    { tags: ['@regression', '@positive', '@bond-edit', '@bond-edit-4'] },
    () => {
      const bond = buildBondEditAllFields()

      bondEditScreen.fillAllFields(bond)
      bondEditScreen.save()

      bondListScreen.assertBackToList()
      bondListScreen.assertSuccessMessage()
    },
  )

  it(
    'troca o ativo vinculado a atribuicao',
    { tags: ['@extended', '@positive', '@bond-edit', '@bond-edit-5'] },
    () => {
      const bond = buildAssetReplacementAvailable()

      bondEditScreen.fillRequiredFields(bond)
      bondEditScreen.selectFirstAssetStatus(bond.assetStatus!)
      bondEditScreen.removeFirstAsset()
      bondEditScreen.linkFirstAutomatedAsset(bond)
      bondEditScreen.save()

      bondEditScreen.assertLeftEditRoute()
      bondEditScreen.assertObservation(bond.observation!)
    },
  )

  it(
    'substitui um ativo marcado como defeituoso',
    { tags: ['@extended', '@positive', '@bond-edit', '@bond-edit-6'] },
    () => {
      const bond = buildAssetReplacementDefective()

      bondEditScreen.fillRequiredFields(bond)
      bondEditScreen.selectFirstAssetStatus(bond.assetStatus!)
      bondEditScreen.fillFirstAssetDefectDescription(bond.defectDescription!)
      bondEditScreen.removeFirstAsset()
      bondEditScreen.linkFirstAutomatedAsset(bond)
      bondEditScreen.save()

      bondEditScreen.assertLeftEditRoute()
      bondEditScreen.assertObservation(bond.observation!)
    },
  )

  it(
    'ignora as alteracoes ao cancelar a edicao',
    { tags: ['@extended', '@negative', '@bond-edit', '@bond-edit-7'] },
    () => {
      const bond = buildBondEditRequiredFields()

      bondEditScreen.fillObservation(bond.observation!)
      bondEditScreen.cancel()

      bondListScreen.assertBackToList()
    },
  )

  it(
    'exibe a secao de ativos da atribuicao com status preenchido',
    { tags: ['@extended', '@positive', '@bond-edit', '@bond-edit-8'] },
    () => {
      bondEditScreen.assertLinkedAssetsSection()
    },
  )
})
