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

The Mzizi language is a **Phase 0 prototype**. `mz contract` evaluates a component's contract
against the component itself, and runs a `service` in process. A `service` lowers to Rust
(`mz build`, to a local Rust + axum package), and so does a `program` in RFC-0013's first
waves (`mz build` and `mz run`, to a dependency-free Rust package; on language `main` since
8 October 2026). No component lowers, there is no Workers, Containers or WebAssembly target,
and nothing renders. By the tracker's ✅ marks, Mzizi has no expressions, bindings, callable
functions, loops, error handling, modules or standard library yet: a program has the first
five in a narrow form, and those rows are 🟡 until the tracker marks them ✅.
**Two small pilots ran on 2026-09-27 and neither showed an advantage.** The run that tests
the kill criterion (now: Mzizi against the best existing language for each kind of task)
has not happened.

**Every capability claim comes from
[`LANGUAGE-TRACKER.md`](https://github.com/mzizi-dev/mzizi/blob/main/LANGUAGE-TRACKER.md)**,
the language's one tracker of what it still needs (owner, 2026-09-30): if a row is not ✅
there, Mzizi does not have it. `tracker.mdx` summarises it, and `check-freshness.mjs` fails
when a row's mark on that page drifts from the file.

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
  with no sign-in except the Fundi tools (`mzizi_fundi`, `mzizi_report_issue`); an anonymous
  `tools/list` answered on 7 October 2026. Its MCP Registry name is
  `io.github.mzizi-dev/mzizi-mcp`.
- **The CLI is free.** `mzizi add` is published from `@nyuchi/mzizi-cli` (0.7.0 on
  7 October 2026); 0.6.0's binaries printed nothing, so pages say "0.6.1 or later".
- **Seven skills, in four categories.** `@nyuchi/mzizi-skills` 0.8.0 cut the bundle to five,
  `mzizi-language`, `mzizi-roots`, `mzizi-design`, `mzizi-backend` and `discoverability`, with
  no aliases for the old names. 0.9.0 (5 October 2026) added the `dev` skill
  `digital-hygiene`, 0.10.0 (6 October) added `progress-report` and categories, and 0.11.0
  (6 October) is the latest. The API and the plugin can lag npm. The Claude Code plugin is the
  public one in `mzizi-dev/mzizi-registry` (`/plugin install mzizi@mzizi`); the private
  `mzizi-tools` marketplace is retired.
  `npx skills add @nyuchi/mzizi-skills` does not work.
- **Mzizi's brand mineral is hematite**, a heritage tone, not one of the Seven African
  Minerals. It is the default `--primary` of the registry's `mzizi-tokens-globals.css`;
  `/v1/brand`'s semantic `--primary` is still tanzanite.
- **The Roots crates are on crates.io**: ten crates at 0.3.0 (7 October 2026), installed with
  `cargo add mzizi-roots`.
- **`nyuchi-*` components are `mzizi-*`**, and the old names 308 to the new ones.

Five specific traps:

- **Do not quote RFC examples as working syntax.** RFC-0001's view attributes have no `=`;
  the implemented parser requires `name = value`. Prefer quoting `.mz` files from the
  repository, which CI gates.
- **Do not document `mz refs`, `mz path`, `mz patch`, `mz diff`, `mz test` or `mz fmt` as
  commands, nor `mz run --agent` or `mz harness plugins`.** They are designed, not built. The
  binary on `main` dispatches `check`, `fix`, `contract`, `outline`, `build` (a service or a
  program) and `run` (a program), plus `hash`, `ir` and `harness` (`version`, `definition`,
  `entry`). All are documented on the compiler page; programs on `programs.mdx`, the language
  harness on `language-harness.mdx`. Released to `main` on 8 October 2026 (mzizi#91).
- **Generate the `MZ09xx` table, do not hand-edit it.** The table on `compiler.mdx` is
  `mz harness definition` at the commit it names. When the language adds or changes a program
  code, regenerate it from the definition and move the commit.
- **"The language harness", not "the harness".** RFC-0012 was renamed on 7 October 2026.
  `benchmarks/harness/` is always "the benchmark harness". `charter.mdx` follows the charter's
  own wording, which still says "the harness".
- **Do not put a model name or identifier in a page.** Say "a frontier model" or "a ~7B
  open-weight model" and link the pilot write-up, which names them.

## Freshness rule

An owner rule, 2026-09-30: **docs.mzizi.dev must never lag the language or the components.**

- The upstreams are the language ([`mzizi-dev/mzizi`](https://github.com/mzizi-dev/mzizi)),
  the registry ([`mzizi-dev/mzizi-registry`](https://github.com/mzizi-dev/mzizi-registry)),
  the Mzizi Roots crates on crates.io, and the `@nyuchi/mzizi-*` npm packages built in
  `mzizi-dev/agent-tools`. Also the `api.mzizi.dev` registry pin and the MCP Registry entry.
- A standing **docs-freshness agent** checks upstream state against what these pages say and
  opens a pull request whenever they drift. The supervisor reviews and merges it.
- Anyone changing the language or the components should expect a docs update to follow, and
  should say in their pull request that they changed it.
- `node scripts/check-freshness.mjs` compares the facts it knows how to find (package and
  crate versions, the language's test count, its `compiler/src` line count (counted in the
  source, because the README can lag) and checked commit, the charter's version and title,
  every `LANGUAGE-TRACKER.md` row's mark on `tracker.mdx`, the arms in `benchmarks/arms/`
  against `benchmark.mdx`, the version `mcp.mzizi.dev` serves, the registry's component count
  on every page that states it (`/v1/ui`'s `meta.total`), the crate `/v1/rs/{name}` names for
  each first-batch component, the MCP Registry entry) with their live sources. While every Roots crate is on crates.io, it also fails on any
  page that says one is not.
- **Registry pins are not stated as current.** The API's and the MCP server's pins each have a
  bot that moves them to registry `main` hourly once the owner adds its token. Pages say how to
  read the live pin (the `x-mzizi-source` header; `catalogue.json`'s `source.registry`) and
  quote a commit only as a dated example. The script warns when the API pin trails registry
  `main` or the two pins differ, and fails when the header changes shape. `.github/workflows/freshness.yml` runs it daily and on
  demand. It needs the network, so it is not a required check. When you move one of those
  facts on a page, keep the sentence shape the script matches, or update the script.

## Changelog (hard rule)

An owner rule, 2026-09-30: "changelogs are super important".

- **Every pull request that changes a page, a documented fact, the navigation, a redirect or a
  default adds an entry under `## [Unreleased]` in `CHANGELOG.md`**, in the same pull request.
  Use the Keep a Changelog headings (Added, Changed, Deprecated, Removed, Fixed, Security), mark
  a moved or removed page **Breaking** unless a redirect keeps its URL, and say what a reader
  finds differently, not the commit text. A freshness pull request is no exception: name the
  facts that moved and the pages they are on.
- The `changelog / entry required` check (`.github/workflows/changelog.yml`) fails a pull
  request without one. Pull requests that touch only `.github/`, lockfiles or lint config pass,
  and pure CI, lint or typo pull requests can carry the `no-changelog` label instead.
- The logic is `scripts/changelog-gate.sh`, tested by `scripts/changelog-gate.test.sh`. Keep
  both identical to the copies in the other Mzizi repositories. Mintlify publishes neither
  `CHANGELOG.md` nor `scripts/`.

## Terminology

- Write the wordmark as **Mzizi**. The other wordmarks stay lowercase: nyuchi, mukoko,
  shamwari, bundu. npm packages keep the `@nyuchi/` scope.
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
- **Security contact.** `security@nyuchi.com`, for the console and everything else Mzizi,
  including this site (owner, 3 October 2026).
- **General contact.** `support@bundu.org`, for every public contact point that is not a
  security report (owner, 30 September 2026). Never put a person's own email address on a page.
- There is **one ecosystem: the Bundu ecosystem**. Mzizi, Nyuchi, Mukoko and the other brands
  sit inside it. Never write "the Mzizi ecosystem" or "the Nyuchi ecosystem".

## Style preferences

- Active voice, second person ("you").
- Sentence case for headings. One idea per sentence.
- Code formatting for file names, commands, paths, and code references.
- Quote the source when it says something better than a paraphrase would, and attribute it.
- British spelling, matching the source repository.

## Colours

The docs wear `mzizi.dev`'s theme: `@bundu/ui` 0.2.0 plus `brand-mzizi.css`, so the accent is
hematite (`#4A616B` light, `#C9D2D7` dark, the accessible values) on `#F3F3F1` / `#0E0D0C`,
with no background decoration. `style.css` names the source of every value. Change a colour
only when that source changes.

`docs.json`'s brand colours are gated by `scripts/check-contrast.mjs` at APCA 3.0 Lc 75, and
the script fails if they drift from the recorded values.
Remember `colors.light` renders in DARK mode and `colors.dark` renders in LIGHT mode. Do not
substitute a WCAG ratio check for this — see the README for why that masks real failures in
this palette.

## The published design system

The Mzizi design system is published on claude.ai as the
[Design System artifact](https://claude.ai/artifact/G8CCtAbZ8w717uQ3R5itCc): voice and
content fundamentals, visual foundations (surfaces, ink and accent, status colours), the
marks, and component previews. Its source of truth is the `design-system/` folder in
`mzizi-dev/mzizi-registry` (arriving with mzizi-registry#418), which the artifact is built
from file for file. Edit the folder, never the artifact page; the artifact is republished
from registry `main` after a merge that touches it. `foundations/overview.mdx` links it.

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
node scripts/check-freshness.mjs                                # stated facts vs live sources (network; not in CI)
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

## Track big work in GitHub issues

Any substantial build, migration, investigation or multi-step task gets a GitHub issue in the repo that owns it — before or as work starts — so another session, agent or person can pick it up.

- The issue holds the goal, the owner's decisions (verbatim where given), the plan, acceptance criteria, owner-only steps and links.
- Every PR references its issue (`Refs #n`; `Fixes #n` only when the merge completes it).
- Post progress, decisions and a hand-off note (what's done, what's left, branch names) as issue comments — at each merge and before a session or agent finishes.
- Work spanning repos gets a tracking issue that links the per-repo issues.
- Never put secrets, credential status or exploitable detail in issues on public repos.

## Dev skills, progress reports and the merge gate

Load the Mzizi **dev skills** before starting work: `mzizi_get_skills category=dev` on the Mzizi MCP (`mcp.mzizi.dev`), or `@nyuchi/mzizi-skills` from npm. They are `digital-hygiene` and `progress-report`.

- **Digital hygiene.** Check free disk before starting, clone only under `$TMPDIR`, share build caches, and audit, then delete, your clones once the work merges (`digital-hygiene` skill).
- **Clone isolation.** Clone only into a directory unique to you; never touch another agent's.
- **Progress reports.** All dev work runs on a 10-minute progress-report loop (`progress-report` skill): measured bars, what changed, and a final "Needs you:" line. Report ticks never publish, release, merge or deploy without the owner's approval.
- **Merge gate.** Merge only when the work is complete, CI is green, it's verified at runtime, and `/code-review` has run with findings resolved.

## Upstream first (hard rule)

Owner, 2026-10-04: "anything new that is not in Mzizi, or altered from the Mzizi ones, we
need to adjust Mzizi so the design is always updating so we maintain consistency." A
component an app needs that Mzizi lacks, or a change to one it has, goes upstream at once:
its contract in `mzizi-dev/mzizi-registry` `contracts/`, its build in `@bundu/ui`, and its
page here, in the same piece of work. An app keeps a local copy only while that upstream PR
is open, marked `TODO(mzizi): <PR URL>`. Pages here never show a forked component as the
way to do it; the standards are `patterns/dashboard-standard` and
`patterns/discover-standard`.
