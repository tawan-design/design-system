# Governance

**Model:** centralized ownership, open contribution.
The Design team owns the system's decisions. Engineering co-owns code quality. Everyone can contribute.

## Decision rights
| Decision | Who decides |
|---|---|
| Tokens (add / change / remove) | Design System team |
| New component enters the system | Design System team, after a proposal issue with ≥2 real use cases |
| Component API (props, naming) | Design System team + 1 frontend lead |
| Breaking changes (major version) | Design lead, with a migration note and ≥1 week notice in Discussions |
| Tooling, CI, publishing | Frontend leads |

## Rituals
- **Weekly triage (30 min):** go through new issues and PRs, label them, assign owners.
- **Monthly:** run `evals/`, review the adoption score, update AGENTS.md / DESIGN.md gaps.
- **Bigger changes:** open an RFC in GitHub Discussions (category "RFC") before building.

## Versioning
SemVer via Changesets. `patch` = fix, `minor` = additive, `major` = breaking.
