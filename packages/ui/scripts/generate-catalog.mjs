// Generates catalog.json: every exported component, its props, types and docs.
// This is the GENERATED source agents read ("what exists, what props are real").
// Never hand-edit catalog.json — run `pnpm --filter @tawan-design/ui catalog`.
import { withCustomConfig } from "react-docgen-typescript";
import { readdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const componentsDir = "src/components";
const parser = withCustomConfig("tsconfig.json", {
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  // Only document our own props, not every native HTML attribute
  propFilter: (prop) => !prop.parent || !prop.parent.fileName.includes("node_modules"),
});

const catalog = { $generated: "do not edit — run pnpm --filter @tawan-design/ui catalog", import: "@tawan-design/ui", components: [] };

for (const dir of existsSync(componentsDir) ? readdirSync(componentsDir) : []) {
  const file = join(componentsDir, dir, `${dir}.tsx`);
  if (!existsSync(file)) continue;
  for (const doc of parser.parse(file).filter((d) => /^[A-Z]/.test(d.displayName))) {
    catalog.components.push({
      name: doc.displayName,
      description: doc.description.trim(),
      file,
      story: existsSync(join(componentsDir, dir, `${dir}.stories.tsx`)) ? `Components/${dir}` : null,
      props: Object.fromEntries(
        Object.entries(doc.props).map(([name, p]) => [
          name,
          {
            type: p.type.name === "enum" ? p.type.value.map((v) => v.value).join(" | ") : p.type.name,
            required: p.required,
            default: p.defaultValue?.value ?? undefined,
            description: p.description || undefined,
          },
        ]),
      ),
    });
  }
}

writeFileSync("catalog.json", JSON.stringify(catalog, null, 2) + "\n");
console.log(`✔ catalog.json — ${catalog.components.length} components`);
