# inventario-qa-e2e

Suite de testes end-to-end do sistema de inventario, escrita em Cypress + TypeScript.

A automacao segue o padrao Screen Object (uma classe por tela em `cypress/support/screens`), com os seletores de cada tela isolados em `cypress/support/selectors` e a massa de dados gerada por builders em `cypress/fixtures/data-builders`.

### Por que Screen Object e nao Page Object?

O padrao Page Object pressupoe uma correspondencia 1:1 entre classe e URL. Neste sistema isso nao se aplica: `CreateBondScreen` e `BondEditScreen` compartilham a rota base `/portal_service/bonds`, e funcionalidades como o modal de termo de responsabilidade existem sobrepostas a outras telas sem URL propria.

Screen Object modela o **estado visivel para o usuario** (uma tela, um formulario, um modal) em vez de uma rota. Isso torna as classes mais coesas, os metodos mais expressivos (`assertDataLoaded`, `assertLinkedAssetsSection`) e evita que uma unica classe acumule comportamentos de multiplos estados da mesma URL. E o modelo recomendado pela documentacao oficial do Cypress.

## Estrutura

```
cypress/
├── e2e/                         # Specs por dominio de negocio
│   ├── auth/login.cy.ts
│   ├── assets/create-asset.cy.ts
│   ├── bonds/create-bond.cy.ts
│   ├── bonds/edit-bond.cy.ts
│   ├── documents/generate-terms.cy.ts
│   └── reports/
│       ├── asset-movement-report.cy.ts
│       └── bonds-by-area-report.cy.ts
├── fixtures/data-builders/      # Builders de massa (asset, bond)
└── support/
    ├── commands.ts              # cy.signIn() com sessao cacheada
    ├── e2e.ts
    ├── env/config.ts            # Leitura de .env
    ├── selectors/               # Seletores isolados por tela
    ├── screens/                 # Screen Objects + index (barrel)
    └── types/cypress.d.ts
```

## Configuracao

1. Copie `.env.example` para `.env` e preencha `BASE_URL`, `USER_EMAIL` e `USER_PASSWORD`.
2. Instale as dependencias: `npm install`.

## Execucao

```bash
npm run cy:open            # Modo interativo
npm run cy:run             # Headless, todos os testes
npm run cy:run:regression  # Apenas testes @regression
npm run cy:run:extended    # Apenas testes @extended
npm run cy:run:report      # Executa e gera relatorio mochawesome
```

As tags seguem a taxonomia: `@regression` / `@extended` (escopo), `@positive` / `@negative`
(natureza) e um par por caso de teste (`@auth`, `@auth-1`, `@bond-edit`, `@bond-edit-3`, etc.).

## Qualidade

- `npm run lint` — ESLint
- `npm run format:check` — Prettier
- `npx tsc --noEmit` — checagem de tipos

O hook de pre-commit (Husky) roda o lint automaticamente antes de cada commit.

## Resultados da última execução

| Spec | Testes | Passou | Falhou |
| ---- | ------ | ------ | ------ |
| auth/login.cy.ts | 2 | 2 | — |
| assets/create-asset.cy.ts | 2 | 2 | — |
| bonds/create-bond.cy.ts | 5 | 4 | 1 |
| bonds/edit-bond.cy.ts | 8 | 8 | — |
| documents/generate-terms.cy.ts | 4 | 4 | — |
| reports/asset-movement-report.cy.ts | 2 | 2 | — |
| reports/bonds-by-area-report.cy.ts | 3 | 3 | — |
| **Total** | **26** | **25** | **1** |

O único caso falhando é `cria uma atribuicao sem colaborador por subarea` (`@bond-new-5`): o
servidor rejeita o envio exigindo colaborador mesmo quando a opção "sem colaborador" está
marcada. O defeito está documentado como **BUG-02** em `docs/bugs-e-melhorias.md`.

## Evidências

Os artefatos gerados por `npm run cy:run:report` ficam em:

| Artefato | Caminho |
| -------- | ------- |
| Relatório HTML (mochawesome) | `cypress/reports/mochawesome/index.html` |
| Vídeos por spec | `cypress/videos/<dominio>/<spec>.mp4` |
| Screenshots de falha | `cypress/screenshots/` (gerado automaticamente em caso de falha) |

Para abrir o relatório após a execução:

```bash
npm run cy:run:report
open cypress/reports/mochawesome/index.html
```
