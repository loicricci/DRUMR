import sharp from "sharp";
import { stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const publicDir = resolve(process.cwd(), "public");

// Decorative background images: rendered at low opacity behind dark gradients,
// so we can downscale and compress aggressively without visible quality loss.
const jobs = [
  { in: "sections/hero.png", out: "sections/hero.webp", width: 1920, quality: 70 },
  { in: "sections/platform.png", out: "sections/platform.webp", width: 1600, quality: 70 },
  { in: "stages/idea.png", out: "stages/idea.webp", width: 1000, quality: 65 },
  { in: "stages/psf.png", out: "stages/psf.webp", width: 1000, quality: 65 },
  { in: "stages/pmf.png", out: "stages/pmf.webp", width: 1000, quality: 65 },
];

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

let before = 0;
let after = 0;

for (const job of jobs) {
  const src = resolve(publicDir, job.in);
  const dest = resolve(publicDir, job.out);

  if (!existsSync(src)) {
    console.log(`${job.in.padEnd(22)} (skipped, source not found)`);
    continue;
  }

  const srcSize = (await stat(src)).size;

  await sharp(src)
    .resize({ width: job.width, withoutEnlargement: true })
    .webp({ quality: job.quality, effort: 6 })
    .toFile(dest);

  const destSize = (await stat(dest)).size;
  before += srcSize;
  after += destSize;
  console.log(`${job.in.padEnd(22)} ${kb(srcSize).padStart(9)} -> ${kb(destSize).padStart(8)}  (${(100 - (destSize / srcSize) * 100).toFixed(1)}% smaller)`);
}

console.log("-".repeat(60));
console.log(`TOTAL                  ${kb(before).padStart(9)} -> ${kb(after).padStart(8)}  (${(100 - (after / before) * 100).toFixed(1)}% smaller)`);
