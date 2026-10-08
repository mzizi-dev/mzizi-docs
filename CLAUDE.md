# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

`AGENTS.md` (imported above) is the canonical guide: the honesty rule, the freshness rule,
the changelog rule, terminology, style, colours and the merge convention. This file adds only
what it does not say, or says in passing.

## What this repository is

A Mintlify docs site (no `package.json`, no build step, no tests of its own beyond the
changelog gate). Content is MDX at the root and in topic folders; `docs.json` is the single
config: the four tabs (Language, Toolchain, Components, Platform), every page's place in the
navigation, `redirects`, the theme and the brand colours. A page that is not listed in
`docs.json` navigation does not appear in the site's sidebar.

## Commands

No install step: everything runs through `npx` or plain `node` (CI uses Node 22). The
CI-equivalent commands are in `AGENTS.md` under "Commands"; these are the ones it does not
list:

```bash
bash scripts/changelog-gate.test.sh                           # tests for the changelog gate
CHANGELOG_BASE=origin/staging bash scripts/changelog-gate.sh  # the changelog check, run locally
```

There is no "single test" to run: each check above is independent, so run the one that
matches what you changed. Editing one page: `validate`, `broken-links` and the Prettier check
on that file (`npx prettier@3.9.4 --check path/to/page.mdx`). Touching `docs.json` colours:
`check-contrast.mjs`. Moving a fact that `check-freshness.mjs` parses: run it, and keep the
sentence shape it matches or update the script in the same change.

The CI `honesty` job (in `.github/workflows/ci.yml`) is a `grep -rniE` over `*.mdx` for
overclaiming phrases, excluding `status.mdx`. To reproduce it, copy the pattern from that
workflow rather than retyping it.

## How the pieces connect

- **Navigation and URLs.** A page's URL is its path without `.mdx`; `docs.json` lists it.
  Renaming or moving a page means editing the `navigation` entry, adding a `redirects` entry
  for the old path, and recording it in `CHANGELOG.md` (**Breaking** if there is no redirect).
- **Facts come from upstreams, not from this repo.** Language claims come from
  `mzizi-dev/mzizi` (especially `LANGUAGE-TRACKER.md`, mirrored by `tracker.mdx`); component
  claims from `api.mzizi.dev/v1` and `mzizi-dev/mzizi-registry`. `scripts/check-freshness.mjs`
  regex-matches specific sentences in specific pages (`page()` / `stated()`), so prose edits
  near a version, count or pin can break it even when the fact is unchanged.
- **Colours live in three places that must agree:** `docs.json` `colors` / `background`,
  `style.css` (which records the source and measurement of each value) and the expected
  values hard-coded in `scripts/check-contrast.mjs`.
- **What Mintlify publishes.** `.mintignore` keeps `scripts/` and drafts (`drafts/`,
  `*.draft.mdx`) off the site; Mintlify also skips `.github`, `.claude`, `README.md`,
  `CHANGELOG.md` and similar by default.
- **Ownership of shared files.** `scripts/changelog-gate.sh` and its test are copies kept
  identical across the Mzizi repositories; `.markdownlint.jsonc`, `.prettierignore` and
  `.yamllint.yaml` come from the org config. Change them upstream, not only here.

## Branches, releases and deploys

- **`staging` is the integration branch.** Base branches and pull requests on `staging`, not
  `main`. CI (`ci.yml`) runs on pushes to `main` and `staging` and on pull requests into
  `main`, `staging` and `claude/**` (stacked PRs get checks too).
- **Every merge into `staging` is tagged as the next patch version** by
  `.github/workflows/staging-version.yml` (the org's reusable staging-release workflow; minor
  and major only by manual dispatch).
- **`staging` is promoted to `main` by a release PR** (for example "Release v0.1.0"), and
  `main` is synced back into `staging` with "chore: bring staging up to main" PRs.
- **A merge to `main` deploys docs.mzizi.dev** through the Mintlify GitHub App; pull requests
  get preview deployments. Deployment settings live in the Mintlify dashboard, not here.
- Merges are rebase-only (`gh pr merge <n> --rebase --auto`), as `AGENTS.md` says.

## Pull request checklist

- An entry under `## [Unreleased]` in `CHANGELOG.md` for any change outside `.github/`,
  lockfiles and lint config (the `changelog / entry required` check), or the `no-changelog`
  label for pure CI, lint or typo changes.
- Prettier-clean MDX, but never `prettier --write` an `.mdx` containing `{/* … */}`.
- No model names or identifiers in pages; no link to the private `mzizi-dev/agent-tools`.
- Reference the tracking issue (`Refs #n`) for substantial work.
