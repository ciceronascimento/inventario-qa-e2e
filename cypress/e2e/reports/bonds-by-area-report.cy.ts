import { BondsByAreaReportScreen } from '@/support/screens'

describe('Gerar Relatorio de Atribuicoes por Area', () => {
  const bondsByAreaReportScreen = new BondsByAreaReportScreen()

  beforeEach(() => {
    cy.signIn()

    bondsByAreaReportScreen.open()
    bondsByAreaReportScreen.assertLoaded()
  })

  it(
    'filtra o relatorio de atribuicoes por area',
    { tags: ['@regression', '@positive', '@report-area', '@report-area-1'] },
    () => {
      bondsByAreaReportScreen.selectSyntheticType()
      bondsByAreaReportScreen.assertSyntheticSelected()
      bondsByAreaReportScreen.selectArea('JUDICIAL')
      bondsByAreaReportScreen.search()
      bondsByAreaReportScreen.assertRenderedResult()
    },
  )

  it(
    'exporta o relatorio de atribuicoes por area',
    { tags: ['@regression', '@positive', '@report-area', '@report-area-2'] },
    () => {
      bondsByAreaReportScreen.selectAnalyticType()
      bondsByAreaReportScreen.assertAnalyticSelected()
      bondsByAreaReportScreen.selectArea('JUDICIAL')
      bondsByAreaReportScreen.generateReport()
      bondsByAreaReportScreen.assertScreenStaysValid()
    },
  )

  it(
    'exibe as colunas do relatorio analitico de atribuicoes por area',
    { tags: ['@extended', '@positive', '@report-area', '@report-area-3'] },
    () => {
      bondsByAreaReportScreen.selectAnalyticType()
      bondsByAreaReportScreen.assertAnalyticSelected()
      bondsByAreaReportScreen.selectArea('JUDICIAL')
      bondsByAreaReportScreen.search()
      bondsByAreaReportScreen.assertAnalyticResultColumns()
    },
  )
})
