// Foundations docs are GENERATED from the token source files (exported from Figma Variables),
// so the docs can never drift from the tokens. Each block shows the Figma name, the CSS variable
// and the Tailwind class to use.
import primitives from "@tawan-design/tokens/src/primitives.json";
import scales from "@tawan-design/tokens/src/scales.json";
import light from "@tawan-design/tokens/src/semantic.light.json";
import dark from "@tawan-design/tokens/src/semantic.dark.json";

type Token = { $value: string | number; $type: string; $description?: string; $extensions: { "com.figma": { name: string; codeSyntax: string } } };
type Tree = { [k: string]: Tree | Token | string };

const isToken = (n: unknown): n is Token => !!n && typeof n === "object" && "$value" in n;
const leaves = (node: Tree | Token): Token[] =>
  isToken(node) ? [node] : Object.entries(node).filter(([k]) => !k.startsWith("$")).flatMap(([, v]) => leaves(v as Tree));
const code = (t: Token) => t.$extensions["com.figma"].codeSyntax;
const figmaName = (t: Token) => t.$extensions["com.figma"].name;

const base = { ...(primitives as unknown as Tree), ...(scales as unknown as Tree) };
function lookup(path: string): Token {
  let node: unknown = base;
  for (const p of path.split(".")) node = (node as Tree)[p];
  return node as Token;
}
/** Follows aliases to the final value, and returns the chain of Figma names. */
function resolve(t: Token): { value: string | number; via: string[] } {
  const via: string[] = [];
  let cur = t;
  while (typeof cur.$value === "string" && cur.$value.startsWith("{")) {
    cur = lookup(cur.$value.slice(1, -1));
    via.push(figmaName(cur).replace(/^(color|foundation) primitives\//, ""));
  }
  return { value: cur.$value, via };
}

// Tailwind only generates classes it can see written out in full, so dynamic classes are listed here.
const ROLE_CLASS: Record<string, string> = {
  "body-sm": "text-body-sm", "body-md": "text-body-md", "body-lg": "text-body-lg",
  "label-sm": "text-label-sm", "label-md": "text-label-md", "label-lg": "text-label-lg",
  "heading-xs": "text-heading-xs", "heading-sm": "text-heading-sm", "heading-md": "text-heading-md",
  "heading-lg": "text-heading-lg", "heading-xl": "text-heading-xl",
  "code-sm": "text-code-sm font-mono", "code-md": "text-code-md font-mono",
};
const RADIUS_CLASS: Record<string, string> = {
  sm: "rounded-sm", md: "rounded-md", lg: "rounded-lg", xl: "rounded-xl", xxl: "rounded-xxl", pill: "rounded-pill",
};

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="text-code-sm font-mono text-content-secondary">{children}</code>
);
const Swatch = ({ color }: { color: string }) => (
  // Checkerboard-free swatch; translucent colors show over the surface they sit on
  <div className="size-control-md shrink-0 rounded-md border border-border-default" style={{ background: color }} />
);

/* ───────── Color ───────── */

export function PrimitiveRamps() {
  const groups = Object.entries((primitives as unknown as Tree)["color-primitives"] as Tree);
  return (
    <div className="flex flex-col gap-24">
      {groups.map(([group, node]) => (
        <div key={group} className="flex flex-col gap-8">
          <h3 className="text-heading-xs text-content-primary">{group}</h3>
          <div className="flex flex-wrap gap-8">
            {leaves(node as Tree).map((t) => (
              <div key={code(t)} className="flex w-96 flex-col gap-4">
                <div className="h-control-lg rounded-md border border-border-default" style={{ background: String(t.$value) }} />
                <span className="text-label-sm text-content-primary">{figmaName(t).split("/").pop()}</span>
                <Code>{String(t.$value)}</Code>
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="text-body-sm text-content-secondary">
        Primitives are the raw palette. <strong>Components never use them directly</strong>: they use the semantic colors below.
      </p>
    </div>
  );
}

const SEMANTIC_GROUPS = ["content", "icon", "surface", "border", "focus", "action"] as const;
const utility = (name: string) =>
  name.startsWith("content-") || name.startsWith("icon-") ? `text-${name}`
  : name.startsWith("border-") ? `border-${name}`
  : name === "focus-ring" ? `ring-${name}`
  : `bg-${name}`;

export function SemanticColors() {
  const darkByName = Object.fromEntries(leaves((dark as unknown as Tree).color as Tree).map((t) => [code(t), t]));
  const tokens = leaves((light as unknown as Tree).color as Tree);
  return (
    <div className="flex flex-col gap-32">
      {SEMANTIC_GROUPS.map((g) => (
        <div key={g} className="flex flex-col gap-8">
          <h3 className="text-heading-xs text-content-primary">{g}</h3>
          <div className="overflow-x-auto rounded-lg border border-border-default">
            <table className="w-full text-body-sm">
              <thead className="bg-surface-secondary text-label-sm text-content-secondary">
                <tr>
                  <th className="p-8 text-left">Figma variable</th>
                  <th className="p-8 text-left">Light</th>
                  <th className="p-8 text-left">Dark</th>
                  <th className="p-8 text-left">Class</th>
                </tr>
              </thead>
              <tbody>
                {tokens.filter((t) => code(t).startsWith(g)).map((t) => {
                  const l = resolve(t);
                  const d = resolve(darkByName[code(t)]);
                  return (
                    <tr key={code(t)} className="border-t border-border-subtle align-middle">
                      <td className="p-8">
                        <div className="text-label-md text-content-primary">{figmaName(t)}</div>
                        {t.$description && <div className="text-body-sm text-content-tertiary">{t.$description}</div>}
                      </td>
                      {[l, d].map((m, i) => (
                        <td key={i} className="p-8">
                          <div className="flex items-center gap-8">
                            <Swatch color={String(m.value)} />
                            <div className="flex flex-col">
                              <Code>{m.via.join(" → ")}</Code>
                              <Code>{String(m.value)}</Code>
                            </div>
                          </div>
                        </td>
                      ))}
                      <td className="p-8"><Code>{utility(code(t))}</Code></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ───────── Typography ───────── */

export function TypeRoles() {
  const byRole: Record<string, Record<string, Token>> = {};
  for (const t of leaves((scales as unknown as Tree).typography as Tree)) {
    const m = code(t).match(/^(.*)-(font-family|font-weight|font-size|line-height|letter-spacing)$/)!;
    (byRole[m[1]] ??= {})[m[2]] = t;
  }
  return (
    <div className="flex flex-col">
      {Object.entries(byRole).map(([role, p]) => {
        const spec = ["font-family", "font-weight", "font-size", "line-height", "letter-spacing"].map((k) => resolve(p[k]).value);
        const mono = String(spec[0]).includes("Mono");
        return (
          <div key={role} className="flex flex-col gap-4 border-b border-border-subtle py-16 md:flex-row md:items-baseline md:gap-24">
            <div className="flex shrink-0 flex-col md:w-1/4">
              <Code>{ROLE_CLASS[role]}</Code>
              <span className="text-body-sm text-content-tertiary">{spec.join(" · ")}</span>
            </div>
            <span className={`${ROLE_CLASS[role]} text-content-primary`}>
              {mono ? "const balance = 2480.00;" : "Trade crypto with confidence"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ───────── Spacing, size, radius, border, opacity, elevation ───────── */

export function Spacing() {
  return (
    <div className="flex flex-col gap-8">
      {leaves((scales as unknown as Tree).spacing as Tree).map((t) => {
        const n = code(t).replace("space-", "");
        return (
          <div key={code(t)} className="flex items-center gap-16">
            <div className="w-96"><Code>{code(t)}</Code></div>
            <div className="h-icon-sm rounded-sm bg-surface-brand" style={{ width: `var(--${code(t)})` }} />
            <Code>{resolve(t).value} · p-{n}, gap-{n}, m-{n}</Code>
          </div>
        );
      })}
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-end gap-24">
      {leaves((scales as unknown as Tree).size as Tree).map((t) => {
        const n = code(t).replace("size-", "");
        return (
          <div key={code(t)} className="flex flex-col items-start gap-8">
            <div className="rounded-sm border border-border-strong bg-surface-brand-subtle" style={{ width: `var(--${code(t)})`, height: `var(--${code(t)})` }} />
            <Code>{n} · {resolve(t).value}</Code>
            <Code>size-{n}, h-{n}</Code>
          </div>
        );
      })}
    </div>
  );
}

export function Radius() {
  return (
    <div className="flex flex-wrap gap-24">
      {leaves((scales as unknown as Tree).radius as Tree).map((t) => {
        const n = code(t).replace("radius-", "");
        return (
          <div key={code(t)} className="flex flex-col items-center gap-8">
            <div className={`h-64 w-96 border-width-strong border-border-strong bg-surface-secondary ${RADIUS_CLASS[n]}`} />
            <Code>rounded-{n}</Code>
            <span className="text-body-sm text-content-tertiary">{resolve(t).value}</span>
          </div>
        );
      })}
      <p className="w-full text-body-sm text-content-secondary">
        Shown in the <strong>Balanced</strong> mode. Sharp and Rounded are stored in <code>src/modes/</code> for a later theme.
      </p>
    </div>
  );
}

export function SimpleScale({ group, utility: util }: { group: "border" | "opacity" | "elevation"; utility?: (code: string) => string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border-default">
      <table className="w-full text-body-sm">
        <thead className="bg-surface-secondary text-label-sm text-content-secondary">
          <tr><th className="p-8 text-left">Figma variable</th><th className="p-8 text-left">Value</th><th className="p-8 text-left">CSS</th><th className="p-8 text-left">Class</th></tr>
        </thead>
        <tbody>
          {leaves((scales as unknown as Tree)[group] as Tree).map((t) => {
            const r = resolve(t);
            return (
              <tr key={code(t)} className="border-t border-border-subtle">
                <td className="p-8 text-label-md text-content-primary">{figmaName(t)}</td>
                <td className="p-8"><Code>{String(r.value)} ({r.via.join(" → ")})</Code></td>
                <td className="p-8"><Code>var(--{code(t)})</Code></td>
                <td className="p-8"><Code>{util ? util(code(t)) : "–"}</Code></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
