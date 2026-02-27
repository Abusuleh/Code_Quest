import { test } from "@playwright/test";

test.skip("parent registration flow (pending auth routes)", async ({ page }) => {
  await page.goto("/");
});
