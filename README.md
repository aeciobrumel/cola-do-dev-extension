# Cola do Dev - Browser Extension (Chrome + Firefox)

Extensão em React + TypeScript (Vite) com popup para gerenciar snippets, compatível com Chrome e Firefox.

## Funcionalidades

- Popup no ícone da extensão
- Lista de snippets com busca e filtros por `category` e `subCategory`
- CRUD completo (`create`, `edit`, `remove`)
- Botão para copiar código
- Persistência no `chrome.storage.local`
- Import/Export JSON

## Prints

<p align="center">
  <img width="250"  src="https://github.com/user-attachments/assets/3f9eb85c-9318-4de2-8845-8305d76db677" />
  <img width="250"  alt="image" src="https://github.com/user-attachments/assets/0917a3e4-f058-4286-8004-d3bd536e415e" />
</p>





Modelo de dados principal:

```ts
{
  category: string;
  subCategory: string;
  title: string;
  description: string;
  code: string;
}
```

A aplicação também usa `id`, `createdAt` e `updatedAt` internamente.

## Scripts

- `npm run dev`: ambiente local com Vite
- `npm run build`: gera `dist/` pronto para extensão
- `npm run build:firefox`: gera `dist/` e empacota arquivos para envio ao Firefox
- `npm run build:submission`: gera o pacote Firefox e o pacote de código-fonte para AMO
- `npm run package:firefox`: cria os arquivos Firefox a partir de um `dist/` existente
- `npm run package:source`: cria o ZIP do código-fonte para revisão da Mozilla
- `npm run preview`: preview local do build
- `npm run typecheck`: validação TypeScript

## Build da extensão

```bash
npm install
npm run build
```

Saída em `dist/` com:

- `dist/manifest.json`
- `dist/index.html` (popup)
- `dist/assets/*`

## Carregar no Chrome (Unpacked)

1. Abra `chrome://extensions`.
2. Ative `Developer mode`.
3. Clique em `Load unpacked`.
4. Selecione a pasta `dist/` deste projeto.
5. Clique no ícone da extensão `Cola do Dev` para abrir o popup.

## Firefox

### Teste temporario

1. Rode `npm run build`.
2. Abra `about:debugging`.
3. Entre em `Este Firefox`.
4. Clique em `Carregar extensao temporaria`.
5. Selecione `dist/manifest.json`.

### Instalacao permanente

1. Rode:

```bash
npm run build:firefox
```

2. O projeto vai gerar:

- `artifacts/cola-do-dev-firefox-<versao>-submission.zip`
- `artifacts/cola-do-dev-firefox-<versao>-unsigned.xpi`

3. Envie o `.zip` ou `.xpi` para assinatura em `addons.mozilla.org`.
4. Baixe o `.xpi` assinado pela Mozilla.
5. No Firefox, abra `about:addons`.
6. Clique na engrenagem.
7. Escolha `Install Add-on From File...`.
8. Selecione o `.xpi` assinado.

Observacao: o `.xpi` gerado localmente e sem assinatura nao instala no Firefox estavel.

### Codigo-fonte para revisao

Quando a Mozilla pedir o source code package, rode:

```bash
npm run package:source
```

Arquivo gerado:

- `artifacts/cola-do-dev-firefox-<versao>-source.zip`

O arquivo [SOURCE_SUBMISSION_README.md](/home/brumel/Documentos/Github/cola-do-dev-extension/SOURCE_SUBMISSION_README.md) inclui ambiente, dependencias e o passo a passo exato de build para o revisor.

## Import/Export JSON

- Export gera um arquivo com formato:

```json
{
  "exportedAt": "2026-02-17T00:00:00.000Z",
  "snippets": [
    {
      "category": "Laravel",
      "subCategory": "Query Builder",
      "title": "whereExists",
      "description": "...",
      "code": "..."
    }
  ]
}
```

- Import aceita:
  - um array direto de snippets, ou
  - objeto com chave `snippets`.
