#!/usr/bin/env node
// Prints the CODE side of a drift check: every component in catalog.json with its
// props and allowed values, plus whether it has a story and a Code Connect file.
// Used by the ds-drift-check skill. Usage: node scripts/catalog-summary.mjs [--json]
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

const catalogPath = "packages/ui/catalog.json";
if (!existsSync(catalogPath)) {
  console.error("✖ catalog.json missing. Run: pnpm --filter @tawan-design/ui catalog");
  process.exit(1);
}
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));

const rows = catalog.components.map((c) => {
  const dir = join("packages/ui", dirname(c.file));
  const base = c.file.split("/").pop().replace(".tsx", "");
  const figmaFile = join(dir, `${base}.figma.tsx`);
  let figmaUrl = null;
  if (existsSync(figmaFile)) {
    const m = readFileSync(figmaFile, "utf8").match(/https:\/\/www\.figma\.com\/[^"'`\s]+/);
    figmaUrl = m ? m[0] : null;
  }
  const isRoot = c.name === base; // e.g. Card (root) vs CardHeader (sub-part)
  return {
    component: c.name,
    part: isRoot ? "root" : `part of ${base}`,
    props: Object.fromEntries(
      Object.entries(c.props).map(([k, p]) => [k, p.type.replaceAll('"', "").replace(/ \| null$/, "")]),
    ),
    story: c.story,
    codeConnect: existsSync(figmaFile) && isRoot ? (figmaUrl?.includes("FILE_KEY") ? "placeholder URL" : figmaUrl || "yes") : isRoot ? "missing" : "n/a",
  };
});

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(rows, null, 2));
} else {
  console.log("| Component | Part | Props (allowed values) | Story | Code Connect |");
  console.log("|---|---|---|---|---|");
  for (const r of rows) {
    const props = Object.entries(r.props).map(([k, v]) => `\`${k}\`: ${v.replaceAll(" | ", " \\| ")}`).join("<br>") || "–";
    console.log(`| ${r.component} | ${r.part} | ${props} | ${r.story ?? "missing"} | ${r.codeConnect} |`);
  }
}
