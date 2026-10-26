#!/usr/bin/env node
// Captures the BUILT side of a design QA: screenshot + DS components on the page +
// computed styles reverse-mapped to design tokens. Used by the ds-design-qa skill.
//
// Usage:
//   node scripts/qa-snapshot.mjs <url> [--name dashboard] [--viewport 1280x800] [--theme light|dark|both] [--selector "main"]
//
// Examples:
//   node scripts/qa-snapshot.mjs "http://localhost:6006/iframe.html?id=pages-fintech-app--dashboard-page" --name dashboard --theme both
//   node scripts/qa-snapshot.mjs http://localhost:5173 --name playground-home
//
// Output: qa-output/<name>/{screenshot-<theme>.png, snapshot-<theme>.json, summary-<theme>.md}

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith("--") && !args[args.indexOf(a) - 1]?.startsWith("--"));
const opt = (k, d) => (args.includes(`--${k}`) ? args[args.indexOf(`--${k}`) + 1] : d);
if (!url) {
  console.error('Usage: node scripts/qa-snapshot.mjs <url> [--name x] [--viewport 1280x800] [--theme light|dark|both] [--selector "main"]');
  process.exit(1);
}
const name = opt("name", "snapshot");
const [vw, vh] = opt("viewport", "1280x800").split("x").map(Number);
const themeArg = opt("theme", "light");
const themes = themeArg === "both" ? ["light", "dark"] : [themeArg];
const selector = opt("selector", "auto"); // auto = #storybook-root, #root, main, then body

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("✖ Playwright is missing. Run: pnpm install && npx playwright install chromium");
  process.exit(1);
}

const outDir = join("qa-output", name);
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();

