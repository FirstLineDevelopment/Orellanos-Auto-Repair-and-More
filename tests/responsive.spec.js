import { expect, test } from "@playwright/test";
import { pages, viewports } from "./firstline-test-config.js";

for (const sitePage of pages) {
  for (const viewport of viewports) {
    test(`${sitePage.path} has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(sitePage.path);

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return doc.scrollWidth - doc.clientWidth;
      });

      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
}
