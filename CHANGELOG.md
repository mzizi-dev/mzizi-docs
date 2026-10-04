# Changelog

All notable changes to `mzizi-docs`, the Mintlify site at
[docs.mzizi.dev](https://docs.mzizi.dev), are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
The docs deploy on every merge to `main` and have no versioned releases, so
sections are dated by the day the change merged (UTC), newest first. Within a
section, entries sit under Added, Changed, Deprecated, Removed, Fixed or
Security, and a moved or removed page is marked **Breaking** unless a redirect
keeps its old URL working.

**The rule (owner, 2026-09-30):** every pull request that changes a page, a
documented fact, the navigation, a redirect or a default adds an entry under
`## [Unreleased]` in the same pull request, saying what a reader of the docs
will find differently. The `changelog / entry required` check fails a pull
request that doesn't. Pull requests that touch only `.github/`, lockfiles or
lint config pass without one, and pure CI, lint or typo pull requests can carry
the `no-changelog` label instead. When a dated section is cut, the Unreleased
entries move under it. Mintlify does not publish this file.

## [Unreleased]

### Added — the Mzizi Discover Standard (2026-10-04)

- **`patterns/discover-standard`**: one design for every public discover and browse page in the Mukoko family (circles, news, events, weather, the super-app on the web). The anatomy, the one `DiscoverCard` with its four variants, shared behaviour (URLs, cursor paging, no client JavaScript or inline styles, "Open in Mukoko" as an https link, SEO), server-filled shells, density, brand and accessibility, the eleven contracts, how to adopt, and the upstream-first rule. Screenshots from circles.mukoko.com. Tracking: mzizi-dev/mzizi-registry#413.
- **`registry/contracts`** names the second contract family, `discover/`.

### Changed — Mukoko Events replaces nhimbe (2026-10-04)

- The owner's decision of 4 October 2026 retires the _nhimbe_ brand. The events platform is Mukoko Events at events.mukoko.com, and its mineral stays malachite. Canon's ecosystem row is now `events`, and `nhimbe` is kept as a deprecated alias (mukoko-dev/nhimbe#155).
- **`patterns/dashboard-standard`**: the overlay table names `brand-events.css` and says that `brand-nhimbe.css` is a deprecated alias of it. The lingo, bushtrade, campfire and events overlays are no longer marked "proposed", because they shipped in packages-npm#24.
- **`foundations/tokens`**: the brand-mineral table's `nhimbe` row is now `events`, with a note on the alias. **`foundations/typography`** drops Nhimbe from the wordmark examples.

### Added — component contracts, the reference (2026-10-04)

- **New page, `registry/contracts`** (Components → The registry → Contracts): the machine-readable, versioned contracts that the Dashboard Standard's 31 `@bundu/ui` app components carry in `mzizi-dev/mzizi-registry` `contracts/` (mzizi-registry#406). It links the schema, `index.json`, the README and every `app/` contract by node, and walks through each field with part of the Button contract as an example. It covers the versioning rule (major, minor, patch), the clause subset and the rule that an unevaluable clause fails, how the block relates to the Roots crates' `CONTRACT` and to `mz contract`, and the no-JS, density and theming requirements. It also says how each implementation is checked, which primitives have React and Rust siblings, the four recorded gaps, and how to add or change a contract.
- **`patterns/dashboard-standard`** (Contracts) and **`registry/overview`** link to the new page.

### Added — the Mzizi Dashboard Standard (2026-10-04)

- **New page, `patterns/dashboard-standard`** (Components → Patterns → Dashboard Standard): the owner's decision of 4 October 2026 that the Nyuchi console shell is the one dashboard design for the whole Bundu ecosystem, with each brand's mineral as an overlay. It covers the anatomy (sidebar groups, top bar, page header, toolbar, stat tiles, content cards, empty states, footer) mapped to the 31 `@bundu/ui` app components, density for fine and coarse pointers, the brand overlay rules and the ecosystem minerals, the accessibility baseline, the no-JavaScript behaviour, the component contracts (format, how each implementation is tested, and which have no React or Rust build), and how to adopt it. Five console screenshots are the reference, in `images/dashboard-standard/`. Tracking: mzizi-dev/mzizi-registry#404.

### Changed — the MCP server carries the registry API handlers it runs (2026-10-03)

- **`toolchain/mcp.mdx`, "Where its data comes from":** `mzizi-mcp` still generates its data by running the registry's API handlers at build time, but the registry no longer has them (it removed its Next.js app, `app/api/v1/**` included, on 2026-10-02). The page now says `mzizi-mcp` keeps the eleven handlers it calls in `mzizi-mcp/scripts/registry-handlers/`, ported unchanged from registry `270af9f` (agent-tools #172). They are build-time only, they read the pinned registry checkout through its own `lib/` modules, and any npm import they make throws if used, so a handler that reaches for a database fails the build. The pin paragraph no longer says the bot waits for its token: it runs on `RELEASE_BUMP_TOKEN` and opened agent-tools #169 on 2026-10-02.
- **`scripts/check-freshness.mjs`:** its warning for a gateway pin behind registry `main` no longer says the bot waits for a `PIN_BUMP_TOKEN`.

### Changed — one security contact: `security@nyuchi.com` (2026-10-03)

- **Security reports for everything Mzizi go to `security@nyuchi.com`** (owner, 3 October
  2026). The "Reporting a security problem" table on `/ecosystem` becomes one sentence, the
  footer's security link and the `/.well-known/security.txt` contact on
  `/platform/api-gateway` name it, and `security@bundu.org` is no longer used.

### Changed — the registry has no app any more (2026-10-02)

mzizi-registry removed its Next.js app, its `/api/*` handlers and its OpenNext deployment on 2026-10-02 (mzizi-registry #389 and #391). These pages stop describing them.

- **`platform/api-gateway.mdx`:** the retired-proxy note says the registry's own API handlers are gone too. An unexplained parity difference now means the registry changed a file the gateway reads, not "a route handler". **"Rollback, in brief"** no longer moves `api.mzizi.dev` back to the registry's Worker, which is being deleted: it reverts in a pull request, or rolls the gateway Worker back to its previous deployment.
- **`ecosystem.mdx`:** the mzizi-registry card no longer says its Worker serves the per-component portal pages on a `workers.dev` address. Those pages are on the site, at `mzizi.dev/components/<name>`.
- **`registry/components.mdx`:** `mzizi.dev/components/<name>` is the component's page on the site. It no longer redirects to a registry portal page.
- **`registry/contributing.mdx`:** steps 4 and 5 used `pnpm registry:build`, `public/r/` and `pnpm dev` with `localhost:3000/api/v1`. None of those exist now. The steps now run the generators and `pnpm build` (every generator, with CI failing on a diff), then `pnpm registry:validate` and `pnpm registry:verify`. They say the API serves the component once the API's pin moves to it. The checklist follows.
- **`registry/schema.mdx`:** "Static build output" (`public/r/*.json`) is now "No static build output". Each item is served by `api.mzizi.dev/v1/ui/<name>`.
- **`platform/api-gateway.mdx`, "How the pin moves":** the pin bot reads `RELEASE_BUMP_TOKEN` (renamed from `PIN_BUMP_TOKEN` on 2026-09-30) and is live: it opened mzizi-api-gateway#29 and agent-tools#169 on 2026-10-02. It merges its own pull request only when the token also has Checks and Commit statuses read access; otherwise the pull request waits for a person. The page used to say the bot did nothing until a `PIN_BUMP_TOKEN` was added.
- **`patterns/architecture.mdx`, `patterns/lazy-loading.mdx`:** the design portal's live demos went with the registry's app, and no live demo replaces them.

### Changed — lint runs once, from the org-required workflow (2026-10-03)

- **Removed `.github/workflows/lint.yml`.** The `mzizi-dev` org ruleset now runs the shared lint on every pull request through `mzizi-dev/.github`'s `org-lint.yml`, publishing the same five `lint / …` checks, so the repo's own caller only ran lint a second time.

### Changed — the skills page describes `@nyuchi/mzizi-skills` 0.8.5

`toolchain/skills.mdx` now matches the 0.8.5 bundle (agent-tools#166), which
follows language main `62a0f32`:

- **The version is `0.8.5`** (was `0.8.4`). "Getting the skills" now says all
  four copies (npm, the MCP server, the API and the plugin) served `0.8.5` on
  30 September 2026, where it said the API still served `0.8.2`.
- **`mzizi-language`** is described as the skill that points agents at
  `LANGUAGE-TRACKER.md` before any capability claim. It covers the backend
  `service` syntax (routes, handlers with `when`, `header` and `respond`, and
  `example` and `ensure` contracts; RFC-0011), `mz contract` running a
  service in process, and `mz build`, which lowers a service to a local
  Rust + axum package. It gives the harness as designed in RFC-0012, a draft,
  and lists exactly what is not built yet.
- **`mzizi-backend`** is described as covering the language's `service`
  slice, which runs in process and lowers to a local axum package, with no
  Workers target and nothing deployed.

### Changed — the docs match language main `62a0f32`

A freshness update. Every capability claim now comes from
`LANGUAGE-TRACKER.md` in `mzizi-dev/mzizi`, the language's one tracker of what
it still needs. The facts that moved, and where:

- **Added: What still has to be built (`/tracker`)**, in "Start here" after
  Status. It summarises `LANGUAGE-TRACKER.md`: where Mzizi stands, Mzizi's
  column against Python, Go, C++, TypeScript and Rust, every tier row with its
  mark, what each step unlocks for the benchmark, and milestones M1 (a language
  that computes) and M2 (a working programming language), neither reached. The
  overview, Status, the roadmap and the ecosystem map link it, and the
  overview, Status and the new page say plainly that Mzizi has no expressions,
  bindings, callable functions, loops, error handling, modules or standard
  library yet.
- **Changed: what lowers.** "Nothing lowers to Rust" is replaced everywhere
  (overview, Status, the compiler, syntax, Mzizi Roots) with the narrower
  truth: `mz build <service.mz> --out <dir>` lowers a `service` to a local
  Rust + axum package, which CI compiles, tests and serves. No component
  lowers, and there are no Workers, Containers or WebAssembly targets.
- **Added: `mz build` and services on the compiler page.** A new "`mz build`:
  lower a service" section with real output, `mz build` in the command table,
  and `mz contract` running a service in process (22 clauses, `ensure` tested
  over 61 generated requests: tested, not proven). The commands are check, fix,
  contract, outline and build, plus hash and ir (was "six commands").
- **Added: RFC-0011 (handlers) and RFC-0012 (the harness)** to the RFC index,
  with what each settles, what is built and what each leaves open. RFC-0009's
  and RFC-0010's entries say what has been built since their status lines were
  written. The harness's design is cited as RFC-0012 (was "its RFC is being
  written").
- **Changed: charter v0.4.** The charter page summarises v0.4, "Mzizi: a
  general-purpose programming language", with its tagline as the goal Phase 0
  tests, its five changes, the five design goals (adding "Everything has a
  contract"), the harness as the core of the language, and Phase 0 by v0.4's
  title. It no longer says the charter calls Mzizi a framework. Every page
  cites charter v0.4, and no page names v0.3.
- **Changed: the benchmark arms** on the benchmark page, the overview and the
  roadmap follow `benchmarks/arms/`: React exists and has never run (was "new,
  not built"); `mzizi-be` exists with the probe crate `mzprobe` and task B1 and
  has never run (was "blocked"); the Hono, FastAPI, Go, C++ and axum arms are
  "not added yet" (was "new, not built"). What the kill-criterion run waits on
  follows `benchmarks/READINESS.md` on the pilots page and the roadmap.
- **Figures:** 425 tests in 18 suites, 294 of them in the compiler crate (was
  308, 14 and 213), and 12,644 lines in `compiler/src` (was 7,454), at
  `62a0f32` (was `e9e9233`). The IR measurements were re-run at `62a0f32` and
  are unchanged.
- **Freshness check:** `check-freshness.mjs` now also reads the charter's
  version and title, every tracker row's mark (against `/tracker`), the
  `benchmarks/arms/` listing (against the benchmark page's arms table) and the
  compiler's line count, from a shallow clone of language `main`, and fails
  when a page drifts, including when a row the pages call missing turns ✅.

### Changed — Mzizi is documented as a programming language, and Phase 0 by its goal

The owner's positioning (2026-09-30): Mzizi is a programming language, Rust is
its platform the way JavaScript is TypeScript's, and its goal is to be used
instead of TypeScript, Python and C++. The harness is the core of Mzizi, the
layer an agent reads and works through, and is designed, not built. The
toolchain and the components are built to support the language and are not
the language. Phase 0 has one goal: to build Mzizi as a programming language,
measured against the best existing language for each kind of task. Every one
of these is stated as a goal or a design, never a result.

- **Overview (`/`):** the title is now the owner's headline, "Mzizi: a
  general-purpose programming language", with the subline "Built to make Rust
  better, the way TypeScript makes JavaScript better" and one line on how (no
  borrows, lifetimes or ownership in the language you write, with the harness
  at the core), stated as the goal Phase 0 measures (was "A language designed
  to be written by machines that are not very good at writing"), and the description no
  longer defines the language as "a research language and compiler in Rust". It opens with the Rust-as-platform framing,
  a "what is which" list (the language; the harness at its core, the layer an
  agent reads and works through, designed and not built; the toolchain; the
  components), and a new "Phase 0's goal" section: to build Mzizi as a
  programming language, measured against the best existing language for each
  kind of task, with the two gating families and their languages. The charter's
  "a Rust framework" quote is replaced by the charter's argument in the
  owner's terms. Fixed: "Today it compares Mzizi with Dioxus and Leptos"
  (only Dioxus has run); "Not a web-framework target … Astro is one thin,
  optional surface" (charter v0.3 makes Astro with Roots one of two frontend
  paths); "Mzizi owns and operates the framework".
- **Status:** a new "Phase 0's goal" section says what Phase 0 is for, that
  nothing has been measured against it, and that the pilots were tests inside
  it. The front-end table says the compiler implements the language, and adds
  the harness, the core of Mzizi, as designed and not built (only
  `mz check --agent` exists). The overview and the toolchain overview say the
  harness lives in `mzizi-dev/mzizi` and the agent-tools packages are its
  clients.
- **The benchmark:** leads with the goal, adds the task families and a table
  of every RFC-0009 arm with its state (exists, never run, new, blocked), and
  no longer describes Phase 0 as "N equivalent components in Mzizi and raw
  Dioxus and Leptos". The components supply the UI tasks as one of their jobs;
  a defect covers HTTP probes as well as UI facts; the repository has two
  examples, not one.
- **The toolchain overview and the compiler page:** the toolchain is not the
  language; `mz` is the compiler that implements it; the toolchain is meant
  to attach to the harness at the language's core (the language as an agent
  sees it, the agent protocol and the plugin host), which is not the Phase 0
  benchmark harness. Fixed: "the rest serve the language's corpus: the
  component registry the benchmark is scored against".
- **Mzizi Roots, the registry overview, the ecosystem page and the
  primitives:** the components are built to support the language (its UI
  layer and component model), not "the benchmark corpus".
- **The charter page:** a note says the charter's own wording still calls
  Mzizi a framework and that an update is being routed; Phase 0's step leads
  with the v0.3 goal and labels the v0.1 wording as the original.
- **Syntax:** "Mzizi lowers to Rust" is now "is designed to lower to Rust
  (nothing lowers yet)". The pilots page, the roadmap and the console page
  follow the same framing.

### Fixed

- The skills page says `@nyuchi/mzizi-skills` 0.8.4, which npm and the MCP
  server serve; `api.mzizi.dev/v1/skills` still serves 0.8.2 until its next
  registry pin (was "0.8.1" everywhere).

### Added

- `CHANGELOG.md`, backfilled from every merged pull request since the
  repository began.
- The `changelog / entry required` check (`.github/workflows/changelog.yml`,
  `scripts/changelog-gate.sh`), which fails a pull request that changes a
  non-exempt file without adding to this file. `scripts/changelog-gate.test.sh`
  tests the gate, and the check runs it first.

### Changed

- **The hematite accent now cites canon's `--heritage-hematite-text`** (mzizi-registry #385)
  instead of a value the docs derived themselves. The colours do not change: `#4A616B` in
  light mode (Lc 75.1 on `#F3F3F1`) and `#C9D2D7` in dark mode (Lc -78.1 on `#0E0D0C`).
  `scripts/check-contrast.mjs` and the `style.css` record name the canon token as the
  source.
- **The docs now wear mzizi.dev's theme** (owner decision, 2026-09-30): `@bundu/ui` 0.2.0
  with its `brand-mzizi` overlay. The accent is hematite, Mzizi's brand mineral, in place of
  cobalt: `#4A616B` in light mode and `#C9D2D7` in dark mode (was `#0047AB` / `#B3E5FC`).
  Both are the accessible forms, because raw hematite misses APCA Lc 75 as link text:
  `#C9D2D7` is canon's `--heritage-hematite-aa` (Lc -78.1), and `#4A616B` is `#546E7A` walked
  toward black with canon's own method (Lc 75.1), since canon has no light hematite that
  clears the bar on `base`. The page background is the package's `--background`, `#F3F3F1` /
  `#0E0D0C` (was `#F3F2EE` / `#1B1A17`), with no grid decoration. `style.css` rebuilds the
  gray ramp from `@bundu/ui`'s `--background`, `--surface`, `--border`, `--muted-foreground`
  and `--foreground`, and sets code in JetBrains Mono as mzizi.dev does.
  `scripts/check-contrast.mjs` now also fails when a `docs.json` colour drifts from those
  recorded sources.
- **`toolchain/mcp`** says `@nyuchi/mzizi-mcp` 0.11.2 (was 0.11.1), as npm, the live
  server's `initialize` and the MCP Registry's latest entry all report. 0.11.2 moves the
  server's registry pin to `e1c1c89`, the commit `api.mzizi.dev` serves, so the MCP tools now
  answer with Mzizi's hematite brand record and default `--primary`; the page gives that pin
  as a dated example only.
- **`toolchain/skills`** documents `@nyuchi/mzizi-skills` 0.8.1 and its five skills
  (`mzizi-language`, `mzizi-roots`, `mzizi-design`, `mzizi-backend`, `discoverability`), with
  what each covers. It was 0.7.0 with nine skills. **Breaking for readers of the old list:**
  a new "Renamed and removed skills" section maps each retired name (`scaffold-component`,
  `simplify`, `ecosystem-app-setup`, `nyuchi-design`, `cloudflare-worker-rust`,
  `mcp-server-cloudflare`, `mukoko-design`) to where its content went; there are no aliases.
- **`toolchain/skills`** gives four ways to get the skills: npm (`npm install -D` then
  `npx skills experimental_sync`, replacing `npx skills add @nyuchi/mzizi-skills`, which does
  not work), `mzizi_get_skills` on the MCP server, `GET /v1/skills`, and the public Claude
  Code plugin (`/plugin marketplace add mzizi-dev/mzizi-registry`, then
  `/plugin install mzizi@mzizi`), which ships the five skills and the Mzizi MCP from the
  registry's `plugin/` directory. The retired private `mzizi-tools` marketplace gets uninstall
  steps. The "API lags at 0.5.1" note is gone: all four served 0.8.1 on 30 September 2026.
- **`toolchain/cli`** says `@nyuchi/mzizi-cli` 0.6.3 (was 0.6.1), with what changed: 0.6.2
  sends `support@bundu.org` in its crates.io `User-Agent` instead of a person's address, and
  0.6.3 depends on skills `^0.8.0`. The "use 0.6.1 or later" warning stays.
- **`toolchain/mcp`** says `@nyuchi/mzizi-mcp` 0.11.1 (was 0.11.0) on npm, the live server
  and the MCP Registry, and gains a "The skills" section: from 0.11.1 each skill's `source`
  is `mzizi-dev/agent-tools/mzizi-skills/skills/<name>`. It no longer says the MCP server's
  registry pin is the same commit as `api.mzizi.dev`'s; it says to compare the two, which can
  differ while one moves.
- **`toolchain/overview`** lists five skills, not nine.
- **`foundations/tokens`** gains a "Brand minerals" section: Mzizi's brand mineral is
  hematite (a heritage tone, `#546E7A` light and `#90A4AE` dark), as `/v1/brand` lists it,
  and the registry's `mzizi-tokens-globals.css` resolves `--primary` per `data-brand`, with
  Mzizi's hematite as the default (it was gold). The note that said "tanzanite is
  `--primary`" now says `--primary` is never cobalt and depends on the brand; tanzanite is
  the value `/v1/brand` publishes.
- **`AGENTS.md`** lists the five skills, the public plugin, Mzizi's hematite and CLI 0.6.3
  among the facts that inherited prose gets wrong.

## [2026-09-30]

### Changed

- **`platform/api-gateway`** no longer quotes a registry pin as current. It says
  how to read the pin from the `X-Mzizi-Source` header, gives `9b86e034ffd8` as
  a dated example, and describes the pin-bump bot (hourly `bot/registry-pin`
  pull request, strict parity, rebase merge only when every check is green).
  (#16)
- **`toolchain/mcp`** documents mzizi-mcp 0.11.0 and a new "Components, Rust
  first" section: `mzizi_get_component` returns `lead`, `note`, `rust` and
  `react` (the React body moved from `component` to `react`), and
  `mzizi_list_components` takes a `rust` filter. (#16)
- **Contact:** `support@bundu.org` is on the ecosystem page, in a new footer
  column beside the security address, and in the README and AGENTS.md. (#16)
- The Roots and API pages follow the gateway to registry `9b86e03`:
  `/v1/rs/{name}` serves the twelve first-batch brand components and names
  each component's own crate (`mzizi-brand`, `mzizi-shell`, ...) with a `git`
  field; `toolchain/cli` says `mzizi add` records that crate; the MCP pin is
  `9b86e03`. (#15)
- **The language pages move to mzizi-dev/mzizi `e9e9233`:** 308 tests in 14
  suites, charter v0.3, RFC-0009 and RFC-0010 in the RFC index, `mz fix` and
  the diagnostic codes added after pilot 2 on the compiler page, and the
  pilots page's pre-kill checklist rebuilt from `READINESS.md`, with what still
  remains before the kill-criterion run. (#14)
- **Mzizi Roots:** the RFC is merged and linked, all ten crates are on
  crates.io at 0.1.0 (`cargo add mzizi-roots`), and the first batch of twelve
  brand components is described. The toolchain pages give mzizi-cli 0.6.1
  with `mzizi add`, mzizi-mcp 0.10.1 as `io.github.mzizi-dev/mzizi-mcp`,
  mzizi-skills 0.7.0, and the MCP free tier as live. (#14)

### Added

- A scheduled, non-required freshness check (`scripts/check-freshness.mjs`)
  that compares stated versions, test counts and pins with their live sources,
  and the owner's freshness rule in AGENTS.md and the README. (#14, #15, #16)

## [2026-09-29]

### Added

- **New pages:** `pilots` (both 2026-09-27 pilots as they fell: no advantage
  shown, and the 7B arm did worse in Mzizi), `roadmap` (the owner's direction,
  stated as direction), `toolchain/overview`, `toolchain/mcp`, `toolchain/cli`,
  `toolchain/skills`, `platform/api-gateway`, `platform/data` and
  `roots/overview`. (#13)

### Changed

- **The docs lead with the language.** The language pages describe
  mzizi-dev/mzizi at `a9c928d` (269 tests in 12 suites, `mz contract`
  evaluating 29 clauses, five `mz` commands), and `docs.json` has four tabs in
  order: Language, Toolchain, Components, Platform. `tooling` and
  `registry/mcp` are replaced by the `toolchain/*` pages, with redirects from
  the old paths. (#13)
- **Components are Rust first:** section notes present Mzizi Roots first and
  the TSX components as the React build; every install and API URL moves from
  `mzizi.dev/api/v1` to `api.mzizi.dev/v1`; `nyuchi-*` components use their
  `mzizi-*` names; the registry pages drop the database. (#13)
- The overclaiming check also blocks "faster/better/cheaper than Dioxus or
  Leptos", "Mzizi is faster/better" and "the pilot showed an advantage". (#13)

## [2026-09-27]

### Changed

- The charter page summarises `CHARTER.md` v0.2, which names Mzizi as owner:
  its layer table, phasing and non-goals. (#12)
- Mzizi, not the Bundu Foundation, is named as owner of the framework, the
  registry and the docs, and as operator of the design system and registry;
  the console stays Nyuchi's. There is one ecosystem, the Bundu ecosystem.
  "Bundu conventions" becomes "Mzizi conventions". (#10, #11)
- The README says docs.mzizi.dev is live and is the one home of Mzizi's
  documentation; procedural detail moves from the README to AGENTS.md. (#9)

## [2026-09-26]

### Changed

- The ecosystem, tooling and console pages match the repositories that day:
  app.mzizi.dev and api.mzizi.dev resolve, the fundi CLI works without an
  Anthropic key (not yet published), and mzizi-skills is 0.6.0. (#8)

## [2026-09-11]

### Added

- **The Mintlify site** for the Mzizi language: nine pages sourced only from
  mzizi-dev/mzizi (the charter, the RFCs, the primitives and the compiler), a
  status page listing what exists against what is designed, and CI (strict
  `mint validate`, broken links, an APCA 3.0 brand-contrast gate, image alt
  text, an overclaiming grep and a gitleaks scan). (#1)
- **The architecture, registry and tooling docs**, ported from bundu-docs and
  nyuchi-docs and corrected on the way in: the DNA double helix (eight nodes,
  six strands, four rungs) replaces the retired axis model, the registry is
  file-based, and the two MCP surfaces are one. (#2)
- **The foundations and content-style docs**, corrected against the live brand
  API: seven minerals, not five; only `--status-*` status tokens; APCA
  contrast thresholds. (#3)
- **The patterns, blocks and charts docs**, with the `[mzizi]` log prefix,
  `LazySection`'s real props and live component names. (#4)
- The org lint gate and its config files, later brought in line with the
  current org canon. (#5, #7)

### Changed

- The README said up front that the site was not yet live, and counted the
  content debt still to fix. (#6)

## [2026-08-24]

### Added

- The repository: a README and the Apache-2.0 licence.
