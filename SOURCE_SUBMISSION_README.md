# Firefox Source Submission

This archive contains the human-readable source code for the `Cola do Dev` browser extension.

## Purpose

- React + TypeScript popup extension for managing developer snippets.
- Target browsers: Chromium-based browsers and Firefox.
- Firefox packaging target: Manifest V3 popup extension.

## Included source files

- `src/`
- `public/`
- `scripts/`
- `index.html`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.ts`
- `README.md`
- `SOURCE_SUBMISSION_README.md`
- `LICENSE`
- `.gitignore`

The source archive intentionally does not include generated artifacts such as `dist/`, `artifacts/`, `node_modules/`, `.git/`, or editor-local files.

## Build environment used to generate the submitted package

- Operating system: Ubuntu 24.04.2 LTS x86_64
- Node.js: `v24.14.1`
- npm: `11.11.0`
- zip: Info-ZIP `3.0`

## Build dependencies

Install the following before building:

1. Node.js `v24.14.1`
2. npm `11.11.0`
3. `zip` command available in the shell

If `zip` is missing on Ubuntu/Debian:

```bash
sudo apt-get update
sudo apt-get install zip
```

## Step-by-step build instructions

From the project root:

```bash
npm ci
npm run build:firefox
```

This performs the following:

1. `npm run build`
   - runs TypeScript validation with `tsc --noEmit`
   - runs `vite build` to generate the extension files in `dist/`
2. `npm run package:firefox`
   - runs `node scripts/package-firefox.mjs`
   - sanitizes the generated Firefox bundle asset
   - packages the contents of `dist/` into the Firefox submission archive

## Expected output

After a successful build, the following files are created:

- `artifacts/cola-do-dev-firefox-1.0.0-submission.zip`
- `artifacts/cola-do-dev-firefox-1.0.0-unsigned.xpi`

The `.zip` file is the package intended for Firefox submission/signing.
The `.xpi` file generated locally is unsigned and is not installable in stable Firefox until Mozilla signs it.

## Source archive generation

To generate the source-code archive itself:

```bash
npm run package:source
```

Expected output:

- `artifacts/cola-do-dev-firefox-1.0.0-source.zip`

## Notes for reviewers

- The project uses Vite to bundle the extension popup code.
- The build aliases React imports to `preact/compat` in the production bundle.
- The Firefox packaging step includes a deterministic post-processing step in `scripts/package-firefox.mjs` before creating the final submission archive.
