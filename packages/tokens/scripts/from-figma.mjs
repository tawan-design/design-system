// Converts the raw Figma Variables export (figma/variables.json) into DTCG token files in src/.
// Run after re-exporting from Figma: `pnpm --filter @tawan-design/tokens from-figma`.
//
// Rules:
// - Token paths follow the Figma variable names ("color primitives/neutral/90" → color-primitives.neutral.90).
// - The CSS variable name is the Figma code syntax, stored in $extensions["com.figma"].codeSyntax.
// - Aliases stay aliases ({color-primitives.neutral.90}), never resolved to hex.
// - Default modes are built; the other modes are written to src/modes/ for later themes.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const exp = JSON.parse(readFileSync(new URL("../figma/variables.json", import.meta.url), "utf8"));
const out = (f) => new URL(`../src/${f}`, import.meta.url);

// Collection → { group prefix for the token path, default mode, output file for the default mode }
const COLLECTIONS = {
  "00 Primitives": { group: null, defaultMode: "Brand 1", file: "primitives.json" },
  Colors: { group: "color", file: { Light: "semantic.light.json", Dark: "semantic.dark.json" } },
  Spacing: { group: "spacing", defaultMode: "Value", file: "scales.json" },
  Radius: { group: "radius", defaultMode: "Balanced", file: "scales.json" },
  Size: { group: "size", defaultMode: "Value", file: "scales.json" },
  Border: { group: "border", defaultMode: "Value", file: "scales.json" },
  Opacity: { group: "opacity", defaultMode: "Value", file: "scales.json" },
  Elevation: { group: "elevation", defaultMode: "Value", file: "scales.json" },
  Typography: { group: "typography", defaultMode: "Value", file: "scales.json" },
  "Font family": { group: null, defaultMode: "Font1", file: "scales.json" },
};

const slug = (s) => s.trim().toLowerCase().replace(/\s+/g, "-");
const pathOf = {}; // Figma variable name → token path
const typeOf = {}; // Figma variable name → DTCG $type

function dtcgType(collection, name, figmaType) {
  if (figmaType === "C") return "color";
  if (figmaType === "S") return "fontFamily";
  const n = name.toLowerCase();
  if (/font-weight/.test(n)) return "fontWeight";
  if (/opacity|elevation/.test(n) || collection === "Opacity" || collection === "Elevation") return "number";
  return "dimension";
}

// Names are only unique per collection (e.g. "overlay" is in both Opacity and Elevation),
// so every map is keyed by "collection::name".
const keyOf = (collection, name) => `${collection}::${name}`;
const byName = {}; // Figma name → keys (to resolve aliases, which reference names only)
const valuesOf = {};

// Pass 1: paths and types for every variable
for (const c of exp.collections) {
  const cfg = COLLECTIONS[c.name];
  if (!cfg) throw new Error(`Unknown collection "${c.name}": add it to COLLECTIONS`);
  for (const [name, t, , values] of c.variables) {
    const key = keyOf(c.name, name);
    const parts = name.split("/").map(slug);
    pathOf[key] = cfg.group ? [cfg.group, ...parts] : parts;
    (byName[name] ??= []).push(key);
    valuesOf[key] = values;
    const first = values[0];
    typeOf[key] = typeof first === "string" && first.startsWith("@") ? null : dtcgType(c.name, name, t);
  }
}

function resolveAlias(target, from) {
  const keys = byName[target] ?? [];
  if (keys.length !== 1) throw new Error(`${from}: alias to "${target}" matches ${keys.length} variables`);
  return keys[0];
}

// Aliased tokens take the type of what they point to
for (const key of Object.keys(typeOf)) {
  let k = key;
  while (!typeOf[k]) k = resolveAlias(valuesOf[k][0].slice(1), key);
  typeOf[key] = typeOf[k];
}

function tokenValue(raw, type, name) {
  if (typeof raw === "string" && raw.startsWith("@")) {
    return `{${pathOf[resolveAlias(raw.slice(1), name)].join(".")}}`;
  }
  if (type === "dimension") return `${raw}px`;
  // Figma stores opacity as 0–100; CSS needs 0–1
  if (type === "number" && /opacity/.test(name)) return Math.round(raw) / 100;
  return raw;
}

function setPath(tree, path, token) {
  let node = tree;
  for (const p of path.slice(0, -1)) node = node[p] ??= {};
  node[path.at(-1)] = token;
}

const files = {}; // file name → token tree
const tree = (f, description) => (files[f] ??= { $description: description });

for (const c of exp.collections) {
  const cfg = COLLECTIONS[c.name];
  c.modes.forEach((mode, i) => {
    let file;
    if (typeof cfg.file === "object") file = cfg.file[mode];
    else if (mode === cfg.defaultMode) file = cfg.file;
    else file = `modes/${slug(c.name.replace(/^\d+\s*/, ""))}.${slug(mode)}.json`;
    const isDefault = typeof cfg.file === "object" || mode === cfg.defaultMode;
    const desc = isDefault
      ? `Generated from Figma Variables (${exp.source.file}). Do not hand-edit: run the ds-tokens-sync skill.`
      : `Figma collection "${c.name}", mode "${mode}". Stored for a later theme; not built yet. Do not hand-edit.`;
    const t = tree(file, desc);
    for (const [name, , code, values, description] of c.variables) {
      const raw = values.length === 1 ? values[0] : values[i];
      // Non-default modes only keep values that differ from the default mode
      if (!isDefault && values.length > 1 && raw === values[c.modes.indexOf(cfg.defaultMode)]) continue;
      if (!isDefault && values.length === 1) continue;
      const key = keyOf(c.name, name);
      const token = { $type: typeOf[key], $value: tokenValue(raw, typeOf[key], name) };
      if (description) token.$description = description;
      token.$extensions = { "com.figma": { name, collection: c.name, codeSyntax: code } };
      setPath(t, pathOf[key], token);
    }
  });
}

mkdirSync(out("modes/"), { recursive: true });
for (const [f, t] of Object.entries(files).filter(([, t]) => Object.keys(t).length > 1)) writeFileSync(out(f), JSON.stringify(t, null, 2) + "\n");
console.log(`✔ ${Object.keys(pathOf).length} variables → ${Object.keys(files).filter((f) => Object.keys(files[f]).length > 1).sort().join(", ")}`);
