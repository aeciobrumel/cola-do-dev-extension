# Cola do Dev - Chrome Extension (Manifest V3)

Extensão Chrome em React + TypeScript (Vite) com popup para gerenciar snippets.

## Funcionalidades

- Popup no ícone da extensão
- Lista de snippets com busca e filtros por `category` e `subCategory`
- CRUD completo (`create`, `edit`, `remove`)
- Botão para copiar código
- Persistência no `chrome.storage.local`
- Import/Export JSON

## Prints

<p align="center">
<img width="250"  src="https://github.com/user-attachments/assets/e14eef95-ae77-4837-a6a2-39bf32b231f2" />
  <img width="250"  src="https://github.com/user-attachments/assets/91f6f513-041d-401f-89c5-0bf1ecc4d4d9" />
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
