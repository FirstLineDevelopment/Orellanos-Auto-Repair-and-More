import { expect, test } from "@playwright/test";

test.describe("FirstLine navigation standards", () => {
  test("anchor targets land below the sticky header", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Services" }).first().click();

    await expect.poll(async () => {
      const headerBox = await page.locator("[data-site-header]").boundingBox();
      const targetBox = await page.locator("#services").boundingBox();
      if (!headerBox || !targetBox) return -1;
      return targetBox.y - Math.floor(headerBox.height);
    }).toBeGreaterThanOrEqual(0);
  });

  test("mobile nav closes on link click and keeps aria state accurate", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const toggle = page.locator("[data-mobile-nav-toggle]");
    const nav = page.locator("[data-mobile-nav]");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(nav).toHaveClass(/is-open/);

    await nav.getByRole("link", { name: "Contact" }).click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(nav).not.toHaveClass(/is-open/);
  });

  test("mobile nav closes on outside click and desktop breakpoint", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const toggle = page.locator("[data-mobile-nav-toggle]");
    const nav = page.locator("[data-mobile-nav]");

    await toggle.click();
    await page.mouse.click(20, 500);
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(nav).not.toHaveClass(/is-open/);
  });
});
