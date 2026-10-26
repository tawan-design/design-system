# Design System Playbook
How we create, maintain, scale and apply the design system with Claude.
Owner: Design team · Repo: `design-system` · Last updated: 2026-10-25

> **How to read this:** Part 1 is the 1-page map. Part 2 is one-time setup (tools and connectors). Part 3 is the recipes, one per situation, each with **who · where · inputs to attach · skills · connectors · steps · sample prompt · output · done checklist**.
>
> Legend: ✅ skill in the repo (`.claude/skills/`) · 🧩 skill from an installed plugin (Figma / Design)

---

## Part 1 — The map

### 1.1 The loop

```
 ① Foundations ─▶ ② Design in Figma ─▶ ③ Componentize ─▶ ④ Document
   (tokens)          (screens use         (Figma → code)     (Storybook)
                      variables only)                              │
                                                                   ▼
 ⑧ Measure ◀─── ⑦ Build product ◀─── ⑥ Release ◀─── ⑤ Review (PR)
   (evals, drift)   (engineers + agents)  (versioned npm)   (design + eng)
```

### 1.2 One source of truth per thing

| Thing | Lives in | Written by |
|---|---|---|
| Token values | Figma Variables → `packages/tokens/src/*.json` | Generated (never hand-edit) |
| Components + props | `packages/ui/src/components/*` → `catalog.json` | Claude writes, you review. Catalog is generated |
| Visual docs | Storybook (`apps/docs`) | Generated from stories + tokens |
| Brand intent / "why" | `DESIGN.md` | You (owner) |
| Agent instructions | `AGENTS.md` (index only, <150 lines) | You |
| Procedures | `.claude/skills/*/SKILL.md` | You + Claude |

### 1.3 Who's who

| Role | Owns | Approves |
|---|---|---|
| **DS owner** (you / design team) | Tokens, components, DESIGN.md, AGENTS.md, releases | Every PR (CODEOWNERS) |
| **Product designers** | Feature screens using the DS, proposals | Visual changes (Chromatic) |
| **Frontend engineers** | Code quality, adoption in product | Code on `packages/ui/src` |
| **Claude** | Repetitive work: sync, build, document, audit | Nothing (always proposes via PR) |

### 1.4 Where each kind of work happens

| Work | Best place | Why |
|---|---|---|
| Talking to Figma (read variables, frames, screenshots, write to canvas) | **Claude Cowork** or **Claude Code** with the Figma connector | Both can use the Figma MCP |
| Writing code in the repo, git, running Storybook | **Claude Code** in the repo folder (terminal / desktop app) | Has the repo, terminal, `.claude/skills` auto-loaded |
| Reviewing visuals | **Chromatic / Storybook preview link** in the browser | No code reading needed |
| Discussion, proposals, approvals | **GitHub** (issues, PRs, Discussions) | Shared history, ownership rules |

---

## Part 2 — One-time setup

Do this once. ~1–2 hours.

### 2.1 Accounts and tools

| Tool | Why | Setup |
|---|---|---|
| **Node 20+ & pnpm** | Run the repo | Install Node, then `npm i -g pnpm` |
| **GitHub** | Shared repo, reviews, releases | Org + repo `design-system`. Teams `design-system` and `frontend-leads` |
| **Claude Code** | Repo work | Install, then run `claude` inside the repo folder |
| **Claude Cowork** (desktop) | Figma-side work, docs, reviews | Connect the repo folder with "Add folder" |
| **Figma** | Source of design | A Dev or Full seat makes the MCP limits comfortable |
| **Chromatic** | Storybook previews per PR + visual approvals | chromatic.com → sign in with GitHub → link the repo → copy the project token |

### 2.2 Connectors (MCP)

**Figma connector** (required)
- *Cowork / claude.ai:* Settings → Connectors → **Figma** → Connect → authorize your Figma account.
- *Claude Code:* `claude mcp add --transport http figma https://mcp.figma.com/mcp`, then type `/mcp` in Claude Code and authenticate.
- Test it: *"Using Figma, list the variable collections in <file URL>."*

