const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = process.env.TARGET || "http://localhost:3000/";
const OUT = __dirname;

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--force-device-scale-factor=1"],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text().slice(0, 200));
  });
  page.on("pageerror", (e) => consoleErrors.push("PAGEERROR: " + e.message.slice(0, 200)));

  await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });
  // Let the hero entrance finish before sampling.
  await new Promise((r) => setTimeout(r, 2500));

  // Sample the rotator for 12s at 50ms. Records the peak opacity of any letter
  // in the rotator, so a "blank" frame is unambiguous.
  const samples = await page.evaluate(async () => {
    const rot = document.querySelector(".text-rotator");
    if (!rot) return { error: "rotator not found" };
    const out = [];
    const t0 = performance.now();
    while (performance.now() - t0 < 12000) {
      const letters = rot.querySelectorAll("span[aria-hidden]");
      let peak = 0;
      let text = "";
      const words = rot.querySelectorAll("span[aria-label]");
      words.forEach((w) => {
        const o = parseFloat(getComputedStyle(w).opacity);
        w.querySelectorAll("span").forEach((l) => {
          const lo = parseFloat(getComputedStyle(l).opacity) * (isNaN(o) ? 1 : o);
          if (lo > peak) peak = lo;
        });
      });
      words.forEach((w) => { text += "[" + w.getAttribute("aria-label") + "]"; });
      out.push({
        t: Math.round(performance.now() - t0),
        wordNodes: words.length,
        letterNodes: letters.length,
        peakOpacity: +peak.toFixed(3),
        text,
      });
      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => setTimeout(r, 40));
    }
    return out;
  });

  if (samples.error) {
    console.log(JSON.stringify(samples));
    await browser.close();
    return;
  }

  const blank = samples.filter((s) => s.peakOpacity < 0.08);
  const zeroNodes = samples.filter((s) => s.wordNodes === 0);
  const overlapping = samples.filter((s) => s.wordNodes > 1);

  // Longest consecutive blank run, in ms.
  let longestBlank = 0, run = 0, prevT = 0;
  for (const s of samples) {
    if (s.peakOpacity < 0.08) { run += s.t - prevT; longestBlank = Math.max(longestBlank, run); }
    else run = 0;
    prevT = s.t;
  }

  console.log(JSON.stringify({
    url: URL,
    totalSamples: samples.length,
    durationMs: samples[samples.length - 1].t,
    blankSamples: blank.length,
    framesWithZeroWordNodes: zeroNodes.length,
    framesWithCrossfade: overlapping.length,
    longestBlankRunMs: longestBlank,
    minPeakOpacity: Math.min(...samples.map((s) => s.peakOpacity)),
    distinctWordsSeen: [...new Set(samples.map((s) => s.text))].slice(0, 8),
    consoleErrors: consoleErrors.slice(0, 5),
  }, null, 1));

  // Screenshots so a human (and I) can finally look at it.
  await page.screenshot({ path: path.join(OUT, "shot-hero.png") });
  await page.evaluate(() => document.getElementById("work").scrollIntoView({ block: "start" }));
  await new Promise((r) => setTimeout(r, 1400));
  await page.screenshot({ path: path.join(OUT, "shot-work.png") });
  await page.evaluate(() => document.getElementById("contact").scrollIntoView({ block: "start" }));
  await new Promise((r) => setTimeout(r, 1400));
  await page.screenshot({ path: path.join(OUT, "shot-contact.png") });

  await browser.close();
})().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
