import { access, copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Entry for make.fun "Make the AI judge excited" (ai-excited-01).
 *
 * What it does: copies the artwork to <output>/entry.png, where <output> is
 * MAKEFUN_OUTPUT_DIR if set, otherwise /output. Creates the output directory
 * if needed.
 *
 * Why it copies: entry.png is a 1024x1024 JPEG (named .png but identified by
 * its bytes). Copying byte-for-byte preserves the original exactly; re-encoding
 * would change bytes and lose quality.
 *
 * Run locally (PowerShell):
 *   New-Item -ItemType Directory -Force out | Out-Null
 *   $env:MAKEFUN_OUTPUT_DIR='out'; node .\main.ts
 *   (Get-FileHash .\out\entry.png).Hash -eq (Get-FileHash .\entry.png).Hash
 */

const sourcePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'entry.png');
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const outputPath = path.join(outputDir, 'entry.png');

try {
  await access(sourcePath);
} catch {
  throw new Error(`Artwork not found: ${sourcePath}`);
}

await mkdir(outputDir, { recursive: true });
await copyFile(sourcePath, outputPath);
