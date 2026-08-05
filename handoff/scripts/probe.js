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
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3000));

  // Sample at rAF rate for 20s, completely still at the top of the page.
  // Track every layer that could blank the hero: the parallax wrapper's
  // opacity/transform, the h1, the rotator words, and the filament SVG.
  const report = await page.evaluate(async () => {
    const wrapper = document.querySelector("#top > div.relative.w-full");
    const h1 = document.querySelector("h1");
    const svg = document.querySelector('svg[viewBox="0 0 696 316"]');
    const svgHost = svg && svg.closest("div[aria-hidden]");
    const firstPath = svg && svg.querySelector("path");

    const dips = [];
    let samples = 0;
    const t0 = performance.now();
    let prev = null;

    while (performance.now() - t0 < 20000) {
      const t = Math.round(performance.now() - t0);
      const snap = {
        wrapOpacity: wrapper ? parseFloat(getComputedStyle(wrapper).opacity) : -1,
        wrapTransform: wrapper ? getComputedStyle(wrapper).transform : "",
        h1Opacity: h1 ? parseFloat(getComputedStyle(h1).opacity) : -1,
        rotWords: document.querySelectorAll(".text-rotator span[aria-label]").length,
        rotPeak: (() => {
          let peak = 0;
          document.querySelectorAll(".text-rotator span[aria-label]").forEach((w) => {
            w.querySelectorAll("span").forEach((l) => {
              const o = parseFloat(getComputedStyle(l).opacity);
              if (o > peak) peak = o;
            });
          });
          return +peak.toFixed(2);
        })(),
        svgOpacity: svg ? parseFloat(getComputedStyle(svg).opacity) : -1,
        svgHostOpacity: svgHost ? parseFloat(getComputedStyle(svgHost).opacity) : -1,
        pathOpacity: firstPath ? parseFloat(getComputedStyle(firstPath).opacity) : -1,
        pathCount: svg ? svg.querySelectorAll("path").length : 0,
      };
      samples++;

      const bad =
        snap.wrapOpacity < 0.95 ||
        snap.h1Opacity < 0.95 ||
        snap.rotPeak < 0.1 ||
        snap.svgOpacity < 0.5 ||
        snap.pathCount === 0;

      const badPrev = prev &&
        (prev.wrapOpacity < 0.95 || prev.h1Opacity < 0.95 || prev.rotPeak < 0.1);

      if (bad && dips.length < 40 && (!badPrev || dips.length === 0 || dips[dips.length-1].t < t - 100)) {
        dips.push({ t, ...snap, wrapTransform: snap.wrapTransform.slice(0, 40) });
      } else if (bad && dips.length && dips[dips.length - 1].t >= t - 100) {
        // extend the previous dip
        dips[dips.length - 1].until = t;
      }
      prev = snap;
      await new Promise((r) => requestAnimationFrame(r));
    }

    return { samples, dips };
  });

  console.log(JSON.stringify(report, null, 1));
  await browser.close();
})().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
