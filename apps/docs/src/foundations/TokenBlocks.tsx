// Foundations docs are GENERATED from the token source files,
// so the docs can never drift from the tokens.
import semantic from "@tawan-design/tokens/src/semantic.light.json";
import primitives from "@tawan-design/tokens/src/primitives.json";

type Node = { $value?: unknown; [k: string]: unknown };

function flatten(node: Node, path: string[] = []): { path: string[]; value: unknown }[] {
  if (node && typeof node === "object" && "$value" in node) return [{ path, value: node.$value }];
  return Object.entries(node ?? {})
    .filter(([k]) => !k.startsWith("$"))
    .flatMap(([k, v]) => flatten(v as Node, [...path, k]));
}

const cssVar = (path: string[]) => `--ds-${path.join("-")}`;

export function ColorTokens() {
  const groups = ["bg", "text", "border"] as const;
  return (
    <div className="flex flex-col gap-24">
      {groups.map((g) => (
        <div key={g} className="flex flex-col gap-8">
          <h3 className="text-16 font-semibold text-fg">color/{g}</h3>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            {flatten((semantic as Node).color as Node)
              .filter((t) => t.path[0] === g)
              .map((t) => {
                const name = cssVar(["color", ...t.path]);
                return (
                  <div key={name} className="flex items-center gap-12 rounded-8 border border-border p-8">
                    <div className="size-40 shrink-0 rounded-8 border border-border" style={{ background: `var(${name})` }} />
                    <div className="flex min-w-0 flex-col">
                      <code className="text-12 font-medium text-fg">{`${g}/${t.path.slice(1).join("/")}`}</code>
                      <code className="truncate text-12 text-fg-muted">{String(t.value)}</code>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SpacingTokens() {
  return (
    <div className="flex flex-col gap-8">
      {flatten((primitives as Node).space as Node).map((t) => (
        <div key={t.path.join()} className="flex items-center gap-16">
          <code className="w-64 text-12 text-fg-muted">space/{t.path.join("/")}</code>
          <div className="h-16 rounded-8 bg-brand" style={{ width: `var(${cssVar(["space", ...t.path])})` }} />
          <code className="text-12 text-fg">{String(t.value)} → p-{t.path[0]}, gap-{t.path[0]}</code>
        </div>
      ))}
    </div>
  );
}

export function RadiusTokens() {
  return (
    <div className="flex gap-24">
      {flatten((primitives as Node).radius as Node).map((t) => (
        <div key={t.path.join()} className="flex flex-col items-center gap-8">
          <div className="size-64 border-2 border-border-strong bg-subtle" style={{ borderRadius: `var(${cssVar(["radius", ...t.path])})` }} />
          <code className="text-12 text-fg-muted">rounded-{t.path[0]}</code>
        </div>
      ))}
    </div>
  );
}

export function TypeTokens() {
  return (
    <div className="flex flex-col gap-12">
      {flatten(((primitives as Node).font as Node).size as Node).reverse().map((t) => (
        <div key={t.path.join()} className="flex items-baseline gap-16">
          <code className="w-64 text-12 text-fg-muted">text-{t.path[0]}</code>
          <span className="text-fg" style={{ fontSize: `var(${cssVar(["font", "size", ...t.path])})` }}>
            Send money in seconds
          </span>
        </div>
      ))}
    </div>
  );
}
