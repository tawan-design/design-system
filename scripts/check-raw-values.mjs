#!/usr/bin/env node
// Flags hardcoded values that should be tokens. Used in CI and by the ds-audit skill.
// Usage: node scripts/check-raw-values.mjs [paths...]   (default: packages/ui/src apps/playground/src)
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const roots = process.argv.slice(2).length ? process.argv.slice(2) : ["packages/ui/src", "apps/playground/src"];
const exts = new Set([".tsx", ".ts", ".jsx", ".js"]);
const ignore = [/\.stories\./, /\.figma\./, /node_modules/, /dist/];

const rules = [
  { name: "hex color", re: /#[0-9a-fA-F]{3,8}\b(?![\w-])/g },
  { name: "rgb/hsl color", re: /\b(rgba?|hsla?)\(/g },
  { name: "arbitrary color class", re: /\b(bg|text|border|outline|ring|fill|stroke)-\[(#|rgb|hsl|var)/g },
  { name: "arbitrary spacing class", re: /\b-?(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y)-\[[^\]]+\]/g },
  { name: "arbitrary radius/font-size", re: /\b(rounded(-\w+)?|text)-\[\d/g },
  { name: "inline style px", re: /style=\{\{[^}]*\b\d+px/g },
];

let count = 0;
function walk(p) {
  const s = statSync(p);
  if (s.isDirectory()) return readdirSync(p).forEach((f) => walk(join(p, f)));
  if (!exts.has(extname(p)) || ignore.some((r) => r.test(p))) return;
  readFileSync(p, "utf8").split("\n").forEach((line, i) => {
    if (line.includes("ds-allow-raw")) return; // explicit, reviewed escape hatch
    for (const { name, re } of rules) {
      for (const m of line.matchAll(re)) {
        count++;
        console.log(`${p}:${i + 1}  ${name}: ${m[0]}`);
      }
    }
  });
}
roots.forEach(walk);
if (count) {
  console.error(`\n✖ ${count} raw value(s). Use token classes (see AGENTS.md), or add "ds-allow-raw" with a reason.`);
  process.exit(1);
}
console.log("✔ no raw values found");
