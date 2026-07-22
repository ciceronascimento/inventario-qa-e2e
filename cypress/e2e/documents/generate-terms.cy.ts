import { BondListScreen, GenerateTermsScreen } from '@/support/screens'

describe('Gerar Termos', () => {
  const bondListScreen = new BondListScreen()
  const generateTermsScreen = new GenerateTermsScreen()

  beforeEach(() => {
    cy.signIn()

    bondListScreen.open()
    bondListScreen.assertLoaded()
    bondListScreen.filterByAutomatedTombo()
    bondListScreen.assertBondWithAutomatedTombo()
    bondListScreen.selectFirstBondWithAutomatedTombo()
    bondListScreen.openGenerateTermsModal()

    generateTermsScreen.assertModalVisible()
  })

  it(
    'permite selecionar apenas um tipo de termo por vez',
    { tags: ['@extended', '@positive', '@term', '@term-3'] },
    () => {
      generateTermsScreen.assertTermTypesAreExclusive()
    },
  )

  it(
    'emite o termo de responsabilidade',
    { tags: ['@regression', '@positive', '@term', '@term-1'] },
    () => {
      generateTermsScreen.selectLiabilityTerm()
      generateTermsScreen.generateTerm()
      generateTermsScreen.assertScreenStaysValidAfterGeneration()
    },
  )

  it(
    'emite o termo de emprestimo',
    { tags: ['@regression', '@positive', '@term', '@term-2'] },
    () => {
      generateTermsScreen.selectLoanTerm()
      generateTermsScreen.generateTerm()
      generateTermsScreen.assertScreenStaysValidAfterGeneration()
    },
  )

  it(
    'fecha o modal ao clicar no botao fechar',
    { tags: ['@extended', '@positive', '@term', '@term-4'] },
    () => {
      generateTermsScreen.closeModal()
      generateTermsScreen.assertModalClosed()
    },
  )
})