for (const theme of themes) {
  const page = await browser.newPage({ viewport: { width: vw, height: vh } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
  await page.waitForTimeout(400);

  const data = await page.evaluate((rootSel) => {
    // 1. Collect every token (CSS variables named after the Figma code syntax) and its resolved value
    const SEMANTIC_COLOR = /^--(content|icon|surface|border|action)-|^--focus-ring$/;
    const isColorToken = (n) => (SEMANTIC_COLOR.test(n) && !n.startsWith("--border-width-") && !n.startsWith("--border-focus-ring-width")) || n.startsWith("--color-primitives-");
    const rootStyle = getComputedStyle(document.documentElement);
    const names = new Set();
    for (const sheet of document.styleSheets) {
      let rules;
      try { rules = sheet.cssRules; } catch { continue; }
      const walk = (list) => {
        for (const r of list) {
          if (r.style) for (const p of r.style) if (p.startsWith("--") && !p.startsWith("--tw-")) names.add(p);
          if (r.cssRules) walk(r.cssRules);
        }
      };
      walk(rules);
    }
    const probe = document.createElement("div");
    document.body.appendChild(probe);
    const norm = (prop, v) => { probe.style[prop] = ""; probe.style[prop] = v; return getComputedStyle(probe)[prop]; };
    const colorToToken = {}, sizeToToken = {};
    for (const n of names) {
      const raw = rootStyle.getPropertyValue(n).trim();
      if (!raw) continue;
      if (isColorToken(n)) {
        const c = norm("color", raw);
        (colorToToken[c] ||= []).push(n);
      } else if (/^--(space|radius)-|-font-size$/.test(n)) {
        (sizeToToken[raw] ||= []).push(n);
      }
    }
    probe.remove();

    const tokenFor = (kind, v) => {
      if (!v || v === "0px" || v === "rgba(0, 0, 0, 0)" || v === "normal" || v === "none") return null;
      if (kind.startsWith("color")) {
        // kind = "color:bg" | "color:text" | "color:border" → prefer the matching semantic group
        const hits = colorToToken[v];
        if (!hits) return `RAW ${v}`;
        const group = { bg: /^--(surface|action)-/, text: /^--(content|icon)-/, border: /^--border-|^--focus-ring$/ }[kind.split(":")[1]];
        const same = hits.filter((t) => group.test(t));
        const semantic = hits.filter((t) => SEMANTIC_COLOR.test(t));
        return (same.length ? same : semantic.length ? semantic : hits).join(" | ");
      }
      const pref = { space: /^--space-/, radius: /^--radius-/, size: /-font-size$/ }[kind];
      const hit = (sizeToToken[v] || []).find((t) => pref.test(t) && !t.startsWith("--foundation-primitives-"));
      return hit || `RAW ${v}`;
    };

    // 2. Walk visible elements under root
    const root = rootSel === "auto"
      ? ["#storybook-root", "#root", "main", "body"].map((q) => document.querySelector(q)).find((el) => el && el.getBoundingClientRect().height > 0)
      : document.querySelector(rootSel) || document.body;
    const rootBox = root.getBoundingClientRect();
    const els = [];
    const dsCount = {};
    for (const el of root.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      const ds = el.getAttribute("data-ds");
      if (ds) dsCount[ds] = (dsCount[ds] || 0) + 1;
      const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(" ").trim();
      const hasBox = cs.backgroundColor !== "rgba(0, 0, 0, 0)" || cs.borderTopWidth !== "0px";
      if (!ds && !own && !hasBox && !["INPUT", "BUTTON", "IMG", "SVG"].includes(el.tagName)) continue;
      const pad = [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft];
      els.push({
        ds: ds || el.closest("[data-ds]")?.getAttribute("data-ds") || null,
        dsRoot: !!ds,
        tag: el.tagName.toLowerCase(),
        text: own.slice(0, 60) || undefined,
        box: { x: Math.round(r.x - rootBox.x), y: Math.round(r.y - rootBox.y), w: Math.round(r.width), h: Math.round(r.height) },
        tokens: {
          color: own ? tokenFor("color:text", cs.color) : undefined,
          background: tokenFor("color:bg", cs.backgroundColor) || undefined,
          border: cs.borderTopWidth !== "0px" ? tokenFor("color:border", cs.borderTopColor) : undefined,
          radius: tokenFor("radius", cs.borderTopLeftRadius) || undefined,
          padding: [...new Set(pad.map((p) => tokenFor("space", p)).filter(Boolean))].join(" / ") || undefined,
          gap: cs.display.includes("flex") || cs.display.includes("grid") ? tokenFor("space", cs.rowGap) || undefined : undefined,
          fontSize: own ? tokenFor("size", cs.fontSize) : undefined,
          fontWeight: own ? cs.fontWeight : undefined,
        },
      });
    }
    const raw = els.flatMap((e) => Object.entries(e.tokens).filter(([, v]) => typeof v === "string" && v.includes("RAW")).map(([k, v]) => ({ el: e.text || e.ds || e.tag, prop: k, value: v })));
    const handRolled = [...root.querySelectorAll("button, input, select, textarea, [role=dialog]")]
      .filter((el) => !el.closest("[data-ds]") && el.getBoundingClientRect().width > 0 && getComputedStyle(el).visibility !== "hidden")
      .map((el) => `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("placeholder") || "").trim().slice(0, 40)}"`);
    root.setAttribute("data-qa-root", "");
    return { dsComponents: dsCount, elementCount: els.length, rawValues: raw, handRolled, elements: els };
  }, selector);

  await page.locator("[data-qa-root]").first().screenshot({ path: `${join(outDir, `screenshot-${theme}.png`)}` });
  writeFileSync(`${join(outDir, `snapshot-${theme}.json`)}`, JSON.stringify({ url, theme, viewport: `${vw}x${vh}`, ...data }, null, 2));

  const md = [
    `# QA snapshot: ${name} (${theme}, ${vw}x${vh})`,
    `URL: ${url}`,
    "",
    "## DS components on the page",
    ...Object.entries(data.dsComponents).map(([k, v]) => `- ${k} × ${v}`),
    "",
    `## Hand-rolled interactive elements (not from @tawan-design/ui): ${data.handRolled.length}`,
    ...data.handRolled.map((h) => `- ${h}`),
    "",
    `## Raw (non-token) values: ${data.rawValues.length}`,
    ...data.rawValues.slice(0, 50).map((r) => `- ${r.el} → ${r.prop}: ${r.value}`),
    "",
    `Full element list: snapshot-${theme}.json · Screenshot: screenshot-${theme}.png`,
  ].join("\n");
  writeFileSync(`${join(outDir, `summary-${theme}.md`)}`, md + "\n");
  console.log(`✔ ${theme}: ${Object.keys(data.dsComponents).length} DS component types, ${data.handRolled.length} hand-rolled, ${data.rawValues.length} raw values → ${outDir}`);
  await page.close();
}
await browser.close();
