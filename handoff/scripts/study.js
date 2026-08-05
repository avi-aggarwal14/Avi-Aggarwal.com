/**
 * Study a reference site: full-page screenshots at desktop + mobile, plus a
 * structural read (section order, heading ladder, type scale, palette, motion
 * libraries). Design research only — no assets or code are copied.
 */
const puppeteer = require("puppeteer-core");
const CHROME = "C:\\Users\\vinee\\..\\..\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const EXEC = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = process.env.TARGET;
const TAG = process.env.TAG || "ref";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EXEC,
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
    defaultViewport: { width: 1440, height: 900 },
  });
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 90000 });
  await new Promise((r) => setTimeout(r, 3000));

  await page.screenshot({ path: `${__dirname}/${TAG}-top.png` });

  const info = await page.evaluate(() => {
    const cs = (el, p) => (el ? getComputedStyle(el).getPropertyValue(p) : null);
    const body = document.body;

    // Colour census: count computed colours across all painted elements.
    const colours = {};
    const bump = (c) => {
      if (!c || c === "rgba(0, 0, 0, 0)" || c === "transparent") return;
      colours[c] = (colours[c] || 0) + 1;
    };
    document.querySelectorAll("*").forEach((el) => {
      const s = getComputedStyle(el);
      bump(s.backgroundColor);
      bump(s.color);
    });
    const topColours = Object.entries(colours)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 14);

    // Font census.
    const fonts = {};
    document.querySelectorAll("*").forEach((el) => {
      const f = getComputedStyle(el).fontFamily;
      if (f) fonts[f] = (fonts[f] || 0) + 1;
    });
    const topFonts = Object.entries(fonts).sort((a, b) => b[1] - a[1]).slice(0, 6);

    const headings = [...document.querySelectorAll("h1,h2,h3")].slice(0, 24).map((h) => ({
      tag: h.tagName,
      text: (h.innerText || "").trim().slice(0, 60),
      size: getComputedStyle(h).fontSize,
      family: getComputedStyle(h).fontFamily.split(",")[0],
      weight: getComputedStyle(h).fontWeight,
      transform: getComputedStyle(h).textTransform,
      spacing: getComputedStyle(h).letterSpacing,
    }));

    const sections = [...document.querySelectorAll("section, main > div, [id]")]
      .filter((el) => el.getBoundingClientRect().height > 200)
      .slice(0, 20)
      .map((el) => ({
        tag: el.tagName,
        id: el.id || null,
        cls: (el.className || "").toString().slice(0, 70),
        h: Math.round(el.getBoundingClientRect().height),
      }));

    return {
      title: document.title,
      bodyBg: cs(body, "background-color"),
      bodyColor: cs(body, "color"),
      docHeight: document.documentElement.scrollHeight,
      topColours,
      topFonts,
      headings,
      sections,
      scripts: [...document.querySelectorAll("script[src]")]
        .map((s) => s.src.split("/").pop())
        .slice(0, 14),
      hasCanvas: !!document.querySelector("canvas"),
      hasVideo: !!document.querySelector("video"),
      imgCount: document.querySelectorAll("img").length,
    };
  });

  // A few scroll stops for the look further down.
  const h = info.docHeight;
  const stops = [0.18, 0.36, 0.54, 0.72, 0.9];
  for (let i = 0; i < stops.length; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(h * stops[i]));
    await new Promise((r) => setTimeout(r, 1400));
    await page.screenshot({ path: `${__dirname}/${TAG}-s${i + 1}.png` });
  }

  console.log(JSON.stringify(info, null, 1));
  await browser.close();
})().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
