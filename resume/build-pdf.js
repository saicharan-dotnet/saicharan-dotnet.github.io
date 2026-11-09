// Regenerates the resume PDF from resume/resume.html.
// Usage (from the repo root):  node resume/build-pdf.js
// Requires Playwright with Chromium installed (npm i -D playwright && npx playwright install chromium).
const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const root = path.resolve(__dirname, "..");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("file://" + path.join(root, "resume", "resume.html"), { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: path.join(root, "Sai_Charan_Senior_DotNet_Developer_Resume.pdf"),
    format: "Letter",
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();
  console.log("Wrote Sai_Charan_Senior_DotNet_Developer_Resume.pdf");
})();
