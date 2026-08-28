import { existsSync } from "node:fs";
import { join } from "node:path";
import firstline from "../firstline.config.js";

const missing = [];

for (const page of firstline.pages) {
  const source = page.source || "index.html";
  const output = source === "index.html" ? "index.html" : source;
  if (!existsSync(join("dist", output))) missing.push(output);
}

if (missing.length) {
  console.error("Build page check failed. Missing dist output for:");
  console.error(missing.join("\n"));
  process.exit(1);
}

console.log(`Build page check passed for ${firstline.pages.length} configured page(s).`);
