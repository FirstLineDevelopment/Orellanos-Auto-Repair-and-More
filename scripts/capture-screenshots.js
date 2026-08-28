import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "@playwright/test";
import firstline from "../firstline.config.js";

const baseURL = process.env.BASE_URL || "http://127.0.0.1:5173";
const outputDir = firstline.visualQA?.outputDir || "qa-screenshots";
const reportFile = firstline.visualQA?.reportFile || join(outputDir, "VISUAL_QA_REPORT.md");
const contactSheetFile = firstline.visualQA?.contactSheetFile || join(outputDir, "contact-sheet.html");
const viewports = firstline.visualQA?.viewports || [
  { name: "mobile-375", width: 375, height: 900 },
  { name: "mobile-390", width: 390, height: 900 },
  { name: "tablet-768", width: 768, height: 1000 },
  { name: "laptop-1024", width: 1024, height: 900 },
  { name: "desktop-1440", width: 1440, height: 1000 }
];

mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
const captures = [];

for (const route of firstline.pages) {
  const label = (route.source || "index.html").replace(/\.html$/i, "").replace(/[^a-z0-9_-]/gi, "-") || "home";
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(new URL(route.path, baseURL).toString(), { waitUntil: "networkidle" });
    const filename = `${label}-${viewport.name}.png`;
    await page.screenshot({ path: join(outputDir, filename), fullPage: true });
    captures.push({ page: route.path, viewport: viewport.name, width: viewport.width, height: viewport.height, filename });
  }
}

await browser.close();

const dimensions = firstline.visualQA?.scoreDimensions || [
  "first impression",
  "brand specificity",
  "hero impact",
  "imagery",
  "composition",
  "hierarchy",
  "typography",
  "color",
  "depth",
  "section rhythm",
  "mobile polish",
  "commercial polish"
];
const minimums = firstline.visualQA?.minimums || { ownerReview: 8, general: 7, catastrophicFailBelow: 6 };

const contactItems = captures.map((capture) => `
      <figure>
        <a href="./${capture.filename}"><img src="./${capture.filename}" alt="${capture.page} at ${capture.viewport}" loading="lazy"></a>
        <figcaption>${capture.page} - ${capture.viewport} (${capture.width}x${capture.height})</figcaption>
      </figure>`).join("");

writeFileSync(contactSheetFile, `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FirstLine Visual QA Contact Sheet</title>
    <style>
      body { margin: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f4f5f7; color: #17191d; }
      header { position: sticky; top: 0; padding: 1rem; background: rgba(255,255,255,.94); border-bottom: 1px solid #d8dde6; }
      main { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; padding: 1rem; }
      figure { margin: 0; background: #fff; border: 1px solid #d8dde6; }
      img { display: block; width: 100%; height: 360px; object-fit: contain; background: #e8ebf0; border-bottom: 1px solid #d8dde6; }
      figcaption { padding: .75rem; font-weight: 700; font-size: .9rem; }
    </style>
  </head>
  <body>
    <header>
      <h1>FirstLine Visual QA Contact Sheet</h1>
      <p>Inspect screenshots for engineering defects and professional visual quality. Passing tests does not equal passing visual QA.</p>
    </header>
    <main>${contactItems}
    </main>
  </body>
</html>
`, "utf8");

const scoreRows = dimensions.map((dimension) => `| ${dimension} |  |  |`).join("\n");
const screenshotRows = captures.map((capture) => `| ${capture.page} | ${capture.viewport} | ${capture.filename} |  |`).join("\n");

writeFileSync(reportFile, `# FirstLine Visual QA Report

Generated screenshots: ${new Date().toISOString()}

Contact sheet: ${contactSheetFile}

## Result

- Engineering screenshot QA: pass/fail
- Visual QA: pass/fail
- Commercial readiness: pass/fail
- Existing-site comparison required: yes/no
- Authentic asset inventory reviewed before visual direction: yes/no
- Refinement pass required: yes/no
- Recapture completed after refinement: yes/no

## Visual Score

Minimums: no dimension below ${minimums.general}; owner-review dimensions at least ${minimums.ownerReview}; any score below ${minimums.catastrophicFailBelow} is a hard fail.

| Dimension | Score 1-10 | Notes |
| --- | --- | --- |
${scoreRows}

## Screenshot Review

| Page | Viewport | File | Notes |
| --- | --- | --- | --- |
${screenshotRows}

## Critique Prompts

- First impression and perceived commercial value
- Brand specificity: could the same design be sold unchanged to another business?
- Hero quality: authentic hero candidates considered, focal point, composition, CTA hierarchy, desktop crop, mobile crop
- Imagery: source quality, authenticity, provenance, legal/placeholder status, crop quality
- Authentic imagery use: is the site making good use of the authentic visual material available for this business?
- Composition: rhythm, hierarchy, whitespace, depth, transitions, excessive rectangles or borders
- Typography and color: brand fit, contrast, scale, readability
- Mobile/tablet: not only collapsed desktop; verify crop, order, density, CTA placement, nav, and footer finish

## Refinement Notes

- Material weaknesses:
- Changes made:
- Screenshots recaptured:
- Remaining compromises:

## Commercial Readiness

- Is the result visually and functionally compelling enough that a reasonable owner would immediately understand why this is an upgrade?
- Does the site look consistent with the amount FirstLine expects to charge?
- Does this feel like a website for this actual business, or a polished template for the business category?
- For redesigns, where does the new site clearly outperform the existing web presence?
- If the existing site still wins in first impression, imagery, atmosphere, color, personality, or emotional appeal, what remains unfinished?
`, "utf8");

console.log(`Visual QA screenshots captured in ${outputDir}.`);
console.log(`Contact sheet written to ${contactSheetFile}.`);
console.log(`Visual QA report template written to ${reportFile}. Complete and review before handoff; do not commit screenshots by default.`);