**GitHub** (recommended)
- *Claude Code:* install the GitHub CLI and run `gh auth login`. Claude uses `gh` for branches, PRs and issues.
- *Cowork / claude.ai:* Settings → Connectors → **GitHub**, so Claude can read issues and PRs while you're in Cowork.

**Optional, later**
- **Storybook MCP addon**: lets agents query components straight from Storybook. Check that it supports your Storybook version first.
- **Notion / Slack**: announcing releases and breaking changes.

### 2.3 Skills

| Skill | Type | How to make it available |
|---|---|---|
| `ds-tokens-sync`, `ds-component-from-figma`, `ds-build-screen`, `ds-audit`, `ds-design-qa`, `ds-drift-check`, `ds-handoff` | ✅ repo | **Claude Code** loads `.claude/skills/` automatically inside the repo. In **Cowork**, connect the repo folder and say *"follow .claude/skills/<name>/SKILL.md"*, or upload the skill folder as a personal skill (Settings → Capabilities → Skills) |
| `figma-use`, `figma-generate-library`, `figma-generate-design`, `figma-code-connect`, `figma-design-to-code` | 🧩 Figma plugin | Install the Figma plugin for Claude. Already enabled in your Cowork |
| `design:design-critique`, `design:accessibility-review`, `design:design-handoff`, `design:design-system` | 🧩 Design plugin | Already enabled in your Cowork |
| Helper scripts for the QA/drift skills | ✅ repo | `pnpm qa:snapshot` (needs `npx playwright install chromium` once) · `pnpm catalog:summary` |

### 2.4 Repo setup checklist

```bash
# 1. Unzip, then:
cd design-system
pnpm install
pnpm dev                     # Storybook opens at localhost:6006 ✔

# 2. Personalize
#    find/replace "@yourco" → your GitHub org (e.g. @boole)

# 3. Push
git init && git add -A && git commit -m "chore: bootstrap design system"
gh repo create <org>/design-system --private --source=. --push
```

On GitHub:
- [ ] Settings → Branches → protect `main`: require PR, require **Code Owners** review, require status checks (CI)
- [ ] Settings → Secrets → `CHROMATIC_PROJECT_TOKEN`
- [ ] Settings → Features → enable **Discussions** (category "RFC")
- [ ] Teams `design-system` and `frontend-leads` exist (or edit `.github/CODEOWNERS`)

### 2.5 Figma file structure (what Claude expects)

```
📁 Design System (Figma file)
 ├─ 📄 Foundations   ← variable collections live here
 │    ├─ Collection "Primitives"  (color/blue/600, space/16, radius/8 …)
 │    └─ Collection "Semantic"    modes: Light, Dark  (bg/surface, text/muted …) → aliases to Primitives
 ├─ 📄 Components    ← one component set per component, variant properties named like props
 │    └─ Button  (Variant = Primary|Secondary|Ghost|Danger, Size = Small|Medium|Large, State = Default|Disabled)
 └─ 📄 Patterns      ← proven compositions (review dialog, empty state …)
```

Naming rules that make the agent accurate:
- Variable names use `/`: `bg/surface`, `space/16`. They become `color.bg.surface` → `--ds-color-bg-surface` → `bg-surface`.
- Component property names match code props: `Variant` → `variant`, `Size` → `size`.
- **Every** fill, stroke, gap, padding and radius is bound to a variable. No detached values.

---

## Part 3 — Recipes

Each recipe uses the same template. Copy the sample prompt and replace the `<…>` parts.

---

### Recipe A — Create the foundations (first time)

| | |
|---|---|
| **Goal** | Brand direction → working tokens in Figma and code, light + dark |
| **Who** | DS owner (+ brand/marketing input) |
| **Where** | Cowork (Figma side) → Claude Code (repo side) |
| **Attach / provide** | Brand guidelines or moodboard (PDF/images) · existing product screenshots · Figma DS file URL |
| **Skills** | 🧩 `figma-use` + `figma-generate-library` (create variables in Figma) · ✅ `ds-tokens-sync` (Figma → repo) · 🧩 `design:accessibility-review` (contrast) |
| **Connectors** | Figma · GitHub |

