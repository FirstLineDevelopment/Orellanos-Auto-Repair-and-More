# Asset Manifest

Track primary assets so placeholders do not accidentally ship and visual direction remains honest.

Never use competitor photography as client photography. Generated concept imagery must be marked generated/placeholder unless the client explicitly approves it for final use.

Public discovery does not equal production approval. Preserve source/provenance after downloading or optimizing assets.

Recommended research/staging location: `assets/research/` or another clearly non-production directory. Production assets should be optimized separately before use.

Authenticity classifications:

- REAL - CLIENT PROVIDED
- REAL - BUSINESS CONTROLLED
- REAL - THIRD-PARTY PUBLIC
- GENERATED CONCEPT
- GENERIC / STOCK
- REFERENCE ONLY
- UNKNOWN PROVENANCE

Quality classifications:

- HERO CANDIDATE
- STRONG SUPPORTING IMAGE
- USABLE SUPPORTING IMAGE
- REFERENCE ONLY
- UNUSABLE

Usage statuses:

- production approved
- concept/demo approved
- permission required
- replacement recommended
- reference only
- unknown

| Asset | Local Path/URL | Depicts | Source | Source URL/Reference | Authenticity Classification | Dimensions Original | Dimensions Optimized | Format | Intended Use | Actual Use | Quality Classification | Usage/Permission Status | Saved Locally | Optimized | Replacement Required | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Concept OA mark |  | temporary brand monogram | FirstLine concept | local implementation | GENERATED CONCEPT | n/a | n/a | HTML/CSS | brand identity | header brand mark | USABLE SUPPORTING IMAGE | concept/demo approved | no | n/a | yes | Replace with official logo if available. |
| Hero image | assets/generated/repair-bay-hero-concept.jpg | generic independent auto repair service bay | OpenAI ImageGen concept | Generated in Codex on 2026-08-28 | GENERATED CONCEPT | 1728x975 | 1440x813 | jpg | hero | hero | HERO CANDIDATE | concept/demo approved | yes | yes | yes | Production-safe concept image; does not depict the actual Orellano's shop. |
| Facebook profile image reference | https://www.facebook.com/profile.php?id=100064694472877 | likely business profile image | Facebook page metadata | `https://www.facebook.com/profile.php?id=100064694472877` | REAL - BUSINESS CONTROLLED / REFERENCE ONLY | unknown | n/a | jpg | authenticity reference | not used on site | REFERENCE ONLY | permission required | no | no | yes | Do not use publicly until owner confirms permission and provides original. |
| Social preview | assets/generated/repair-bay-hero-concept.jpg | generic independent auto repair service bay | OpenAI ImageGen concept | Generated in Codex on 2026-08-28 | GENERATED CONCEPT | 1728x975 | 1440x813 | jpg | social preview | metadata placeholder | STRONG SUPPORTING IMAGE | concept/demo approved | yes | yes | yes | Replace canonical/social URLs before deployment. |
