export default {
  systemVersion: "2.1",
  architecture: "single-page",
  defaultFormMode: "demo",
  pages: [
    {
      path: "/",
      source: "index.html",
      titlePattern: "Orellano Mobile Mechanic",
      anchors: ["mobile", "services", "card", "request", "contact"]
    }
  ],
  assets: {
    manifestFile: "docs/ASSET_MANIFEST.md",
    researchDirs: ["assets/research"],
    outputDir: "qa-assets",
    contactSheetFile: "qa-assets/asset-contact-sheet.html",
    maxProductionBytes: 614400
  },
  visualQA: {
    outputDir: "qa-screenshots",
    reportFile: "qa-screenshots/VISUAL_QA_REPORT.md",
    contactSheetFile: "qa-screenshots/contact-sheet.html",
    minimums: {
      ownerReview: 8,
      general: 7,
      catastrophicFailBelow: 6
    },
    scoreDimensions: [
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
    ],
    viewports: [
      { name: "mobile-375", width: 375, height: 900 },
      { name: "mobile-390", width: 390, height: 900 },
      { name: "tablet-768", width: 768, height: 1000 },
      { name: "laptop-1024", width: 1024, height: 900 },
      { name: "desktop-1440", width: 1440, height: 1000 }
    ]
  }
};
