# mzizi-docs

The Mzizi documentation site — a [Mintlify](https://mintlify.com) deployment, destined for
`docs.mzizi.dev`.

It documents two things that share a name, and keeps them apart.

**Mzizi-lang** — the Phase 0 research language, its `mz` compiler, the nine primitives, the
content-addressed IR and the four RFCs — from
[`mzizi-dev/mzizi`](https://github.com/mzizi-dev/mzizi). These are the pages in the flat root
directory.

**The Mzizi registry** — the shipping component system, brand system and DNA-helix
architecture served at `mzizi.dev`, from
[`mzizi-dev/mzizi-registry`](https://github.com/mzizi-dev/mzizi-registry). These are the pages
under `architecture/`, `registry/`, `foundations/`, `patterns/`, `blocks/`, `charts/` and
`content/`, plus `tooling.mdx` and `console.mdx`.

They are different things with different maturity, and the distinction is load-bearing.
`ecosystem.mdx` draws the line, and every section landing page under the registry tree repeats
it.

## The one editorial rule

Mzizi-lang is a **prototype front end**. Its own README says so: contract bodies parse but
are not evaluated, the Phase 0 benchmark has not run, and _"nothing here has yet been
measured against the charter's kill criteria."_

Documentation that implies a working production language would be actively misleading, so
`status.mdx` states the position in full and every page that touches an unimplemented feature
marks it. CI enforces the floor of this with a grep for overclaiming phrasings (the `honesty`
job in `.github/workflows/ci.yml`); the grep is a backstop, not the standard. The standard is
that a claim on this site is either checkable in the source repository or labelled as a
design intention.

## Layout

```
docs.json          navigation, theme, colours, fonts, contextual menu
style.css          neutral ramp + base font size (auto-loaded by Mintlify on deploy)
*.mdx              the Mzizi-lang pages, flat at the root
architecture/      the DNA helix, node placement, component backlinks
registry/          consuming, contributing, schema, browsing, the MCP server
foundations/       tokens, typography, layout, motion, icons, a11y, i18n
patterns/          the mandatory application patterns
blocks/ charts/    composed page sections; the Recharts wrappers
content/           voice, tone, error messages, inclusive language
images/            favicon
scripts/           check-contrast.mjs — the APCA 3.0 gate CI runs
```

The registry pages were consolidated in from two other organisations' Starlight sites
(`bundu-labs/bundu-docs` and `nyuchi/nyuchi-docs`). Nothing was removed from those sites —
see the import notes in the pull requests that landed them.

## Running it locally

```bash
npm i -g mint      # the Mintlify CLI
mint dev           # http://localhost:3000
```

Run it from the repository root, where `docs.json` lives.

Two things worth knowing before you trust the preview:

- **`style.css` is not picked up by `mint dev`.** The `--gray-*` values stay Mintlify's
  computed defaults locally. Per Mintlify's own documentation the file is auto-loaded on the
  deployed site, so this is a local-CLI gap — but re-verify the ramp on a real deploy preview
  rather than assuming.
- If a page 404s, check you are in a directory with a valid `docs.json`. If the dev server
  misbehaves, `mint update`.

## Checks

Everything CI runs, runnable locally:

```bash
npx mint@latest validate                                        # strict: warnings fail
npx mint@latest broken-links --check-anchors --check-redirects  # internal links only
npx mint@latest a11y                                            # alt attributes
node scripts/check-contrast.mjs                                 # APCA 3.0 brand colours
```

`broken-links` deliberately omits `--check-external`: it would make the check depend on
third-party availability and turn a transient network failure into a red PR unrelated to the
diff.

### Why APCA and not WCAG

Mzizi's stated accessibility standard is APCA 3.0, not WCAG 2.x, and the difference is not
academic here. `mint a11y`'s colour check is WCAG-ratio based and is not polarity-aware — it
tests `colors.dark` against *both* backgrounds and demands 3:1 on each, even though `dark`
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

## How it deploys

Mintlify deploys from this repository through the Mintlify GitHub App. Install it from the
[Mintlify dashboard](https://dashboard.mintlify.com/settings/organization/github-app) and
point it at `mzizi-dev/mzizi-docs`. After that, **a merge to `main` deploys to production
automatically**; pull requests get a preview deployment.

This repository is **merge-only**. Land changes with:

```bash
gh pr merge <n> --merge --delete-branch
```

## Making `docs.mzizi.dev` live — for a human

Not done, deliberately, and not doable from CI. As of 11 September 2026 `docs.mzizi.dev`
returns no DNS record at all; `mzizi.dev` and `mcp.mzizi.dev` resolve, `api.mzizi.dev` and
`app.mzizi.dev` do not.

Cutover needs three steps, in this order:

1. **Connect the repository.** Install the Mintlify GitHub App on `mzizi-dev/mzizi-docs` and
   confirm a production deployment succeeds on the Mintlify-provided subdomain first. Do not
   point DNS at something that has never built.
2. **Add the custom domain in Mintlify.** In the Mintlify dashboard, add `docs.mzizi.dev`
   under the deployment's custom-domain settings. Mintlify will issue the CNAME target to
   use — take it from there rather than from any value written down in this repository,
   because it is deployment-specific and it changes.
3. **Create the DNS record.** `mzizi.dev` is on Cloudflare. Add a `CNAME` for `docs` pointing
   at the target Mintlify gave you. **Set it to DNS-only (grey cloud), not proxied** —
   proxying in front of a provider that terminates its own TLS is the standard way this goes
   wrong, and the failure looks like a certificate error rather than a DNS one. Then wait for
   Mintlify to report the domain verified and the certificate issued.

Afterwards, update `ecosystem.mdx` — it carries a dated table of which subdomains resolve,
and that table should stay true.

## Licence

Apache-2.0. See [`LICENSE`](./LICENSE).