**Steps**
1. **Decide the scales** with Claude: color ramps, spacing (2–64), radius (8, 12, full), type sizes.
2. **Create variables in Figma.** Claude writes the `Primitives` and `Semantic` (Light/Dark) collections into your file.
3. **Check contrast** for every text/background pair in both modes.
4. **Sync to the repo.** Claude exports the variables to `tokens/*.json`, rebuilds, and opens a PR.
5. **Review** Storybook → Foundations (toggle Dark). Merge.

**Sample prompts**

*Step 1–2 (Cowork):*
```
I'm setting up foundations for our design system. Attached: brand guidelines + 3 product screenshots.
Figma file: <URL>

1. Propose primitives: color ramps (neutral, brand, red, green, 50–950), spacing 2–64,
   radius 8/12/full, type sizes 12–32.
2. Propose semantic tokens with names like bg/surface, bg/brand, text/default, text/muted,
   border/default, border/focus, for Light and Dark.
3. Show me a table first. After I approve, create them as Figma Variables on the
   "Foundations" page: collection "Primitives", and collection "Semantic" with modes Light/Dark
   aliasing primitives. Use figma-use and figma-generate-library.
```

*Step 3:*
```
Run an accessibility review on every text/* on bg/* pair in both modes. Flag anything below
WCAG AA (4.5:1 body, 3:1 large text/UI) and suggest the closest passing primitive.
```

*Step 4 (Claude Code, in the repo):*
```
Use ds-tokens-sync. Figma file: <URL>. Replace the sample tokens with ours, update the @theme
block in packages/ui/src/styles.css for any new semantic tokens, run pnpm check, add a changeset,
and open a PR labelled "tokens".
```

**Output:** `tokens/*.json`, updated `styles.css`, Foundations page in Storybook, tokens PR
**Done when:** ☐ both modes pass AA ☐ no raw values in Figma components ☐ Storybook Foundations matches Figma ☐ PR merged

---

### Recipe B — Change, add or rename a token

| | |
|---|---|
| **Goal** | Update tokens safely, without silently breaking products |
| **Who** | DS owner (anyone can request via the "Token change" issue) |
| **Where** | Figma → Claude Code |
| **Attach / provide** | The issue link · Figma file URL · what changed |
| **Skills** | ✅ `ds-tokens-sync` |
| **Connectors** | Figma · GitHub |

**Steps**
1. Edit the variable in Figma.
2. Claude syncs and **classifies** each change: added / value changed / renamed-removed (= breaking).
3. For breaking changes, Claude lists every file that uses the old token and writes a migration note. Use a `major` changeset.
4. Designer approves in Chromatic (every component that changed visually shows up there).

**Sample prompt**
```
Use ds-tokens-sync. I renamed bg/subtle → bg/sunken and changed border/default in Dark mode.
Figma: <URL>. Classify every change, list affected files for anything breaking, update usages,
write a migration note in the PR description, and use a major changeset if anything breaks.
Closes #<issue>.
```

**Output:** tokens PR with a change table + migration note
**Done when:** ☐ classification table in PR ☐ Chromatic diffs approved ☐ correct semver bump

---

### Recipe C — Create a new component

| | |
|---|---|
| **Goal** | A pattern proven in real screens → a DS component in Figma and code, 1:1 |
| **Who** | DS owner (designer builds in Figma, Claude builds code) · 1 engineer reviews |
| **Where** | Figma → Claude Code |
| **Attach / provide** | **Figma URL of the component set** (right-click → Copy link to selection) · the GitHub issue · 1–2 real screens where it's used · any behavior notes (keyboard, empty/loading/error) |
| **Skills** | ✅ `ds-component-from-figma` · 🧩 `figma-code-connect` · 🧩 `design:accessibility-review` |
| **Connectors** | Figma · GitHub |

