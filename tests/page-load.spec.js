import { expect, test } from "@playwright/test";
import { pages } from "./firstline-test-config.js";

test.describe("FirstLine page load standards", () => {
  for (const sitePage of pages) {
    test(`${sitePage.path} loads without console errors`, async ({ page }) => {
      const errors = [];
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("pageerror", (error) => errors.push(error.message));

      await page.goto(sitePage.path);
      await expect(page.locator("body")).toBeVisible();
      expect(errors).toEqual([]);
    });
  }
});
