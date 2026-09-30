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
