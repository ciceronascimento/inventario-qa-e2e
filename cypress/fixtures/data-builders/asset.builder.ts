const buildIdentifier = (): string => `${Date.now()}-${Math.floor(Math.random() * 1000)}`

export interface AssetData {
  type: string
  brand: string
  model: string
  serial: string
  tomboPrefix: string
  acquisition: string
  specification: string
}

export interface GeneratedAsset {
  asset: AssetData
  tombo: string
  serial: string
}

export interface AssetSeed {
  camera: AssetData
  stabilizer: AssetData
}

export const assetSeed = {
  camera: {
    type: 'CAMERA',
    brand: 'Teste QA',
    model: 'Camera automatizada',
    serial: 'SER-CAMERA',
    tomboPrefix: 'AUTO-CAM',
    acquisition: '00/0001',
    specification: 'Camera cadastrada por teste automatizado',
  },
  stabilizer: {
    type: 'ESTABILIZADOR',
    brand: 'Teste QA',
    model: 'Estabilizador automatizado',
    serial: 'SER-EST',
    tomboPrefix: 'AUTO-EST',
    acquisition: '00/0001',
    specification: 'Estabilizador cadastrado por teste automatizado',
  },
} satisfies AssetSeed

const buildGeneratedAsset = (asset: AssetData): GeneratedAsset => {
  const identifier = buildIdentifier()

  return {
    asset,
    tombo: `${asset.tomboPrefix}-${identifier}`,
    serial: `${asset.serial}-${identifier}`,
  }
}

export const buildCameraAsset = (): GeneratedAsset => buildGeneratedAsset(assetSeed.camera)

export const buildStabilizerAsset = (): GeneratedAsset => buildGeneratedAsset(assetSeed.stabilizer)
