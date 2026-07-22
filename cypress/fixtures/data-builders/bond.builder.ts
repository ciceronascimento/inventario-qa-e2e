const buildIdentifier = (): string => `${Date.now()}-${Math.floor(Math.random() * 1000)}`

export interface BondData {
  area: string
  subarea: string
  responsibleType: string
  collaborator?: string
  attendedBy: string
  modality: string
  operatingSystem: string
  usesOfficePackage: boolean
  officePackage: string
  observation: string
  assetTombo?: string
}

export interface BondEditData {
  area: string
  subarea: string
  responsibleType: string
  collaborator?: string
  attendedBy: string
  modality: string
  operatingSystem?: string
  usesOfficePackage?: boolean
  officePackage?: string
  observation?: string
  defectDescription?: string
  assetStatus?: string
  assetTombo?: string
}

export interface BondSeed {
  bondForCollaborator: BondData
  bondWithoutCollaborator: BondData
}

export const bondSeed = {
  bondForCollaborator: {
    area: 'JUDICIAL',
    subarea: 'APOIO',
    responsibleType: 'Colaborador',
    collaborator: 'Mariana Oliveira Santos',
    attendedBy: 'Atendente',
    modality: 'Presencial',
    operatingSystem: 'WINDOWS 11 PRO',
    usesOfficePackage: false,
    officePackage: '',
    observation: 'Teste Automatizado - Inventario QA',
  },
  bondWithoutCollaborator: {
    area: 'JUDICIAL',
    subarea: 'APOIO',
    responsibleType: 'Sem Colaborador',
    attendedBy: 'Atendente',
    modality: 'Home Office',
    operatingSystem: 'WINDOWS 10 PRO',
    usesOfficePackage: false,
    officePackage: '',
    observation: 'Teste Automatizado - Inventario QA sem colaborador',
  },
} satisfies BondSeed

export const buildBondForCollaborator = (): BondData => ({
  ...bondSeed.bondForCollaborator,
})

export const buildBondWithoutCollaborator = (): BondData => ({
  ...bondSeed.bondWithoutCollaborator,
})

export const buildBondEditRequiredFields = (): BondEditData => ({
  area: 'JUDICIAL',
  subarea: 'APOIO',
  responsibleType: 'Colaborador',
  collaborator: 'Mariana Oliveira Santos',
  attendedBy: 'Atendente',
  modality: 'Home Office',
  observation: `AUTO - Edicao campos obrigatorios ${buildIdentifier()}`,
})

export const buildBondEditAllFields = (): BondEditData => ({
  area: 'CETREI',
  subarea: 'BIBLIOTECA',
  responsibleType: 'Colaborador',
  collaborator: 'Mariana Oliveira Santos',
  attendedBy: 'Atendente',
  modality: 'Home Office',
  operatingSystem: 'WINDOWS 11 PRO',
  usesOfficePackage: false,
  officePackage: '',
  observation: `AUTO - Edicao todos os campos ${buildIdentifier()}`,
})

export const buildAssetReplacementAvailable = (): BondEditData => ({
  ...buildBondEditRequiredFields(),
  assetStatus: 'DISPONÍVEL',
  observation: `AUTO - Substituicao ativo disponivel ${buildIdentifier()}`,
})

export const buildAssetReplacementDefective = (): BondEditData => ({
  ...buildBondEditRequiredFields(),
  assetStatus: 'COM DEFEITO',
  observation: `AUTO - Substituicao ativo com defeito ${buildIdentifier()}`,
  defectDescription: `Defeito identificado por teste automatizado ${buildIdentifier()}`,
})
