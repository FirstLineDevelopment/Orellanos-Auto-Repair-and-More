import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const badPatterns = [
  { label: "U+00C3", regex: new RegExp("\\u00c3") },
  { label: "U+00C2", regex: new RegExp("\\u00c2") },
  { label: "U+FFFD", regex: new RegExp("\\ufffd") }
];
const ignored = new Set(["node_modules", "dist", ".git"]);
const matches = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (ignored.has(entry)) continue;
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      walk(path);
      continue;
    }
    if (!/\.(html|css|js|json|md|txt)$/i.test(path)) continue;
    const text = readFileSync(path, "utf8");
    badPatterns.forEach(({ label, regex }) => {
      if (regex.test(text)) matches.push(`${path}: ${label}`);
    });
  }
}

walk(process.cwd());

if (matches.length) {
  console.error("Possible mojibake found:");
  console.error(matches.join("\n"));
  process.exit(1);
}

console.log("No common mojibake patterns found.");
