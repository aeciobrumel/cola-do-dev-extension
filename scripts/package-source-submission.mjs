import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const artifactsDir = path.join(rootDir, "artifacts");
const packageJsonPath = path.join(rootDir, "package.json");

const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const version = packageJson.version;
const zipPath = path.join(artifactsDir, `cola-do-dev-firefox-${version}-source.zip`);

const includePaths = [
  "src",
  "public",
  "scripts",
  "index.html",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "vite.config.ts",
  "README.md",
  "SOURCE_SUBMISSION_README.md",
  "LICENSE",
  ".gitignore"
];

const missingPaths = includePaths.filter((relativePath) => !existsSync(path.join(rootDir, relativePath)));

if (missingPaths.length > 0) {
  console.error(`Arquivos ausentes para o pacote de source submission: ${missingPaths.join(", ")}`);
  process.exit(1);
}

mkdirSync(artifactsDir, { recursive: true });
rmSync(zipPath, { force: true });

const zipResult = spawnSync("zip", ["-q", "-r", zipPath, ...includePaths], {
  cwd: rootDir,
  stdio: "inherit"
});

if (zipResult.error) {
  console.error("Nao foi possivel executar `zip`. Instale o comando e tente novamente.");
  process.exit(1);
}

if (zipResult.status !== 0) {
  process.exit(zipResult.status ?? 1);
}

console.log(`Pacote de codigo-fonte gerado: ${zipPath}`);
