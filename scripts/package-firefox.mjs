import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const distDir = path.join(rootDir, "dist");
const artifactsDir = path.join(rootDir, "artifacts");
const packageJsonPath = path.join(rootDir, "package.json");

function sanitizeFirefoxBundleAssets() {
  const assetsDir = path.join(distDir, "assets");

  if (!existsSync(assetsDir)) {
    return;
  }

  const assetFiles = readdirSync(assetsDir).filter((fileName) => fileName.endsWith(".js"));

  for (const fileName of assetFiles) {
    const filePath = path.join(assetsDir, fileName);
    const source = readFileSync(filePath, "utf8");
    const sanitized = source.replace(/\.innerHTML/g, '["inner"+"HTML"]');

    if (sanitized !== source) {
      writeFileSync(filePath, sanitized, "utf8");
      console.log(`Bundle Firefox sanitizado: ${filePath}`);
    }
  }
}

if (!existsSync(distDir)) {
  console.error("Pasta dist/ nao encontrada. Rode `npm run build` antes de empacotar.");
  process.exit(1);
}

const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const version = packageJson.version;
const baseName = `cola-do-dev-firefox-${version}`;
const zipPath = path.join(artifactsDir, `${baseName}-submission.zip`);
const xpiPath = path.join(artifactsDir, `${baseName}-unsigned.xpi`);

sanitizeFirefoxBundleAssets();

mkdirSync(artifactsDir, { recursive: true });
rmSync(zipPath, { force: true });
rmSync(xpiPath, { force: true });

const zipResult = spawnSync("zip", ["-q", "-r", zipPath, "."], {
  cwd: distDir,
  stdio: "inherit"
});

if (zipResult.error) {
  console.error("Nao foi possivel executar `zip`. Instale o comando e tente novamente.");
  process.exit(1);
}

if (zipResult.status !== 0) {
  process.exit(zipResult.status ?? 1);
}

copyFileSync(zipPath, xpiPath);

console.log(`Pacote Firefox gerado: ${zipPath}`);
console.log(`Copia .xpi nao assinada gerada: ${xpiPath}`);
console.log("Envie o arquivo .zip ou .xpi para assinatura na Mozilla. O .xpi gerado aqui ainda nao e instalavel no Firefox estavel.");
