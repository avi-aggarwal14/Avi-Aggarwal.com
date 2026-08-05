/**
 * Repair UTF-8 that was read as CP1252 and re-encoded as UTF-8.
 *
 * "—" (U+2014, bytes E2 80 94) misread as CP1252 becomes the three characters
 * U+00E2 U+20AC U+201D. Reversing it means mapping each character back to the
 * single CP1252 byte it came from, then decoding that byte run as UTF-8.
 *
 * My first scan looked for â and missed this entirely, because
 * CP1252 maps byte 0x80 to U+20AC, not U+0080.
 */
const fs = require("fs");
const path = require("path");

// Unicode -> CP1252 byte, for the 0x80-0x9F range that differs from Latin-1.
const CP1252 = {
  0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84, 0x2026: 0x85,
  0x2020: 0x86, 0x2021: 0x87, 0x02c6: 0x88, 0x2030: 0x89, 0x0160: 0x8a,
  0x2039: 0x8b, 0x0152: 0x8c, 0x017d: 0x8e, 0x2018: 0x91, 0x2019: 0x92,
  0x201c: 0x93, 0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
  0x02dc: 0x98, 0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b, 0x0153: 0x9c,
  0x017e: 0x9e, 0x0178: 0x9f,
};

function toByte(cp) {
  if (cp <= 0xff) return cp;
  return CP1252[cp] !== undefined ? CP1252[cp] : null;
}

/** True if the text contains a run that decodes as a UTF-8 multi-byte sequence. */
function looksMojibake(text) {
  // A leading Â or Ã or â followed by another high char is the signature.
  return /[ÂÃâÅË][-ÿ -⏿Ő-Ɠ]/.test(text);
}

function repair(text) {
  const bytes = [];
  for (const ch of text) {
    const b = toByte(ch.codePointAt(0));
    if (b === null) return null; // not representable — bail, don't corrupt further
    bytes.push(b);
  }
  const decoded = Buffer.from(bytes).toString("utf8");
  // If the round trip produced replacement chars, the input was not mojibake.
  if (decoded.includes("�")) return null;
  return decoded;
}

const roots = ["src", "docs", "README.md"];
const exts = new Set([".ts", ".tsx", ".css", ".md", ".mjs", ".json", ".svg"]);
const files = [];
function walk(p) {
  const st = fs.statSync(p);
  if (st.isDirectory()) { for (const e of fs.readdirSync(p)) walk(path.join(p, e)); return; }
  if (exts.has(path.extname(p))) files.push(p);
}
for (const r of roots) if (fs.existsSync(r)) walk(r);

const fixed = [], skipped = [], clean = [];
for (const f of files) {
  let t = fs.readFileSync(f, "utf8");
  const hadBom = t.charCodeAt(0) === 0xfeff;
  if (hadBom) t = t.slice(1);
  if (!looksMojibake(t)) {
    if (hadBom) { fs.writeFileSync(f, t, "utf8"); fixed.push(f + " (BOM only)"); }
    else clean.push(f);
    continue;
  }
  const out = repair(t);
  if (out === null) { skipped.push(f); continue; }
  fs.writeFileSync(f, out, "utf8");
  fixed.push(f);
}

console.log(JSON.stringify({ fixedCount: fixed.length, fixed, skipped, cleanCount: clean.length }, null, 1));
