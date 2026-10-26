// Builds DTCG token JSON (exported from Figma Variables) into:
//   build/css/tokens.css  -> CSS custom properties (light on :root, dark on [data-theme="dark"])
//   build/json/tokens.json -> flat JSON for agents / docs
import StyleDictionary from "style-dictionary";

const shared = {
  usesDtcg: true,
  log: { verbosity: "silent", warnings: "disabled" },
};

// 1. Light (+ primitives) on :root
const light = new StyleDictionary({
  ...shared,
  source: ["src/primitives.json", "src/semantic.light.json"],
  platforms: {
    css: {
      transformGroup: "css",
      prefix: "ds",
      buildPath: "build/css/",
      files: [{ destination: "light.css", format: "css/variables", options: { selector: ":root", outputReferences: false } }],
    },
    json: {
      transformGroup: "js",
      buildPath: "build/json/",
      files: [{ destination: "tokens.json", format: "json/flat" }],
    },
  },
});

// 2. Dark: only semantic tokens, scoped to [data-theme="dark"]
const dark = new StyleDictionary({
  ...shared,
  include: ["src/primitives.json"],
  source: ["src/semantic.dark.json"],
  platforms: {
    css: {
      transformGroup: "css",
      prefix: "ds",
      buildPath: "build/css/",
      files: [{
        destination: "dark.css",
        format: "css/variables",
        filter: (token) => token.isSource,
        options: { selector: '[data-theme="dark"]', outputReferences: false },
      }],
    },
  },
});

await light.buildAllPlatforms();
await dark.buildAllPlatforms();

// Combine into one entry file
import { readFile, writeFile } from "node:fs/promises";
const [l, d] = await Promise.all([readFile("build/css/light.css", "utf8"), readFile("build/css/dark.css", "utf8")]);
await writeFile("build/css/tokens.css", `${l}\n${d}`);
console.log("✔ tokens built → build/css/tokens.css, build/json/tokens.json");
