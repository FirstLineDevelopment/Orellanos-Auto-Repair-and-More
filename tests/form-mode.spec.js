import { expect, test } from "@playwright/test";

test("demo forms clearly do not submit to a live business", async ({ page }) => {
  await page.goto("/");
  const form = page.locator("[data-firstline-form]").first();
  await expect(form).toHaveAttribute("data-form-mode", "demo");

  await form.locator('input[name="name"]').fill("Demo User");
  await form.locator('input[name="email"]').fill("demo@example.com");
  await form.getByRole("button").click();

  await expect(form.locator(".fl-status")).toContainText(/Demo only: no request was sent/i);
});
