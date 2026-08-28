import { expect, test } from "@playwright/test";

const mobileGeometryViewports = [
  { width: 375, height: 900 },
  { width: 390, height: 900 }
];

for (const viewport of mobileGeometryViewports) {
  test(`mobile nav overlay geometry is valid at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const toggle = page.locator("[data-mobile-nav-toggle]");
    const nav = page.locator("[data-mobile-nav]");
    const header = page.locator("[data-site-header]");
    const contentProbe = page.locator("main").first();

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(nav).toHaveClass(/is-open/);

    const geometry = await page.evaluate(() => {
      const header = document.querySelector("[data-site-header]");
      const nav = document.querySelector("[data-mobile-nav]");
      const probe = document.querySelector("main");
      if (!header || !nav || !probe) return null;

      const headerBox = header.getBoundingClientRect();
      const navBox = nav.getBoundingClientRect();
      const sampleX = Math.min(window.innerWidth - 8, Math.max(8, navBox.left + navBox.width / 2));
      const sampleY = Math.min(window.innerHeight - 8, Math.max(headerBox.bottom + 80, navBox.top + navBox.height / 2));
      const topElement = document.elementFromPoint(sampleX, sampleY);

      return {
        header: { bottom: headerBox.bottom, height: headerBox.height },
        nav: { top: navBox.top, bottom: navBox.bottom, left: navBox.left, right: navBox.right, width: navBox.width, height: navBox.height },
        viewport: { width: window.innerWidth, height: window.innerHeight },
        navContainsTopElement: topElement ? nav.contains(topElement) : false,
        topElementTag: topElement?.tagName || ""
      };
    });

    expect(geometry).not.toBeNull();
    expect(geometry.nav.top).toBeGreaterThanOrEqual(geometry.header.bottom - 2);
    expect(geometry.nav.top).toBeLessThanOrEqual(geometry.header.bottom + 2);
    expect(geometry.nav.left).toBeLessThanOrEqual(1);
    expect(geometry.nav.right).toBeGreaterThanOrEqual(geometry.viewport.width - 1);
    expect(geometry.nav.height).toBeGreaterThan(geometry.viewport.height * 0.65);
    expect(geometry.nav.bottom).toBeGreaterThanOrEqual(geometry.viewport.height - 2);
    expect(geometry.navContainsTopElement).toBe(true);

    await nav.click({ position: { x: 10, y: Math.min(geometry.nav.height - 10, 240) } });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(contentProbe).toBeVisible();
  });
}
