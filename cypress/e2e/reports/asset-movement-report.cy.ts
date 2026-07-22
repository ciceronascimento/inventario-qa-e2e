import { AssetMovementReportScreen } from '@/support/screens'

describe('Gerar Relatorio de Movimentacao de Ativos', () => {
  const assetMovementReportScreen = new AssetMovementReportScreen()

  beforeEach(() => {
    cy.signIn()

    assetMovementReportScreen.open()
    assetMovementReportScreen.assertLoaded()
  })

  it(
    'filtra o relatorio de movimentacao de ativos',
    { tags: ['@regression', '@positive', '@report-movement', '@report-movement-1'] },
    () => {
      assetMovementReportScreen.selectArea('JUDICIAL')
      assetMovementReportScreen.fillInitialDate('2026-01-01')
      assetMovementReportScreen.fillFinalDate('2026-12-31')
      assetMovementReportScreen.search()
      assetMovementReportScreen.assertResultOrValidScreenAfterSearch()
    },
  )

  it(
    'exporta o relatorio de movimentacao de ativos',
    { tags: ['@regression', '@positive', '@report-movement', '@report-movement-2'] },
    () => {
      assetMovementReportScreen.selectArea('JUDICIAL')
      assetMovementReportScreen.generateReport()
      assetMovementReportScreen.assertScreenStaysValid()
    },
  )

  it(
    'agrupa os resultados por area com data e quantidade de movimentacoes',
    { tags: ['@extended', '@positive', '@report-movement', '@report-movement-3'] },
    () => {
      assetMovementReportScreen.selectArea('JUDICIAL')
      assetMovementReportScreen.fillInitialDate('2025-01-01')
      assetMovementReportScreen.fillFinalDate('2026-12-31')
      assetMovementReportScreen.search()
      assetMovementReportScreen.assertAreaGroupingInResults('JUDICIAL')
    },
  )

  it(
    'exibe mensagem quando nao ha dados para o periodo selecionado',
    { tags: ['@extended', '@negative', '@report-movement', '@report-movement-4'] },
    () => {
      assetMovementReportScreen.selectArea('JUDICIAL')
      assetMovementReportScreen.fillInitialDate('2000-01-01')
      assetMovementReportScreen.fillFinalDate('2000-12-31')
      assetMovementReportScreen.search()
      assetMovementReportScreen.assertEmptyState()
    },
  )

  it(
    'abre o relatorio PDF em nova aba ao clicar em gerar relatorio',
    { tags: ['@extended', '@positive', '@report-movement', '@report-movement-5'] },
    () => {
      assetMovementReportScreen.assertPdfLinkOpensInNewTab()
    },
  )
})
