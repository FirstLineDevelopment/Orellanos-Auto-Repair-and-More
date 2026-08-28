import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, normalize, relative, resolve } from "node:path";
import firstline from "../firstline.config.js";

const manifestFile = firstline.assets?.manifestFile || "docs/ASSET_MANIFEST.md";
const outputDir = firstline.assets?.outputDir || "qa-assets";
const contactSheetFile = firstline.assets?.contactSheetFile || join(outputDir, "asset-contact-sheet.html");
const researchDirs = firstline.assets?.researchDirs || ["assets/research"];
const maxProductionBytes = firstline.assets?.maxProductionBytes || 600 * 1024;
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const strict = process.env.ASSET_QA_STRICT === "1";

function readUInt24LE(buffer, offset) {
  return buffer[offset] + (buffer[offset + 1] << 8) + (buffer[offset + 2] << 16);
}

function getDimensions(filePath) {
  const buffer = readFileSync(filePath);
  if (buffer.length < 12) return null;

  if (buffer.toString("ascii", 1, 4) === "PNG") {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20), format: "png" };
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      if (marker >= 0xc0 && marker <= 0xc3) {
        return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5), format: "jpeg" };
      }
      offset += 2 + length;
    }
  }

  if (buffer.toString("ascii", 0, 3) === "GIF") {
    return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8), format: "gif" };
  }

  if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    const type = buffer.toString("ascii", 12, 16);
    if (type === "VP8X") {
      return { width: readUInt24LE(buffer, 24) + 1, height: readUInt24LE(buffer, 27) + 1, format: "webp" };
    }
    if (type === "VP8 " && buffer.length > 30) {
      return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff, format: "webp" };
    }
    if (type === "VP8L" && buffer.length > 25) {
      const bits = buffer.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1, format: "webp" };
    }
  }

  return null;
}

function listImages(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listImages(path);
    return imageExtensions.has(extname(entry.name).toLowerCase()) ? [path] : [];
  });
}

function parseMarkdownTable(markdown) {
  const lines = markdown.split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => line.trim().startsWith("| Asset |"));
  if (headerIndex < 0 || !lines[headerIndex + 1]?.includes("---")) return [];

  const headers = lines[headerIndex].split("|").slice(1, -1).map((value) => value.trim());
  const rows = [];
  for (const line of lines.slice(headerIndex + 2)) {
    if (!line.trim().startsWith("|")) break;
    const values = line.split("|").slice(1, -1).map((value) => value.trim());
    rows.push(Object.fromEntries(headers.map((header, index) => [header, values[index] || ""])));
  }
  return rows;
}

function isLocalPath(value) {
  return value && !/^https?:\/\//i.test(value) && !value.includes(" / ") && !value.includes(" /");
}

const root = process.cwd();
const manifestPath = resolve(root, manifestFile);
const manifestText = existsSync(manifestPath) ? readFileSync(manifestPath, "utf8") : "";
const rows = parseMarkdownTable(manifestText);
const discoveredPaths = new Set();

for (const row of rows) {
  const pathValue = row["Local Path/URL"] || row["Path/URL"] || "";
  if (isLocalPath(pathValue)) discoveredPaths.add(normalize(pathValue));
}

for (const dir of researchDirs) {
  for (const filePath of listImages(resolve(root, dir))) {
    discoveredPaths.add(relative(root, filePath));
  }
}

const images = [...discoveredPaths]
  .map((assetPath) => {
    const absolutePath = resolve(root, assetPath);
    if (!existsSync(absolutePath)) return { assetPath, missing: true };
    const stats = statSync(absolutePath);
    const dimensions = getDimensions(absolutePath);
    return { assetPath, absolutePath, bytes: stats.size, dimensions };
  })
  .filter((asset) => imageExtensions.has(extname(asset.assetPath).toLowerCase()) || asset.missing);

const warnings = [];
for (const row of rows) {
  const asset = row.Asset || "<unnamed asset>";
  const source = row.Source || "";
  const sourceReference = row["Source URL/Reference"] || "";
  const authenticity = row["Authenticity Classification"] || row["Source Type"] || "";
  const usage = row["Usage/Permission Status"] || row["License/Permission"] || "";
  if (!source && !sourceReference) warnings.push(`${asset}: missing source or source URL/reference.`);
  if (!authenticity || /pending|unknown/i.test(authenticity)) warnings.push(`${asset}: authenticity/provenance is not resolved.`);
  if (!usage || /pending|unknown/i.test(usage)) warnings.push(`${asset}: usage/permission status is not resolved.`);
}

for (const image of images) {
  if (image.missing) {
    warnings.push(`${image.assetPath}: manifest path does not exist locally.`);
    continue;
  }
  if (!image.dimensions) warnings.push(`${image.assetPath}: dimensions could not be read.`);
  if (!image.assetPath.includes("research") && image.bytes > maxProductionBytes) {
    warnings.push(`${image.assetPath}: production image is ${(image.bytes / 1024).toFixed(0)} KB; consider responsive sizing/compression.`);
  }
}

mkdirSync(dirname(contactSheetFile), { recursive: true });

const figures = images.map((image) => {
  const relativeSrc = image.missing ? "" : relative(dirname(contactSheetFile), image.assetPath).replaceAll("\\", "/");
  const size = image.missing ? "missing" : `${(image.bytes / 1024).toFixed(0)} KB`;
  const dimensions = image.dimensions ? `${image.dimensions.width}x${image.dimensions.height} ${image.dimensions.format}` : "dimensions unknown";
  return `
      <figure>
        ${image.missing ? "<div class=\"missing\">Missing file</div>" : `<a href="${relativeSrc}"><img src="${relativeSrc}" alt="${basename(image.assetPath)}" loading="lazy"></a>`}
        <figcaption><strong>${image.assetPath}</strong><br>${dimensions}<br>${size}</figcaption>
      </figure>`;
}).join("");

writeFileSync(contactSheetFile, `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FirstLine Asset Contact Sheet</title>
    <style>
      body { margin: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f5f6f8; color: #17191d; }
      header { padding: 1rem; background: #fff; border-bottom: 1px solid #d8dde6; }
      main { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; padding: 1rem; }
      figure { margin: 0; background: #fff; border: 1px solid #d8dde6; }
      img, .missing { display: grid; place-items: center; width: 100%; height: 260px; object-fit: contain; background: #e8ebf0; border-bottom: 1px solid #d8dde6; color: #8b1e2d; font-weight: 700; }
      figcaption { padding: .75rem; font-size: .86rem; line-height: 1.45; overflow-wrap: anywhere; }
    </style>
  </head>
  <body>
    <header>
      <h1>FirstLine Asset Contact Sheet</h1>
      <p>Review staged and manifested assets before final visual direction. This artifact is for research and QA, not production.</p>
    </header>
    <main>${figures || "<p>No local image assets found in the manifest or configured research directories.</p>"}
    </main>
  </body>
</html>
`, "utf8");

console.log(`Asset contact sheet written to ${contactSheetFile}.`);
if (warnings.length) {
  console.warn("Asset warnings:");
  for (const warning of warnings) console.warn(`- ${warning}`);
  if (strict) process.exitCode = 1;
} else {
  console.log("Asset manifest audit passed.");
}
