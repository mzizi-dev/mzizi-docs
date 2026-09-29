# Documentation project instructions

## About this project

- A [Mintlify](https://mintlify.com) documentation site for **Mzizi**, live at
  [docs.mzizi.dev](https://docs.mzizi.dev) and the single home of Mzizi's documentation.
- **The language leads.** It is the main subject. The toolchain (the `mz` compiler,
  `mz check --agent`, the benchmark, the MCP server, the CLI, the skills) and the components
  (**Mzizi Roots**, Rust-first, with the React/TSX components deprioritised as "the React
  build") support it. `docs.json` has four tabs in that order: Language, Toolchain,
  Components, Platform.
- Pages are MDX with YAML frontmatter. Language pages are flat at the root. The toolchain is
  under `toolchain/` (plus `compiler.mdx` at the root); components under `roots/`,
  `registry/`, `architecture/`, `foundations/`, `patterns/`, `blocks/`, `charts/` and
  `content/`; the API gateway, data and console under `platform/` (plus `console.mdx`).
- Source of truth for a **language** claim is
  [`mzizi-dev/mzizi`](https://github.com/mzizi-dev/mzizi) (public): `CHARTER.md`,
  `README.md`, the RFCs in `design/`, `primitives/*.mz`, the compiler under `compiler/`, and
  the pilot write-ups in `benchmarks/results/`. The repository's own README can lag its
  code; when they disagree, run the code.
- Source of truth for a **registry** claim is the live API, not prose:
  `GET https://api.mzizi.dev/v1/architecture` for the helix, `GET /v1/ui` for the component
  set, `GET /v1/brand` for tokens, and
  [`mzizi-dev/mzizi-registry`](https://github.com/mzizi-dev/mzizi-registry) for the source.
  Counts move — cite the endpoint and date the snapshot.
- For MCP tools, ask the server: `https://mcp.mzizi.dev/catalogue.json` needs no sign-in.
- For Mintlify product knowledge (components, configuration, writing standards), install the
  Mintlify skill: `npx skills add https://mintlify.com/docs`.

## The rule that overrides everything else

The Mzizi language is a **Phase 0 prototype front end**. `mz contract` evaluates a
component's contract against the component itself; nothing lowers to Rust; nothing renders.
**Two small pilots ran on 2026-09-27 and neither showed an advantage.** The run that tests
the kill criterion (now: Mzizi against the best existing language for each kind of task)
has not happened.

So: **a claim on this site is either checkable in the source repository, or labelled as a
design intention.** "Designed for" is fine; "faster" or "better" is not. Owner direction
that is not built yet (the whole backend in Mzizi, contracts on everything, a benchmark
across more languages) is written as direction, not as shipped. `status.mdx` holds the full
inventory and is the page to update first when something lands; `pilots.mdx` holds the
results.

CI greps for overclaiming phrasings (`honesty` job). That grep is a backstop for the obvious
cases, not the standard.

The component half has its own honesty problem, which is drift rather than overclaiming.
Facts that inherited prose often gets wrong:

- **Seven African Minerals in a palette of 21 colour families.** Cobalt, tanzanite,
  malachite, gold, terracotta, sodalite, copper; plus seven heritage and seven experimental.
- **The DNA helix, not axes or layers.** Eight nodes, six strands, four rungs.
  `/v1/architecture/frontend/axes` and `/layers` answer **410 Gone**, deliberately.
- **No database outside the console.** The registry is files; `api.mzizi.dev`
  (`mzizi-api-gateway`, a **Hono** Worker, not Rust) and `mcp.mzizi.dev` bundle those files
  at build time from a pinned registry commit. Only `mzizi-console` uses Supabase.
- **One MCP server**, at `mcp.mzizi.dev/mcp`. `mzizi.dev/mcp` is a 308 to it. It is free
  with no sign-in except the Fundi tools (`mzizi_fundi`, `mzizi_report_issue`); that is
  rolling out, so check whether the live server still answers 401 before saying otherwise.
- **The CLI is free.** `mzizi add` is not published.
- **`nyuchi-*` components are `mzizi-*`**, and the old names 308 to the new ones.

Three specific traps:

- **Do not quote RFC examples as working syntax.** RFC-0001's view attributes have no `=`;
  the implemented parser requires `name = value`. Prefer quoting `.mz` files from the
  repository, which CI gates.
- **Do not document `mz fix`, `mz refs`, `mz path`, `mz patch` or `mz diff` as commands.**
  They are designed, not built. The binary dispatches `check`, `contract`, `outline`, `hash`,
  `ir`.
- **Do not put a model name or identifier in a page.** Say "a frontier model" or "a ~7B
  open-weight model" and link the pilot write-up, which names them.

## Terminology

- Write the wordmark as **Mzizi**. The other wordmarks stay lowercase: nyuchi, mukoko,
  shamwari, bundu, nhimbe. npm packages keep the `@nyuchi/` scope.
- **The language** (older pages say "Mzizi-lang") for the research project, and **the
  registry** or **the components** for what `api.mzizi.dev` serves. They are different
  things; `ecosystem.mdx` holds the line.
- Repository names moved. `nyuchi/mzizi` is now `mzizi-dev/mzizi-registry`;
  `nyuchi/mzizi-tools` and `nyuchi/fundi` are now `mzizi-dev/agent-tools`, which is
  **private — never link it** (naming it is fine). `mzizi-dev/mzizi` is the **language**,
  not the registry, so never repair a `nyuchi/mzizi` reference by dropping the org prefix.
- `mzizi.dev`, `api.mzizi.dev`, `mcp.mzizi.dev`, `app.mzizi.dev` and `docs.mzizi.dev` all
  answer (checked 29 September 2026). The old Mzizi path on `docs.bundu.org` returns 404 —
  never link it. Check a host before writing it as live — this list moves.
- **`mz`** is the compiler binary. **Primitives** are `.mz` source copied into a project, not
  crates.
- **Ownership.** Mzizi owns and operates the framework, language, registry, design system,
  docs and API. Nyuchi operates the console and the revenue products. Copyright notices name
  the **Bundu Foundation** as the parent copyright holder; Mzizi is not a separate legal
  entity.
- **Security contacts.** The console: `security@nyuchi.com`. Everything else Mzizi,
  including this site: `security@bundu.org`.
- There is **one ecosystem: the Bundu ecosystem**. Mzizi, Nyuchi, Mukoko and the other brands
  sit inside it. Never write "the Mzizi ecosystem" or "the Nyuchi ecosystem".

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
npx prettier@3.9.4 --check '**/*.{md,mdx,json,jsonc}'           # the org lint gate
```

The org lint gate runs `prettier --check` over `.mdx` too, so a new or edited page must be
Prettier-clean.

**Never run `prettier --write` on an `.mdx` file that contains `{/* … */}`.** Prettier 3.9.x
rewrites it into `{/_ … _/}`, which is invalid MDX. For those files, fix formatting by hand.

**Renaming a page?** Add a `redirects` entry in `docs.json` and run `broken-links
--check-redirects`.

## Merge convention

This repository is rebase-only: `allow_rebase_merge` is `true`, `allow_merge_commit` and
`allow_squash_merge` are both `false` (read off the GitHub API 2026-09-12, org-wide across
all nine `mzizi-dev` repos and all 75 in the enterprise). Land changes with
`gh pr merge <n> --rebase --auto`. Never `--admin`, and don't use `--merge` — the repo
settings reject it.
