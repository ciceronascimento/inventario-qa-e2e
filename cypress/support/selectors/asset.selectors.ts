export const assetListSelectors = {
  title: 'h1, h2, h3, .card-header',
  table: 'table',
  rows: 'tbody tr',
  newLink: 'a[href="/portal_service/listing_assets/new"]',
  searchInput: 'input[placeholder="Pesquisar..."]',
  searchButton: 'button[type="submit"], button',
  systemMessage: '.toast, .toast-message, .alert, .alert-success, .notice, .flash, [role="alert"]',
}

export const assetFormSelectors = {
  type: '#type',
  brand: '#asset_brand',
  model: '#asset_model',
  serial: '#asset_serial',
  tombo: '#asset_tombo',
  acquisition: '#asset_acquisition_id',
  specification: '#asset_specification',
  saveInput: 'input[type="submit"][value="Salvar"]',
  saveButton: 'button',
  body: 'body',
}
