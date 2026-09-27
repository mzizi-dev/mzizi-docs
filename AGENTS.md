# Documentation project instructions

## About this project

- A [Mintlify](https://mintlify.com) documentation site for **Mzizi**, live at
  [docs.mzizi.dev](https://docs.mzizi.dev) and the single home of Mzizi's documentation.
  It covers two distinct things: **Mzizi-lang** (the Phase 0 research language) and
  **the Mzizi registry** (the shipping design system).
- Pages are MDX with YAML frontmatter. Mzizi-lang pages are flat at the root; registry pages
  are grouped in subdirectories (`architecture/`, `registry/`, `foundations/`, `patterns/`,
  `blocks/`, `charts/`, `content/`). Configuration is `docs.json`.
- Source of truth for a **language** claim is
  [`mzizi-dev/mzizi`](https://github.com/mzizi-dev/mzizi) — `CHARTER.md`, `README.md`, the
  four RFCs in `design/`, `primitives/*.mz`, and the compiler source under `compiler/`.
- Source of truth for a **registry** claim is the live API, not prose:
  `GET https://mzizi.dev/api/v1/architecture` for the helix,
  `GET /api/v1/ui` for the component set, `GET /api/v1/brand` for tokens, and
  [`mzizi-dev/mzizi-registry`](https://github.com/mzizi-dev/mzizi-registry) for the source.
  Counts move — cite the endpoint and date the snapshot.
- For Mintlify product knowledge (components, configuration, writing standards), install the
  Mintlify skill: `npx skills add https://mintlify.com/docs`.

## The rule that overrides everything else

Mzizi-lang is a **Phase 0 prototype front end**. Contract bodies parse but are not evaluated.
Nothing lowers to Rust. Nothing renders. The benchmark the entire thesis rests on has not
run.

So: **a claim on this site is either checkable in the source repository, or labelled as a
design intention.** Not "will", not "does" — "is specified to", "is designed to", with the
implementation status said plainly nearby. `status.mdx` holds the full inventory and is the
page to update first when something lands.

CI greps for overclaiming phrasings (`honesty` job). That grep is a backstop for the obvious
cases, not the standard.

The registry half has its own honesty problem, which is drift rather than overclaiming. Four
facts that most inherited prose gets wrong:

- **Seven African Minerals, not five.** Cobalt, tanzanite, malachite, gold, terracotta,
  sodalite, copper.
- **The DNA helix, not axes or layers.** Eight nodes, six strands, four rungs.
  `/api/v1/architecture/frontend/axes` and `/layers` answer **410 Gone**, deliberately.
- **The registry is file-based.** `registry.json` plus files on disk. Component source is not
  in a database and is not written with SQL.
- **One MCP server**, at `mcp.mzizi.dev/mcp`, eleven tools. `mzizi.dev/mcp` is a 308 to it.

Two specific traps:

- **Do not quote RFC examples as working syntax.** RFC-0001's view attributes have no `=`;
  the implemented parser requires `name = value`. Prefer quoting `.mz` files from the
  repository, which CI gates.
- **Do not document `mz fix`, `mz refs`, `mz path`, `mz patch` or `mz diff` as commands.**
  They are designed, not built. The binary dispatches `check`, `outline`, `hash`, `ir`.

## Terminology

- **Mzizi-lang** (or "the language") for the Phase 0 research project. **The Mzizi registry**
  for the shipping component system at `mzizi.dev`. They are different things and the
  distinction is load-bearing — `ecosystem.mdx` exists mostly to hold it, and every registry
  section landing page opens with a `<Note>` repeating it.
- Repository names moved. `nyuchi/mzizi` is now `mzizi-dev/mzizi-registry`;
  `nyuchi/mzizi-tools` and `nyuchi/fundi` are now `mzizi-dev/agent-tools`, which is
  **private — never link it**. `mzizi-dev/mzizi` is the **language**, not the registry, so
  never repair a `nyuchi/mzizi` reference by dropping the org prefix.
- `mzizi.dev`, `mcp.mzizi.dev`, `api.mzizi.dev` and `app.mzizi.dev` all resolve (checked 26
  September 2026), and so does `docs.mzizi.dev` (HTTP 200, checked 27 September 2026).
  The old Mzizi path on `docs.bundu.org` returns 404 — never link it. `dig` before writing
  any host as live — this list moves.
- **`mz`** is the compiler binary. **Primitives** are `.mz` source copied into a project, not
  crates.
- The framework, registry and docs are Mzizi IP; the console ("Fundi"), paid plans and billing
  are Nyuchi-owned. That line is the owner decision of 27 September 2026, and `CHARTER.md`
  (the Mzizi Research Charter, v0.2) states it, so cite the charter for ownership.
- There is **one ecosystem: the Bundu ecosystem**. Mzizi, Nyuchi, Mukoko and the other brands
  sit inside it. Never write "the Mzizi ecosystem" or "the Nyuchi ecosystem". Owning the
  framework is a separate question from the ecosystem's name.

## Style preferences

- Active voice, second person ("you").
- Sentence case for headings. One idea per sentence.
- Code formatting for file names, commands, paths, and code references.
- Quote the source when it says something better than a paraphrase would, and attribute it.
- British spelling, matching the source repository.

## Colours

`docs.json`'s brand colours are gated by `scripts/check-contrast.mjs` at APCA 3.0 Lc 75.
Remember `colors.light` renders in DARK mode and `colors.dark` renders in LIGHT mode. Do not
substitute a WCAG ratio check for this — see the README for why that masks real failures in
this palette.

## Commands

```bash
npm i -g mint      # the Mintlify CLI, once
mint dev           # http://localhost:3000 — run from the repo root, where docs.json lives
```

`style.css` is not picked up by `mint dev` — the `--gray-*` values stay Mintlify's computed
defaults locally. Re-verify the ramp on a real deploy preview rather than assuming from the
local server. If a page 404s locally, confirm you're in the directory with `docs.json`; if
the dev server misbehaves, `mint update`.

Everything CI runs, in the same order, runnable locally before you push:

```bash
npx mint@latest validate                                        # strict: warnings fail
npx mint@latest broken-links --check-anchors --check-redirects  # internal links only
npx mint@latest a11y                                             # alt attributes
node scripts/check-contrast.mjs                                 # APCA 3.0 brand colours
```

**Never run `prettier --write` on an `.mdx` file.** Prettier 3.9.x rewrites `{/* … */}`
into `{/_ … _/}`, which is invalid MDX. Prettier on `.md` is fine and is what CI runs.

## Merge convention

This repository is rebase-only: `allow_rebase_merge` is `true`, `allow_merge_commit` and
`allow_squash_merge` are both `false` (read off the GitHub API 2026-09-12, org-wide across
all nine `mzizi-dev` repos and all 75 in the enterprise). Land changes with
`gh pr merge <n> --rebase --auto`. Never `--admin`, and don't use `--merge` — the repo
settings reject it.
