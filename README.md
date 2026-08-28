# Orellano's Auto Repair & More

FirstLine-System-Version: 2.1

FirstLine client project created from the v2.1 starter. It is intentionally small: static HTML/CSS/JS, reusable navigation/anchor/footer/form utilities, visual-direction project memory, and Playwright checks for issues that repeatedly appeared in historical projects.

## Setup

```bash
npm install
npm run dev
npm test
```

## Architecture

Configure site shape in `firstline.config.js`.

- Use `architecture: "single-page"` for concise sites where section navigation is enough.
- Use `architecture: "multi-page"` when pages need distinct URLs, metadata, navigation, or conversion paths.
- Add each primary HTML page to `pages`. The list drives Vite build inputs, metadata checks, responsive checks, and screenshot capture.

After adding a page, run `npm run build` and confirm `npm run qa:build-pages` passes.

## Forms

Forms use the FirstLine form-mode helper.

- `defaultFormMode: "demo"` prevents real submission and displays clear demo-state copy.
- `defaultFormMode: "live"` lets forms use their configured action/API behavior.
- Override a single form with `data-form-mode="demo"` or `data-form-mode="live"`.

Demo forms must never imply that information was delivered to the business.

## Visual QA

Run:

```bash
npm run qa:visual
```

Screenshots are written to `qa-screenshots/`, which is ignored by git. The script also writes a contact sheet and visual QA report template. Review screenshots for engineering issues and for professional design quality: first impression, brand specificity, hero impact, imagery, composition, hierarchy, typography, color, contrast, depth, section rhythm, mobile polish, footer finish, and commercial value.

Visual QA can fail even when tests pass. Refine material visual weaknesses and recapture affected screenshots before handoff.

## Asset QA

Run:

```bash
npm run qa:assets
```

The asset script reads `docs/ASSET_MANIFEST.md`, inspects local staged images such as `assets/research/`, reports dimensions and file sizes, flags missing provenance or usage status, and writes `qa-assets/asset-contact-sheet.html`. Use `ASSET_QA_STRICT=1 npm run qa:assets` for launch-style failure on unresolved asset warnings.

## Structure

- `AGENTS.md`: project agent instructions copied from FirstLine-System.
- `firstline.config.js`: system version, architecture, page list, form mode, asset QA, and visual QA breakpoints.
- `vite.config.js`: Vite multi-page build inputs generated from `firstline.config.js`.
- `docs/CLIENT_BRIEF.md`: client-specific source of truth.
- `docs/FIRSTLINE_LEARNING.md`: candidate reusable lessons found during the project.
- `src/styles/tokens.css`: brand, spacing, header, and responsive tokens.
- `src/styles/components.css`: starter layout/component styles and flexible composition primitives.
- `src/utils/anchor-offset.js`: sticky/fixed header anchor scrolling.
- `src/utils/mobile-nav.js`: mobile nav state contract.
- `src/utils/form-mode.js`: demo/live form-mode helper.
- `src/components/footer-credit.js`: optional FirstLine footer credit renderer.
- `tests/`: Playwright checks for page load, anchors, nav state, form mode, overflow, and metadata.

## Notes

Replace placeholder content and tokens with the client brief before design work. Do not use the starter's sample layout as the art direction. Do not promote project-specific changes into FirstLine-System automatically; record candidates in `docs/FIRSTLINE_LEARNING.md`.