**Before you start (in Figma)**
- [ ] Component set exists with variant properties named like props (`Variant`, `Size`, `State`)
- [ ] All states drawn: default, hover, focus, disabled, error, loading (where relevant)
- [ ] Every value bound to a variable (run `design:design-system` to audit it if unsure)
- [ ] Used in ≥2 real screens (otherwise it stays a local pattern)

**Steps**
1. Claude checks `catalog.json`. If something similar exists, it proposes a variant instead (→ Recipe D).
2. Claude reads the Figma node: properties → props, variables → token classes. **It stops and reports any unbound value instead of guessing.**
3. Builds `<Name>.tsx` (cva variants, Radix if interactive), `<Name>.stories.tsx` (every variant and state + Figma link), `<Name>.figma.tsx` (Code Connect).
4. Exports it, regenerates `catalog.json`, runs `pnpm check`, adds a `minor` changeset, opens a PR.
5. → Recipe E (review).

**Sample prompt (Claude Code, in the repo)**
```
Use ds-component-from-figma to create a <Select> component.
Figma component set: <URL>
Issue: #<n>
Used in: <URL of screen 1>, <URL of screen 2>

Behavior notes:
- Built on Radix Select, keyboard navigable, typeahead
- Props: label, hint, error, placeholder, options, disabled
- States in Figma: Default, Open, Focus, Error, Disabled

Map Figma properties 1:1 to props. If any fill/spacing/radius isn't bound to a variable,
stop and list them, don't guess. Write stories for every variant and state with the Figma link,
add Code Connect, regenerate the catalog, run pnpm check, add a minor changeset and open a PR
using the template.
```

**Output:** component + story + Code Connect + catalog entry + PR with preview link
**Done when:** ☐ every Figma variant has a story ☐ `pnpm check` green ☐ a11y panel has no violations ☐ Code Connect published (`npx figma connect publish`)

---

### Recipe D — Add a variant or prop to an existing component

| | |
|---|---|
| **Goal** | Extend without breaking existing usage |
| **Who** | DS owner |
| **Attach / provide** | Figma URL of the updated component set · the reason (issue) |
| **Skills** | ✅ `ds-component-from-figma` (it handles updates too) |

**Sample prompt**
```
Use ds-component-from-figma to add a "loading" state and an "icon" slot to Button.
Updated Figma component set: <URL>. Keep all existing props backward compatible.
Update stories, Code Connect and catalog, minor changeset, open a PR.
```

**Done when:** ☐ no existing story changed visually (Chromatic shows only new stories) ☐ minor bump

---

### Recipe E — Design review of a component PR (the first review)

| | |
|---|---|
| **Goal** | Approve or request changes before anything reaches products |
| **Who** | Designers (visual) · Engineer (code/API) · DS owner (final approval) |
| **Where** | GitHub PR → Chromatic / Storybook preview link → Cowork for an AI review |
| **Attach / provide** | PR link · Storybook preview link · Figma URL |
| **Skills** | 🧩 `design:design-critique` · 🧩 `design:accessibility-review` · ✅ `ds-design-qa` (Recipe F) |
| **Connectors** | GitHub · Figma |

**Steps**
1. **Designers** open the preview link in the PR. For each story: compare with the embedded Figma frame, play with Controls, switch Theme to Dark, tab through with the keyboard.
2. **Claude** produces a critique + accessibility report (prompt below). Paste it as a PR comment.
3. **Engineer** reviews prop naming, composition and Radix usage.
4. **DS owner** approves in Chromatic + GitHub, then squash-merges.

**Sample prompt (Cowork)**
```
Review PR <link>. Storybook preview: <link>. Figma: <URL>.
1. design-critique: hierarchy, consistency with our other components, states coverage.
2. accessibility-review: contrast in both themes, focus visibility, keyboard, ARIA, target size ≥40px.
3. Compare the props in the PR against the Figma component properties: list anything missing or renamed.
Give me a short comment I can paste into the PR: ✅ approve / 🔁 request changes, with a numbered list.
```

