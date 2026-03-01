import { chromium } from "playwright";

const run = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://codequest.world", { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "evidence/m3-footer-2026.png", fullPage: true });
  await browser.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
