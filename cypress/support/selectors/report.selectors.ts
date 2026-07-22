export const assetMovementReportSelectors = {
  title: 'h1',
  area: '#area_name',
  initialDate: '#initial_date',
  finalDate: '#final_date',
  searchButton: 'input[type="submit"][value="Pesquisar"]',
  generateButton: 'a[href="/portal_service/reports/pdf_create"] button',
  pdfLink: 'a[href*="pdf_create"]',
}

export const bondsByAreaReportSelectors = {
  title: 'h1',
  syntheticRadio: '#type_syntetic',
  analyticRadio: '#type_analytic',
  area: '#search_area',
  subarea: '#search_subarea',
  searchButton: 'input[type="submit"][value="Pesquisar"]',
  generateButton: 'a[href="/portal_service/reports/assignments_by_area_pdf"] button',
}
