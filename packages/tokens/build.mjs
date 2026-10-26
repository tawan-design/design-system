// Builds DTCG token JSON (generated from Figma Variables by scripts/from-figma.mjs) into:
//   build/css/tokens.css   -> CSS custom properties (Light + scales on :root, Dark on [data-theme="dark"])
//   build/json/tokens.json -> flat JSON for agents / docs
// CSS variable names are the Figma code syntax ($extensions["com.figma"].codeSyntax), so
// var(--content-primary) in Figma Dev Mode is var(--content-primary) in code.
// Files in src/modes/ (Brand 2, Sharp/Rounded radius, Font2) are stored for later themes and not built yet.
import StyleDictionary from "style-dictionary";
import { readFile, writeFile } from "node:fs/promises";

StyleDictionary.registerTransform({
  name: "name/figma-code-syntax",
  type: "name",
  transform: (token) => {
    const code = token.$extensions?.["com.figma"]?.codeSyntax;
    if (!code) throw new Error(`Token ${token.path.join(".")} has no Figma code syntax`);
    return code;
  },
});

const transforms = ["attribute/cti", "name/figma-code-syntax", "color/css", "fontFamily/css"];
const shared = { usesDtcg: true, log: { verbosity: "silent", warnings: "disabled" } };
const defaults = ["src/primitives.json", "src/scales.json"];

// 1. Primitives, scales and Light colors on :root
const light = new StyleDictionary({
  ...shared,
  source: [...defaults, "src/semantic.light.json"],
  platforms: {
    css: {
      transforms,
      buildPath: "build/css/",
      files: [{ destination: "light.css", format: "css/variables", options: { selector: ":root", outputReferences: true } }],
    },
    json: {
      transforms,
      buildPath: "build/json/",
      files: [{ destination: "tokens.json", format: "json/flat" }],
    },
  },
});

// 2. Dark: only the semantic colors, scoped to [data-theme="dark"]
const dark = new StyleDictionary({
  ...shared,
  include: defaults,
  source: ["src/semantic.dark.json"],
  platforms: {
    css: {
      transforms,
      buildPath: "build/css/",
      files: [{
        destination: "dark.css",
        format: "css/variables",
        filter: (token) => token.isSource,
        options: { selector: '[data-theme="dark"]', outputReferences: true },
      }],
    },
  },
});

await light.buildAllPlatforms();
await dark.buildAllPlatforms();

// Combine into one entry file
const [l, d] = await Promise.all([readFile("build/css/light.css", "utf8"), readFile("build/css/dark.css", "utf8")]);
await writeFile("build/css/tokens.css", `${l}\n${d}`);

// 3. Tailwind theme, generated so every Figma variable gets its class automatically.
//    Class names keep the Figma names: bg-surface-primary, text-content-secondary, border-border-strong.
const read = async (f) => JSON.parse(await readFile(f, "utf8"));
const [semantic, scales, primitives] = await Promise.all(["src/semantic.light.json", "src/scales.json", "src/primitives.json"].map(read));
const leaves = (node) =>
  node && typeof node === "object" && "$value" in node
    ? [node]
    : Object.entries(node ?? {}).filter(([k]) => !k.startsWith("$")).flatMap(([, v]) => leaves(v));
const code = (t) => t.$extensions["com.figma"].codeSyntax;

const lines = [];
const add = (comment, entries) => lines.push(`  /* ${comment} */`, ...entries.map((e) => `  ${e}`), "");

add("Colors: semantic only, never primitives → bg-surface-primary, text-content-primary, border-border-strong",
  leaves(semantic.color).map((t) => `--color-${code(t)}: var(--${code(t)});`));
add("Spacing → p-16, gap-8 (Figma space-16, space-8)",
  leaves(scales.spacing).map((t) => `--spacing-${code(t).replace(/^space-/, "")}: var(--${code(t)});`));
add("Sizes → h-control-md, size-icon-sm, size-avatar-lg (Figma size-*)",
  leaves(scales.size).map((t) => `--spacing-${code(t).replace(/^size-/, "")}: var(--${code(t)});`));
add("Radius → rounded-sm … rounded-xxl, rounded-pill (Figma radius-*)",
  leaves(scales.radius).map((t) => `--radius-${code(t).replace(/^radius-/, "")}: var(--${code(t)});`));

const roles = [...new Set(leaves(scales.typography).map((t) => code(t).replace(/-(font-family|font-weight|font-size|line-height|letter-spacing)$/, "")))];
add("Type roles → text-body-md, text-heading-lg, text-label-sm, text-code-md (size + line height + letter spacing + weight)",
  roles.flatMap((r) => [
    `--text-${r}: var(--${r}-font-size);`,
    `--text-${r}--line-height: var(--${r}-line-height);`,
    `--text-${r}--letter-spacing: var(--${r}-letter-spacing);`,
    `--text-${r}--font-weight: var(--${r}-font-weight);`,
  ]));
add("Font families → font-primary, font-display, font-mono",
  leaves(scales["font-family"]).map((t) => {
    const name = code(t).replace(/^font-family-/, "");
    const fallback = name === "mono" ? "ui-monospace, monospace" : "ui-sans-serif, system-ui, sans-serif";
    return `--font-${name}: var(--${code(t)}), ${fallback};`;
  }));
add("Font weights → font-regular, font-medium, font-semibold, font-bold",
  leaves(primitives["foundation-primitives"].typography)
    .filter((t) => /font-weight/.test(code(t)))
    .map((t) => `--font-weight-${code(t).replace(/^.*font-weight-/, "")}: var(--${code(t)});`));

const utilities = [
  ...leaves(scales.opacity).map((t) => `@utility ${code(t)} { opacity: var(--${code(t)}); }`),
  ...leaves(scales.border).map((t) => `@utility ${code(t)} { border-width: var(--${code(t)}); }`),
];

await writeFile("build/css/theme.css", `/* GENERATED by packages/tokens/build.mjs from Figma Variables. Do not edit. */
/* Tailwind's default palette, spacing, radius, type and fonts are removed: only token classes exist. */
@theme inline reference {
  --color-*: initial;
  --spacing-*: initial;
  --radius-*: initial;
  --text-*: initial;
  --font-*: initial;
  --font-weight-*: initial;
  --leading-*: initial;
  --tracking-*: initial;

${lines.join("\n")}}

/* Opacity → opacity-disabled, opacity-overlay, opacity-loading · Border widths → border-width-default … */
${utilities.join("\n")}
`);
console.log("✔ tokens built → build/css/tokens.css, build/css/theme.css, build/json/tokens.json");
