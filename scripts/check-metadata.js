import { existsSync, readFileSync } from "node:fs";
import firstline from "../firstline.config.js";

const required = [
  /<title>[^<]+<\/title>/i,
  /<meta\s+name="description"\s+content="[^"]+"/i,
  /<link\s+rel="canonical"\s+href="https?:\/\//i,
  /<meta\s+property="og:image"\s+content="https?:\/\//i,
  /<meta\s+property="og:image:alt"\s+content="[^"]+"/i,
  /<meta\s+name="twitter:card"\s+content="summary_large_image"/i
];

const warnings = [];
const failures = [];

for (const page of firstline.pages) {
  const source = page.source || "index.html";
  if (!existsSync(source)) {
    failures.push(`${source}: configured page source does not exist.`);
    continue;
  }

  const html = readFileSync(source, "utf8");
  const missing = required.filter((pattern) => !pattern.test(html));
  if (missing.length) failures.push(`${source}: ${missing.length} required metadata pattern(s) missing.`);

  if (!/<link\s+[^>]*rel="(?:icon|shortcut icon|apple-touch-icon)"/i.test(html)) {
    warnings.push(`${source}: favicon is not configured yet; acceptable for starter/internal review, not launch.`);
  }

  if (/Client Site|FirstLine client website starter|example\.com/i.test(html)) {
    warnings.push(`${source}: placeholder starter metadata remains; replace before launch.`);
  }
}

if (warnings.length) {
  console.warn("Metadata warnings:");
  console.warn(warnings.join("\n"));
}

if (failures.length) {
  console.error("Metadata check failed:");
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Metadata scaffold check passed for ${firstline.pages.length} configured page(s).`);
