import { expect, test } from "@playwright/test";
import { pages } from "./firstline-test-config.js";

test.describe("FirstLine metadata standards", () => {
  for (const sitePage of pages) {
    test(`${sitePage.path} metadata scaffold is present`, async ({ page }) => {
      await page.goto(sitePage.path);

      if (sitePage.titlePattern) await expect(page).toHaveTitle(new RegExp(sitePage.titlePattern));

      const metadata = await page.evaluate(() => ({
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content || "",
        canonical: document.querySelector('link[rel="canonical"]')?.href || "",
        ogImage: document.querySelector('meta[property="og:image"]')?.content || "",
        ogAlt: document.querySelector('meta[property="og:image:alt"]')?.content || ""
      }));

      expect(metadata.title.length).toBeGreaterThan(0);
      expect(metadata.description.length).toBeGreaterThan(0);
      expect(metadata.canonical).toMatch(/^https?:\/\//);
      expect(metadata.ogImage).toMatch(/^https?:\/\//);
      expect(metadata.ogAlt.length).toBeGreaterThan(0);
    });
  }
});
