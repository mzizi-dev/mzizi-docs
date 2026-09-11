# Documentation project instructions

## About this project

- A [Mintlify](https://mintlify.com) documentation site for **Mzizi-lang**, deploying to
  `docs.mzizi.dev`.
- Pages are MDX with YAML frontmatter, in one flat directory. Configuration is `docs.json`.
- Source of truth for every factual claim is
  [`mzizi-dev/mzizi`](https://github.com/mzizi-dev/mzizi) — `CHARTER.md`, `README.md`, the
  four RFCs in `design/`, `primitives/*.mz`, and the compiler source under `compiler/`.
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

Two specific traps:

- **Do not quote RFC examples as working syntax.** RFC-0001's view attributes have no `=`;
  the implemented parser requires `name = value`. Prefer quoting `.mz` files from the
  repository, which CI gates.
- **Do not document `mz fix`, `mz refs`, `mz path`, `mz patch` or `mz diff` as commands.**
  They are designed, not built. The binary dispatches `check`, `outline`, `hash`, `ir`.

## Terminology

- **Mzizi-lang** (or "the language") for the Phase 0 research project. **The Mzizi registry**
  for the shipping component system at `mzizi.dev`. They are different things and the
  distinction is load-bearing — `ecosystem.mdx` exists mostly to hold it.
- **`mz`** is the compiler binary. **Primitives** are `.mz` source copied into a project, not
  crates.
- The framework is Bundu Foundation IP; the console ("Fundi") is Nyuchi-owned. Keep the
  ownership line the charter draws.

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
