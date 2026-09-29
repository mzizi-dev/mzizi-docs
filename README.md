# Mzizi documentation

> The Mzizi documentation site — a [Mintlify](https://mintlify.com) project that leads with the Mzizi language, then the toolchain, the components and the platform that support it.

[![CI](https://github.com/mzizi-dev/mzizi-docs/actions/workflows/ci.yml/badge.svg)](https://github.com/mzizi-dev/mzizi-docs/actions/workflows/ci.yml)
[![Lint](https://github.com/mzizi-dev/mzizi-docs/actions/workflows/lint.yml/badge.svg)](https://github.com/mzizi-dev/mzizi-docs/actions/workflows/lint.yml)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
![Mintlify](https://img.shields.io/badge/Mintlify-docs-0D9373?style=flat-square)

**Status:** live | **Address:** [docs.mzizi.dev](https://docs.mzizi.dev) | **Deploys from:** this repository, on Mintlify

---

## This is the home of Mzizi's documentation

**[docs.mzizi.dev](https://docs.mzizi.dev) is live.** Checked 2026-09-29: HTTP 200. Its
Mintlify MCP server at `https://docs.mzizi.dev/mcp` is public, and `mcp.mzizi.dev` federates
it as `docs_*` tools, so page changes here reach agents through both. This repository is the single home of Mzizi's
documentation — language and registry both. Link `docs.mzizi.dev` for anything Mzizi;
do not link the old Mzizi path on `docs.bundu.org`, which returns 404.

The move was decided in
[`mzizi-registry#324`](https://github.com/mzizi-dev/mzizi-registry/pull/324), "Mzizi
documentation moves to mzizi-docs / docs.mzizi.dev", merged 2026-09-25.
[docs.bundu.org](https://docs.bundu.org) remains Bundu's own product documentation and
[docs.nyuchi.com](https://docs.nyuchi.com) nyuchi's engineering documentation; neither is
where Mzizi's docs live.

## What it documents

Four tabs, in this order, because the language is the main subject and everything else
supports it:

| Tab            | What it covers                                                                                                                        | Source of truth                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Language**   | Status, the pilot results, direction, syntax, primitives, the IR, the charter, the benchmark, the RFCs                                | [`mzizi-dev/mzizi`](https://github.com/mzizi-dev/mzizi)                                                    |
| **Toolchain**  | `mz`, the MCP server, the CLI, the skills bundle                                                                                      | `mzizi-dev/mzizi`, and the published `@nyuchi/mzizi-*` npm packages                                        |
| **Components** | Mzizi Roots (Rust-first, in progress), the registry, the DNA-helix architecture, foundations, patterns, blocks, charts, content style | [`mzizi-dev/mzizi-registry`](https://github.com/mzizi-dev/mzizi-registry) and `api.mzizi.dev/v1`           |
| **Platform**   | The API gateway, where data lives, the console                                                                                        | [`mzizi-dev/mzizi-api-gateway`](https://github.com/mzizi-dev/mzizi-api-gateway), `mzizi-dev/mzizi-console` |

## The one editorial rule

The Mzizi language is a **prototype front end**. Two small pilots of its benchmark ran on
2026-09-27 and **neither showed an advantage**; the run that tests the kill criterion has not
happened. Documentation that implies a working production language would be actively
misleading, so `status.mdx` states the position in full, `pilots.mdx` reports the results
as they fell, and every page that touches an unimplemented feature marks it. CI enforces the
floor of this with a grep for overclaiming phrasings (the `honesty` job in
`.github/workflows/ci.yml`); the grep is a backstop, not the standard. The standard is that
a claim on this site is either checkable in the source repository or labelled as a design
intention.

## Facts that drift

Checked 2026-09-29. Most inherited prose gets at least one of these wrong.

- **No database outside the console.** The registry is files (`registry.json`, component
  source, `content/doctrine/**`). `api.mzizi.dev` is `mzizi-api-gateway`, a Hono Worker
  that bundles those files from a pinned registry commit; `mcp.mzizi.dev` does the same.
  Only `mzizi-console` uses Supabase.
- **The install form is `https://api.mzizi.dev/v1/ui/<name>`.** `mzizi.dev/api/v1/*`
  redirects there.
- **The palette is 21 colour families**: 7 minerals, 7 heritage, 7 experimental.
- **The architecture is the DNA helix**: 8 nodes, 4 rungs, 6 strands. "Axis", "axes" and
  "layer" are retired vocabulary.
- **`nyuchi-*` components are `mzizi-*`**, with 308 redirects from the old names.
- **Security contacts:** `security@nyuchi.com` for the console, `security@bundu.org` for
  everything else Mzizi.

## Layout

```
docs.json          navigation (four tabs), redirects, theme, colours, fonts, contextual menu
style.css          neutral ramp + base font size (auto-loaded by Mintlify on deploy)
*.mdx              the language pages, flat at the root, plus compiler.mdx and console.mdx
toolchain/         the toolchain overview, the MCP server, the CLI, the skills bundle
roots/             Mzizi Roots, the Rust-first components (in progress)
registry/          consuming, contributing, schema, browsing
architecture/      the DNA helix, node placement, component backlinks
foundations/       tokens, typography, layout, motion, icons, a11y, i18n
patterns/          the mandatory application patterns
blocks/ charts/    composed page sections; the Recharts wrappers
content/           voice, tone, error messages, inclusive language
platform/          the API gateway, where data lives
images/            favicon
scripts/           check-contrast.mjs — the APCA 3.0 gate CI runs
```

The component pages were consolidated in from two other organisations' Starlight sites
(`bundu-labs/bundu-docs` and `nyuchi/nyuchi-docs`). The last Mzizi pages in
`nyuchi/nyuchi-docs` (the `mzizi-tools/` section) were folded in on 2026-09-29; see that pull
request for what moved and what was dropped as obsolete.

## Running it locally

```bash
npm i -g mint && mint dev   # http://localhost:3000, from the repo root
```

See [`AGENTS.md`](./AGENTS.md) for the local-dev caveats, the exact checks CI runs, and the
merge convention.

### Why APCA and not WCAG

Mzizi's stated accessibility standard is APCA 3.0, not WCAG 2.x, and the difference is not
academic here. `mint a11y`'s colour check is WCAG-ratio based and is not polarity-aware — it
tests `colors.dark` against _both_ backgrounds and demands 3:1 on each, even though `dark`
only ever renders in light mode and `light` only ever renders in dark mode. Satisfying it
pushes both values to mid-tone and serves neither theme.

It also masks real failures. Sodalite's published `darkHex` (`#3D5AFE`) passes WCAG against a
near-black background and scores APCA **Lc -25.8** — below even the Lc 30 floor for non-text
UI. The ratio says fine; the perceptual model says unreadable; the perceptual model is right.

So `scripts/check-contrast.mjs` is the gate, and `mint a11y` runs only for the MDX alt-text
check it is genuinely good at. Both colours in `docs.json` are published Mzizi cobalt tokens
(`#0047AB` light, `#B3E5FC` dark) and clear Lc 75 against the site's backgrounds, which are
`mzizi.dev`'s own `--background` values.

### Secret scanning

CI runs the **gitleaks binary directly**, pinned, rather than `gitleaks/gitleaks-action` —
that wrapper now requires a paid licence for organisation repositories, while the underlying
binary is still MIT-licensed.

## Deployment

Mintlify deploys this repository to [docs.mzizi.dev](https://docs.mzizi.dev) through the
Mintlify GitHub App, installed on `mzizi-dev/mzizi-docs`. **A merge to `main` deploys to
production automatically**; pull requests get a preview deployment. Configuration lives in
the [Mintlify dashboard](https://dashboard.mintlify.com), not in this repository.

`mzizi.dev`'s DNS is on Cloudflare. If the `docs` record ever needs recreating, add the
custom domain in Mintlify first and take the `CNAME` target from the Mintlify dashboard
rather than from anything written down here — it is deployment-specific. Keep that record
**DNS-only (grey cloud), not proxied**: proxying in front of a provider that terminates its
own TLS fails as a certificate error, not a DNS one.

See [`AGENTS.md`](./AGENTS.md) for the merge convention and the MDX/prettier gotcha.

## Licence

Licensed under the [Apache License 2.0](./LICENSE).

Mzizi owns and operates its framework, language, registry, design system, docs and API. The
Bundu Foundation is the parent copyright holder.
