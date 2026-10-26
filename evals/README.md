# Evals: does the agent actually use the design system?

Run these after any change to `AGENTS.md`, `DESIGN.md`, skills, or the catalog.
The goal is to see the score go up when docs improve, and to find the small missing sentences.

## How to run (manual, ~20 min)
1. New branch. For each prompt in `prompts/`, start a **fresh** Claude Code session in this repo and paste the prompt.
2. Save output to `apps/playground/src/evals/<prompt-name>.tsx`.
3. Run the `ds-audit` skill on each file and append to `results.md`.
4. Delete the branch (eval output never merges).

For automated, repeatable benchmarking across models, see open-design-system-bench (MIT, React + TypeScript).

## Track over time
| Date | Docs change | Avg score | Hand-rolled % | Notes |
|---|---|---|---|---|
| 2026-10-25 | baseline | – | – | |
