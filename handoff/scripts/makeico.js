/**
 * Render public/icon.svg to a 64x64 PNG with headless Chrome, then wrap it in
 * an ICO container. Modern browsers accept PNG-in-ICO, so no BMP encoding is
 * needed — the ICO is a 6-byte header, one 16-byte directory entry, and the
 * PNG bytes.
 */
const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ROOT = "D:/Avi-Aggarwal.com";
const SIZE = 64;

(async () => {
  const svg = fs.readFileSync(path.join(ROOT, "public/icon.svg"), "utf8");

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
    defaultViewport: { width: SIZE, height: SIZE, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  await page.setContent(
    `<html><body style="margin:0;width:${SIZE}px;height:${SIZE}px">${svg}</body></html>`,
    { waitUntil: "networkidle0" },
  );
  const png = await page.screenshot({ omitBackground: false, type: "png" });
  await browser.close();

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count

  const entry = Buffer.alloc(16);
  entry.writeUInt8(SIZE === 256 ? 0 : SIZE, 0); // width
  entry.writeUInt8(SIZE === 256 ? 0 : SIZE, 1); // height
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8); // data size
  entry.writeUInt32LE(6 + 16, 12); // data offset

  const ico = Buffer.concat([header, entry, Buffer.from(png)]);
  const out = path.join(ROOT, "src/app/favicon.ico");
  fs.writeFileSync(out, ico);
  console.log("wrote", out, ico.length, "bytes");
})().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