**Review checklist (paste into PR)**
- [ ] Matches Figma in every variant/state (light + dark)
- [ ] Prop names = Figma property names
- [ ] Keyboard + focus ring work, screen reader label makes sense
- [ ] Only token classes (`pnpm check` green)
- [ ] Story exists for each state

---

### Recipe F — Design QA: how well does the UI match Figma?

| | |
|---|---|
| **Goal** | A measurable match score between Figma and the built UI (component or full screen) |
| **Who** | Designer (owner of the screen) · Claude does the comparison |
| **Where** | Claude Code (needs Playwright to screenshot) or Cowork with the repo connected |
| **Attach / provide** | Figma frame URL · Storybook story URL or playground/product URL (+ viewport size) |
| **Skills** | ✅ `ds-design-qa` (+ script `pnpm qa:snapshot`) · 🧩 `figma-design-to-code` (reads design context) |
| **Connectors** | Figma |

**What gets compared**
| Check | Figma source | Code source | Weight |
|---|---|---|---|
| Components used | instances in the frame | imports / rendered components | 25% |
| Variants & props | instance properties | props passed | 20% |
| Tokens (color, space, radius, type) | `get_variable_defs` | classes / computed styles | 30% |
| Layout & spacing | auto-layout gaps/padding | computed box model | 15% |
| Visual diff | `get_screenshot` | Playwright screenshot | 10% |

**Before you start**
- ☐ The built UI is running: `pnpm dev` (Storybook) or `pnpm playground`
- ☐ For a story, copy its **iframe** URL: open the story → "Open canvas in new tab" (`iframe.html?id=…`)
- ☐ Playwright browser installed once: `npx playwright install chromium`

**Steps (what the skill does)**
1. **Figma side:** reads the frame with the Figma MCP (instances, variant properties, bound variables, auto-layout, screenshot) and flags detached/unbound layers.
2. **Built side:** runs `pnpm qa:snapshot <url> --name <x> --theme both`. It saves screenshots and, for every element, the DS component it belongs to (`data-ds`) and its computed styles **translated back to token names**, plus any hand-rolled controls and raw values.
3. **Compares and scores** with the weights above; the final score is the lowest theme score.
4. **Writes** `qa-output/<name>/report.md`: score, mismatch table (element · Figma · built · fix in Code / Figma / DS), design-side issues, screenshots.

**Sample prompt (Claude Code, in the repo)**
```
Use ds-design-qa.
Figma frame: <URL with node-id>
Built UI: http://localhost:6006/iframe.html?id=pages-fintech-app--dashboard-page
Viewport 1280x800, both themes. Name: dashboard.
Report only, don't fix anything.
```

**Follow-up prompt**
```
Fix the "Code" mismatches from qa-output/dashboard/report.md, rerun ds-design-qa and show the new score.
List the "Figma" ones so I can fix them in the design.
```

**Output:** score + mismatch table + screenshots → issues or a fix PR
**Done when:** ☐ score ≥ 90 ☐ every mismatch is either fixed or accepted with a reason


---

### Recipe G — Hand off a feature to engineering

