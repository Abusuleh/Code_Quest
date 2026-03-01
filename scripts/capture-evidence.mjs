import { chromium } from "playwright";
import fs from "node:fs";

const baseUrl = "https://codequest.world";
const timestamp = Date.now();
const successEmail = `qa+${timestamp}@codequest.world`;

const saveJSON = (path, data) => fs.writeFileSync(path, JSON.stringify(data, null, 2));

const run = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const consoleLogs = [];
  const pageErrors = [];

  page.on("console", (msg) => consoleLogs.push({ type: msg.type(), text: msg.text() }));
  page.on("pageerror", (err) => pageErrors.push(err.message));

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.screenshot({ path: "evidence/home-desktop.png", fullPage: true });

  const fontInfo = await page.evaluate(() => {
    const body = window.getComputedStyle(document.body).fontFamily;
    const logo = document.querySelector("header a");
    const logoFont = logo ? window.getComputedStyle(logo).fontFamily : null;
    return { body, logo: logoFont };
  });
  saveJSON("evidence/fonts.json", fontInfo);

  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.screenshot({ path: "evidence/home-mobile.png", fullPage: true });

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const waitlistSection = page.locator("#waitlist");
  await waitlistSection.scrollIntoViewIfNeeded();
  const emailInput = page.locator('input[placeholder="you@parent.com"]');
  await emailInput.waitFor({ timeout: 30000 });
  await emailInput.fill(successEmail);
  await page.getByRole("button", { name: "Join the Quest" }).click();
  await page.getByText("You're on the list!").waitFor({ timeout: 15000 });
  await page.screenshot({ path: "evidence/waitlist-success.png", fullPage: true });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await waitlistSection.scrollIntoViewIfNeeded();
  await emailInput.waitFor({ timeout: 30000 });
  await emailInput.fill("notanemail");
  await page.getByRole("button", { name: "Join the Quest" }).click();
  await page.locator(".text-cq-red").first().waitFor({ timeout: 15000 });
  await page.screenshot({ path: "evidence/waitlist-error.png", fullPage: true });

  await page.goto(`${baseUrl}/privacy`, { waitUntil: "networkidle" });
  await page.screenshot({ path: "evidence/privacy.png", fullPage: true });

  await page.goto(`${baseUrl}/terms`, { waitUntil: "networkidle" });
  await page.screenshot({ path: "evidence/terms.png", fullPage: true });

  saveJSON("evidence/console.json", { consoleLogs, pageErrors });

  await browser.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
