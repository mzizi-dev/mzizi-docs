/**
 * APCA 3.0 contrast gate for docs.json brand colours.
 *
 * Mzizi's own stated accessibility standard is APCA 3.0, not WCAG 2.x — see the
 * `accessibility` section of the brand tokens ("Advanced Perceptual Contrast
 * Algorithm for superior readability across all mineral colors"). So this is the
 * check that governs this repo's palette, and it is the same implementation the
 * sibling docs site (shamwari-ai/docs) runs.
 *
 * Why this exists rather than relying on `mint a11y`: that tool's colour check is
 * WCAG-ratio based and, critically, is not polarity-aware. It tests `colors.dark`
 * against BOTH backgrounds and demands 3:1 on each, which is incoherent — `dark`
 * is the shade rendered in LIGHT mode and `light` is the shade rendered in DARK
 * mode. Applying a symmetric test to an asymmetric pair forces both values toward
 * mid-tone mud that serves neither theme.
 *
 * WCAG also masks real failures in this palette. Sodalite's published darkHex
 * (#3D5AFE) scores a WCAG pass against a near-black background but APCA Lc -25.8,
 * below even the Lc 30 floor for non-text UI. It is genuinely hard to read. APCA
 * catches what the ratio hides, which is exactly why the system specifies it.
 *
 * Implementation is APCA-W3 0.1.9, the algorithm behind APCA 3.0.
 * Reference: https://github.com/Myndex/apca-w3
 */

import { readFileSync } from "node:fs";

const Rco = 0.2126729, Gco = 0.7151522, Bco = 0.072175;
const mainTRC = 2.4, normBG = 0.56, normTXT = 0.57, revTXT = 0.62, revBG = 0.65;
const blkThrs = 0.022, blkClmp = 1.414, scale = 1.14, loOffset = 0.027;
const loClip = 0.1, deltaYmin = 0.0005;

/** sRGB hex -> APCA screen luminance (simple 2.4 power curve, soft black clamp). */
function luminance(hex) {
  const h = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`not a 6-digit hex colour: ${hex}`);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const y = Rco * r ** mainTRC + Gco * g ** mainTRC + Bco * b ** mainTRC;
  return y < blkThrs ? y + (blkThrs - y) ** blkClmp : y;
}

/** APCA lightness contrast. Positive = dark text on light bg, negative = the reverse. */
function apca(text, bg) {
  const Yt = luminance(text), Yb = luminance(bg);
  if (Math.abs(Yb - Yt) < deltaYmin) return 0;
  if (Yb > Yt) {
    const S = (Yb ** normBG - Yt ** normTXT) * scale;
    return S < loClip ? 0 : (S - loOffset) * 100;
  }
  const S = (Yb ** revBG - Yt ** revTXT) * scale;
  return S > -loClip ? 0 : (S + loOffset) * 100;
}

// Lc 75 is APCA's minimum for body text. Brand colours here render as links and
// buttons at body size, so that is the bar rather than the Lc 60 large-text tier.
const MIN_LC = 75;

const docs = JSON.parse(readFileSync(new URL("../docs.json", import.meta.url)));
const { primary, light, dark } = docs.colors;
const bgLight = docs.background.color.light;
const bgDark = docs.background.color.dark;

// Each colour is checked ONLY against the background it actually renders on.
const checks = [
  { role: "colors.primary", fg: primary, bg: bgLight, mode: "light mode" },
  { role: "colors.dark", fg: dark, bg: bgLight, mode: "light mode" },
  { role: "colors.light", fg: light, bg: bgDark, mode: "dark mode" },
];

let failed = false;
console.log(`APCA 3.0 contrast check (minimum Lc ${MIN_LC} for body-size text)\n`);
for (const { role, fg, bg, mode } of checks) {
  const lc = apca(fg, bg);
  const ok = Math.abs(lc) >= MIN_LC;
  if (!ok) failed = true;
  const status = ok ? "PASS" : "FAIL";
  console.log(
    `  ${status}  ${role.padEnd(15)} ${fg} on ${bg} (${mode.padEnd(10)}) Lc ${lc.toFixed(1)}`,
  );
}

if (failed) {
  console.error(
    `\n::error::APCA contrast below Lc ${MIN_LC}. Brand colours are set in docs.json.\n` +
      `Remember colors.light renders in DARK mode and colors.dark renders in LIGHT mode —\n` +
      `a value that fails is usually one that was picked for the wrong theme.`,
  );
  process.exit(1);
}
console.log("\nAll brand colours meet APCA 3.0 body-text contrast.");