| | |
|---|---|
| **Goal** | Engineers (and their agents) can build the feature using only the DS, with no guessing |
| **Who** | Product designer → Frontend engineer |
| **Where** | Cowork (spec) → GitHub issue in the **product** repo |
| **Attach / provide** | Figma flow URL (all screens + states) · PRD/ticket · edge cases you know |
| **Skills** | ✅ `ds-handoff` (builds on 🧩 `design:design-handoff`) · 🧩 `design:ux-copy` (optional) |
| **Connectors** | Figma · GitHub (or Jira/Linear if that's where tickets live) |

**Steps**
1. Make sure every element in the Figma flow is a DS instance (no detached layers).
2. Claude writes the handoff spec **in DS language**: per screen, which components, which props, which `DESIGN.md` pattern applies.
3. Claude flags **DS-GAPs**, i.e. things the system doesn't cover → "New component" issues in the DS repo (→ Recipe C).
4. Post the spec on the product ticket. Engineers build with Recipe H.

**Sample prompt (Cowork with the repo folder connected, or Claude Code)**
```
Use ds-handoff for the KYC flow.
Figma flow: <URL of the page/section with all screens>
PRD: attached (or <link>)
Breakpoints: 375 / 1280. Save the spec as handoff/kyc.md.
If you find detached layers, stop and list them first.
Draft the DS-GAP issues but ask me before creating them.
```

**What you get:** one section per screen (component + props table, layout as token classes, states, responsive, copy, accessibility, the DESIGN.md rule that applies), then DS-GAPs and open questions.

**Output:** handoff spec (per screen) + DS-GAP list → issues
**Done when:** ☐ zero detached layers ☐ every element mapped to a catalog component or a DS-GAP ☐ edge states covered

---

### Recipe H — Engineer (or designer) builds a feature with the DS

| | |
|---|---|
| **Goal** | Product code that uses the DS correctly the first time |
| **Who** | Frontend engineer (or designer prototyping in the playground) |
| **Where** | Claude Code in the **product** repo (or `apps/playground` here) |
| **Attach / provide** | Handoff spec · Figma URL · the product repo with `@yourco/ui` installed |
| **Skills** | ✅ `ds-build-screen` · ✅ `ds-audit` · ✅ `ds-design-qa` |
| **Connectors** | Figma |

**One-time in each product repo**
```bash
pnpm add @yourco/ui                         # from GitHub Packages
# app root: import "@yourco/ui/styles.css";
```
Then add to that repo's `AGENTS.md` / `CLAUDE.md`:
```
@yourco/ui is installed. Before writing UI, read node_modules/@yourco/ui/catalog.json.
Use its components before building anything new. Token classes only. Ask instead of guessing.
```
(Copy `ds-build-screen` into that repo's `.claude/skills/` too.)

**Sample prompt (Claude Code)**
```
Use ds-build-screen to build the KYC upload screen. Figma: <URL>. Spec: <link>.
Map each Figma instance to a catalog component. Mark anything missing with // DS-GAP.
When done: run the checks, then run ds-audit on the new files and give me the score.
```

**Output:** feature PR + `ds-audit` score in the description
**Done when:** ☐ audit ≥ 85 ☐ zero hand-rolled lookalikes ☐ DS-GAPs reported as issues

---

### Recipe I — Push code components back into Figma (code → canvas)

| | |
|---|---|
| **Goal** | Keep the Figma library in sync when a component was born or changed in code |
| **Who** | DS owner |
| **Where** | Claude Code or Cowork with the repo + Figma |
| **Attach / provide** | Component file path / story link · target Figma file URL |
| **Skills** | 🧩 `figma-generate-library` · 🧩 `figma-use` · 🧩 `figma-code-connect` |
| **Connectors** | Figma |

**Sample prompt**
```
Use figma-generate-library. Create (or update) the Figma component set for Badge from
packages/ui/src/components/Badge in <Figma URL>, page "Components".
Variant property "Tone" = neutral|brand|success|danger. Bind every fill/padding/radius to our
existing variables. No raw values. Then add the Code Connect mapping.
```

---

### Recipe J — Release a new version

| | |
|---|---|
| **Goal** | Ship merged changes to products as a versioned package |
| **Who** | DS owner |
| **Where** | GitHub |
| **Skills** | none (Changesets automates it) · optional: Claude writes the announcement |

**Steps**
1. After merges, GitHub shows a PR **"Release: version packages"** with the version bump + CHANGELOG.
2. Read it, then merge → the package is published to GitHub Packages.
3. Announce (Slack/Notion): what's new, breaking changes, how to upgrade.

**Sample prompt (announcement)**
```
Read CHANGELOG.md for @yourco/ui <version>. Write a short release note for designers and
engineers: new components, changes, breaking changes with migration steps, link to Storybook.
```

---

### Recipe K — Monthly health check: is the agent really using our DS?

| | |
|---|---|
| **Goal** | Measure adoption, find the missing sentences in the docs, track the trend |
| **Who** | DS owner (30–60 min/month) |
| **Where** | Claude Code in the DS repo |
| **Attach / provide** | `evals/prompts/*` · last month's `evals/results.md` · Figma DS file URL |
| **Skills** | ✅ `ds-audit` · ✅ `ds-drift-check` (+ script `pnpm catalog:summary`) |
| **Connectors** | Figma |

**Steps**
1. Run each eval prompt in a **fresh** session (no memory of earlier fixes).
2. `ds-audit` each output → scores on 6 dimensions.
3. Drift check: compare the Figma component list and properties with `catalog.json`.
4. Fix the **docs gaps** (usually 1–2 sentences in `AGENTS.md`/`DESIGN.md`), rerun, log the result.

**Sample prompts**
```
Run the monthly DS health check:
1. For each prompt in evals/prompts, start a subagent with a fresh context in this repo, build
   it into apps/playground/src/evals/, then run ds-audit on the output.
2. Summarize: average score, hand-rolled %, invented props, raw values, and the top 3 "Docs gaps".
3. Append a row to evals/results.md. Don't commit the eval output.
```
```
Use ds-drift-check. Figma DS file: <URL>.
Save the report to evals/drift/<today>.md and draft issues for the High items (ask before creating).
```

**Output:** score trend + docs fixes PR + drift list → issues

---

## Part 4 — Cheat sheet

### 4.1 Which recipe?

| I want to… | Recipe |
|---|---|
| Start the system from zero | A |
| Change a color / spacing value / rename a token | B |
| Make a new component | C |
| Add a variant or prop | D |
| Review someone's component PR | E |
| Check if the built UI matches Figma | F |
| Hand a feature to engineers | G |
| Build a feature with the DS | H |
| Get a code component into Figma | I |
| Ship a new version | J |
| Check whether agents actually use the DS | K |

### 4.2 Commands

| Command | Does |
|---|---|
| `pnpm dev` | Builds tokens and opens Storybook (localhost:6006) |
| `pnpm playground` | Simulated product (localhost:5173) |
| `pnpm tokens` | Rebuilds CSS variables from token JSON |
| `pnpm check` | Typecheck + raw-value audit (the same as CI) |
| `pnpm --filter @yourco/ui catalog` | Regenerates `catalog.json` |
| `pnpm changeset` | Describe your change (patch/minor/major) |
| `npx figma connect publish` | Publishes Code Connect snippets to Figma Dev Mode |
| `pnpm qa:snapshot <url> --name x --theme both` | Built-UI side of design QA (screenshots + tokens per element) |
| `pnpm catalog:summary` | Code side of a drift check (components, props, stories, Code Connect) |

### 4.3 Semver in one line
`patch` = fix · `minor` = new component/variant/token · `major` = rename or removal (needs a migration note)

### 4.4 Golden rules
1. Figma variables are the source of token values. Never hand-edit token JSON.
2. A pattern becomes a component only after it works in ≥2 real screens.
3. Figma property names = code prop names.
4. Nothing reaches `main` without a PR and design approval.
5. When an agent gets it wrong, fix the **docs** (one specific sentence), not just the code.
6. Keep `AGENTS.md` an index. If you're typing values into it, they belong somewhere else.

### 4.5 Skills index
| Skill | Use it for | Recipe |
|---|---|---|
| `ds-tokens-sync` | Figma Variables → token JSON, classify breaking changes | A, B |
| `ds-component-from-figma` | Figma component set → code component + story + Code Connect | C, D |
| `ds-build-screen` | Building any UI with the system | H |
| `ds-audit` | Score how well code uses the system (6 dimensions) | H, K |
| `ds-design-qa` | Figma frame vs built UI, match score /100 | E, F, H |
| `ds-drift-check` | Figma library vs code library | K |
| `ds-handoff` | Feature handoff spec in DS terms + DS-GAP issues | G |
