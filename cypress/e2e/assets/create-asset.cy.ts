import { buildCameraAsset, buildStabilizerAsset } from '@/fixtures/data-builders/asset.builder'
import { AssetListScreen, CreateAssetScreen } from '@/support/screens'

describe('Cadastrar Ativo', () => {
  const assetListScreen = new AssetListScreen()
  const createAssetScreen = new CreateAssetScreen()

  beforeEach(() => {
    cy.signIn()

    assetListScreen.open()
    assetListScreen.assertLoaded()
    assetListScreen.clickNewAsset()

    createAssetScreen.assertLoaded()
  })

  it(
    'registra um ativo do tipo camera',
    { tags: ['@regression', '@positive', '@asset', '@asset-1'] },
    () => {
      const { asset, tombo, serial } = buildCameraAsset()

      createAssetScreen.fillForm(asset, tombo, serial)
      createAssetScreen.save()

      assetListScreen.assertBackToList()
      assetListScreen.assertSuccessMessage()
      assetListScreen.assertAssetRegistered(tombo)
    },
  )

  it(
    'registra um ativo do tipo estabilizador',
    { tags: ['@regression', '@positive', '@asset', '@asset-2'] },
    () => {
      const { asset, tombo, serial } = buildStabilizerAsset()

      createAssetScreen.fillForm(asset, tombo, serial)
      createAssetScreen.save()

      assetListScreen.assertBackToList()
      assetListScreen.assertSuccessMessage()
      assetListScreen.assertAssetRegistered(tombo)
    },
  )
})
