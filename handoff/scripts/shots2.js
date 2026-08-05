const puppeteer = require("puppeteer-core");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = process.env.TARGET || "http://localhost:3000/";
const W = parseInt(process.env.W || "1440", 10);
const H = parseInt(process.env.H || "900", 10);
const TAG = process.env.TAG || "v3";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
    defaultViewport: { width: W, height: H },
  });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message.slice(0, 200)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 200)); });

  await page.goto(URL, { waitUntil: "networkidle0", timeout: 90000 });
  await new Promise((r) => setTimeout(r, 2800));
  await page.screenshot({ path: `${__dirname}/${TAG}-hero.png` });

  // Walk down gradually so scroll-driven reveals scrub properly.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 350) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await new Promise((r) => setTimeout(r, 130));
  }
  await new Promise((r) => setTimeout(r, 1200));

  const targets = ["about", "work", "capabilities", "gallery", "process", "timeline", "contact"];
  for (const id of targets) {
    const ok = await page.evaluate((i) => {
      const el = document.getElementById(i);
      if (!el) return false;
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 30);
      return true;
    }, id);
    if (!ok) { console.log("missing section:", id); continue; }
    await new Promise((r) => setTimeout(r, 900));
    await page.screenshot({ path: `${__dirname}/${TAG}-${id}.png` });
  }

  // Audit: anything still invisible after a full scroll?
  const audit = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll("section[id], footer").forEach((sec) => {
      let hidden = 0;
      sec.querySelectorAll("*").forEach((el) => {
        if (el.closest("[aria-hidden='true']")) return;
        if (el.classList && el.classList.contains("sr-only")) return;
        if (parseFloat(getComputedStyle(el).opacity) < 0.05) hidden++;
      });
      out.push({ section: sec.id || sec.tagName.toLowerCase(), stillHidden: hidden });
    });
    return out;
  });

  console.log(JSON.stringify({
    viewport: `${W}x${H}`,
    docHeight: h,
    horizontalScroll: await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1),
    audit,
    errors: errors.slice(0, 6),
  }, null, 1));
  await browser.close();
})().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
