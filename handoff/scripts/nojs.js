const puppeteer = require("puppeteer-core");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = process.env.TARGET || "http://localhost:3000/";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
    defaultViewport: { width: 1440, height: 900 },
  });

  // 1. JavaScript completely off — the worst case. If the hero is readable
  //    here, it is readable at first paint on any connection.
  const noJs = await browser.newPage();
  await noJs.setJavaScriptEnabled(false);
  await noJs.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1200));
  await noJs.screenshot({ path: __dirname + "/nojs-hero.png" });

  // 2. Slow 3G with CPU throttling — realistic worst-case real load.
  const slow = await browser.newPage();
  const client = await slow.target().createCDPSession();
  await client.send("Network.emulateNetworkConditions", {
    offline: false,
    downloadThroughput: (400 * 1024) / 8,
    uploadThroughput: (400 * 1024) / 8,
    latency: 400,
  });
  await client.send("Emulation.setCPUThrottlingRate", { rate: 6 });
  await slow.goto(URL, { waitUntil: "domcontentloaded", timeout: 90000 });
  // Screenshot almost immediately — this is the moment the user judges.
  await new Promise((r) => setTimeout(r, 900));
  await slow.screenshot({ path: __dirname + "/slow-hero.png" });

  const readable = await noJs.evaluate(() => {
    const h1 = document.querySelector("h1");
    const p = document.querySelector("#top p");
    const vis = (el) => {
      if (!el) return false;
      const cs = getComputedStyle(el);
      return parseFloat(cs.opacity) > 0.5 && cs.visibility !== "hidden";
    };
    // Check the actual glyph spans, not just the wrappers.
    const glyphs = [...document.querySelectorAll("h1 .hero-char")];
    const visibleGlyphs = glyphs.filter((g) => parseFloat(getComputedStyle(g).opacity) > 0.5).length;
    return {
      h1Visible: vis(h1),
      introVisible: vis(p),
      glyphTotal: glyphs.length,
      glyphsVisible: visibleGlyphs,
      h1Text: h1 ? h1.getAttribute("aria-label") || h1.innerText.slice(0, 30) : null,
    };
  });

  console.log(JSON.stringify({ noJavaScript: readable }, null, 1));
  await browser.close();
})().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
