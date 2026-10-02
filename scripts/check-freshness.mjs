/**
 * Freshness check: do the facts these docs state still match their live sources?
 *
 * The owner's rule (2026-09-30) is that docs.mzizi.dev never lags the language or the
 * components. This script reads the version numbers, test counts and pins the pages state,
 * asks each upstream source for the current value, and reports every disagreement.
 *
 *   node scripts/check-freshness.mjs
 *
 * It needs the network, so it is NOT part of the required CI path: a registry outage would
 * turn an unrelated pull request red. `.github/workflows/freshness.yml` runs it on a
 * schedule and on demand instead. It needs Node 20 or later and `git` on the PATH.
 *
 * Exit status: 0 when every checked fact matches, 1 when any has drifted or a page no
 * longer states it in the shape this script expects (a silent skip would read as fresh),
 * 2 when a source could not be reached. A new commit on the language's main branch is
 * reported as a warning only, because most commits change no fact these pages state.
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const UA = "mzizi-docs-freshness (+https://github.com/mzizi-dev/mzizi-docs)";
const drift = [];
const warnings = [];
const unreachable = [];

function page(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

/** The first capture group of `re` in `path`, or a drift entry saying the shape moved. */
function stated(path, re, what) {
  const m = page(path).match(re);
  if (!m) {
    drift.push(`${path}: could not find ${what}; the page changed shape, update this script`);
    return undefined;
  }
  return m.slice(1);
}

async function get(url, { json = true, headers = {} } = {}) {
  const res = await fetch(url, { headers: { "user-agent": UA, ...headers } });
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
  return { body: json ? await res.json() : await res.text(), headers: res.headers };
}

function compare(what, docs, live) {
  if (docs === undefined) return;
  if (docs === live) console.log(`ok     ${what}: ${live}`);
  else drift.push(`${what}: the docs say ${docs}, the source says ${live}`);
}

async function check(name, fn) {
  try {
    await fn();
  } catch (e) {
    unreachable.push(`${name}: ${e.message}`);
  }
}

// npm: the three published toolchain packages.
const npm = [
  ["@nyuchi/mzizi-cli", "toolchain/cli.mdx", /latest published version\s+is `([0-9.]+)`/],
  ["@nyuchi/mzizi-mcp", "toolchain/mcp.mdx", /\(`([0-9.]+)`, read from npm/],
  ["@nyuchi/mzizi-skills", "toolchain/skills.mdx", /at version `([0-9.]+)` \(the latest on npm/],
];
for (const [pkg, path, re] of npm) {
  await check(pkg, async () => {
    const [docs] = stated(path, re, `the ${pkg} version`) ?? [];
    const { body } = await get(`https://registry.npmjs.org/${pkg}`);
    compare(`${pkg} (${path})`, docs, body["dist-tags"].latest);
  });
}

// crates.io: every crate the Roots page lists, at the version it states.
let cratesAllPublished = false;
await check("crates.io", async () => {
  const roots = page("roots/overview.mdx");
  const [version] = stated("roots/overview.mdx", /on crates\.io at `([0-9.]+)`/, "the crate version") ?? [];
  const table = roots.slice(roots.indexOf("## What exists today"), roots.indexOf("## Install"));
  const crates = [...table.matchAll(/^\| `(mzizi-[a-z-]+)`/gm)].map((m) => m[1]);
  if (crates.length === 0) drift.push("roots/overview.mdx: no crate table found");
  for (const crate of crates) {
    const { body } = await get(`https://crates.io/api/v1/crates/${crate}`);
    compare(`crates.io ${crate} (roots/overview.mdx)`, version, body.crate.max_version);
  }
  cratesAllPublished = crates.length > 0;
});

// While every Roots crate is on crates.io, no page may say one is not. This wording was true
// until 30 September 2026 and has come back in edits before; the live crates.io answer above
// is what makes it wrong, so the check only runs once that answer is in.
if (cratesAllPublished) {
  const notPublished =
    /not (yet )?(on|published (to|on)) crates\.io|crates? (is|are) (not|un)published|(until|while) (the|a|its) crates? (is|are) (un)?published/i;
  const pages = execFileSync("git", ["ls-files", "*.mdx", "*.md"], {
    encoding: "utf8",
    cwd: new URL("..", import.meta.url),
  })
    .split("\n")
    .filter(Boolean);
  const hits = pages.filter((path) => notPublished.test(page(path).replace(/\s+/g, " ")));
  if (hits.length > 0) drift.push(`a page says a Roots crate is not on crates.io, but all are: ${hits.join(", ")}`);
  else console.log(`ok     no page says a Roots crate is not on crates.io (${pages.length} pages)`);
}

// api.mzizi.dev /v1/rs: the first Roots batch is served, each naming the crate the page says.
await check("api.mzizi.dev /v1/rs", async () => {
  const roots = page("roots/overview.mdx");
  const batch = roots.slice(roots.indexOf("## The first batch"), roots.indexOf("**Each one carries a contract"));
  const [crate] = stated("roots/overview.mdx", /They ship in `(mzizi-[a-z-]+)`/, "the batch's crate") ?? [];
  const names = [...batch.matchAll(/`(mzizi-[a-z-]+)`/g)].map((m) => m[1]).filter((n) => n !== crate);
  if (names.length === 0) drift.push("roots/overview.mdx: no first-batch component list found");
  for (const name of names) {
    const { body } = await get(`https://api.mzizi.dev/v1/rs/${name}`);
    compare(`api.mzizi.dev /v1/rs/${name} crate (roots/overview.mdx)`, crate, body.crate?.name);
  }
});

// The language: test counts and the commit the status page was checked at.
await check("mzizi-dev/mzizi", async () => {
  const { body: readme } = await get(
    "https://raw.githubusercontent.com/mzizi-dev/mzizi/main/README.md",
    { json: false },
  );
  const live = readme.match(/\((\d+) tests in (\d+) suites/);
  if (!live) throw new Error("the language README no longer states its test count");
  const [liveTests, liveSuites] = live.slice(1);
  const status = stated("status.mdx", /\*\*(\d+) tests in\s+(\d+) suites\*\*/, "the test count");
  const compiler = stated("compiler.mdx", /(\d+) tests in (\d+)\s+suites at `/, "the test count");
  for (const [path, got] of [["status.mdx", status], ["compiler.mdx", compiler]]) {
    if (!got) continue;
    compare(`language tests (${path})`, got[0], liveTests);
    compare(`language suites (${path})`, got[1], liveSuites);
  }
  const lines = readme.match(/`compiler\/src` is ([\d,]+) lines/)?.[1];
  if (!lines) throw new Error("the language README no longer states compiler/src's line count");
  for (const [path, re] of [
    ["status.mdx", /The compiler source is ([\d,]+) lines/],
    ["compiler.mdx", /`compiler\/src` is ([\d,]+) lines/],
  ]) {
    const [docs] = stated(path, re, "the compiler's line count") ?? [];
    compare(`compiler/src lines (${path})`, docs, lines);
  }
  const [checkedAt] = stated("status.mdx", /mzizi-dev\/mzizi\) at `([0-9a-f]{7,40})`/, "the checked commit") ?? [];
  const sha = execFileSync("git", ["ls-remote", "https://github.com/mzizi-dev/mzizi", "refs/heads/main"], {
    encoding: "utf8",
  }).split(/\s/)[0];
  if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error("git ls-remote returned no commit for main");
  if (checkedAt && !sha.startsWith(checkedAt)) {
    warnings.push(
      `status.mdx was checked at ${checkedAt}; language main is now ${sha.slice(0, 7)}. ` +
        "Re-check the language pages against it.",
    );
  } else if (checkedAt) {
    console.log(`ok     language main (status.mdx): ${checkedAt}`);
  }
});

// The language's charter, tracker and benchmark arms, read from a shallow, blobless clone of
// main (anonymous git, so no API rate limit). The tracker is the one list of what Mzizi still
// needs (owner, 2026-09-30), and every capability claim on these pages comes from it.
await check("mzizi-dev/mzizi charter, tracker and arms", async () => {
  const dir = mkdtempSync(join(tmpdir(), "mzizi-lang-"));
  try {
    const git = (...args) => execFileSync("git", ["-C", dir, ...args], { encoding: "utf8" });
    execFileSync(
      "git",
      ["clone", "--quiet", "--depth", "1", "--filter=blob:none", "--no-checkout",
        "https://github.com/mzizi-dev/mzizi", dir],
      { encoding: "utf8" },
    );
    const show = (path) => git("show", `HEAD:${path}`);

    // The charter: charter.mdx names its version and title, and no page names another version.
    const charter = show("CHARTER.md");
    const version = charter.match(/Mzizi Research Charter, v(\d+\.\d+)/)?.[1];
    const title = charter.match(/^# (.+)$/m)?.[1].trim();
    if (!version || !title) throw new Error("CHARTER.md no longer states its version and title");
    const [docsVersion] = stated("charter.mdx", /\*\*Mzizi Research Charter, v(\d+\.\d+)\*\*/, "the charter version") ?? [];
    compare("charter version (charter.mdx)", docsVersion, version);
    if (!page("charter.mdx").includes(title)) drift.push(`charter.mdx: does not carry the charter's title, "${title}"`);
    const pages = execFileSync("git", ["ls-files", "*.mdx"], { encoding: "utf8", cwd: new URL("..", import.meta.url) })
      .split("\n")
      .filter(Boolean);
    const other = pages.filter((path) =>
      [...page(path).replace(/\s+/g, " ").matchAll(/\bcharter,? v(\d+\.\d+)\b/gi)].some((m) => m[1] !== version),
    );
    if (other.length > 0) drift.push(`a page names a charter version other than v${version}: ${other.join(", ")}`);
    else console.log(`ok     every page that names a charter version names v${version}`);

    // The tracker: tracker.mdx gives every row the mark LANGUAGE-TRACKER.md gives it.
    const tracker = show("LANGUAGE-TRACKER.md");
    const marks = new Map(
      [...tracker.matchAll(/^\|\s*([A-Z]\d+)\s*\|[^|]*\|\s*(✅|🟡|📝|❌)\s*\|/gm)].map((m) => [m[1], m[2]]),
    );
    if (marks.size === 0) throw new Error("LANGUAGE-TRACKER.md no longer has tier rows in the expected shape");
    const ours = [...page("tracker.mdx").matchAll(/^\|\s*([A-Z]\d+)\s*\|[^|]*\|\s*(✅|🟡|📝|❌)\s*\|/gm)];
    if (ours.length === 0) drift.push("tracker.mdx: no tier rows found; the page changed shape, update this script");
    for (const [, id, mark] of ours) compare(`tracker row ${id} (tracker.mdx)`, mark, marks.get(id) ?? "missing");
    const missing = [...marks.keys()].filter((id) => !ours.some((m) => m[1] === id));
    if (missing.length > 0) drift.push(`tracker.mdx: rows missing from the page: ${missing.join(", ")}`);
    // The sentence every capability page carries, while the rows it names are not done.
    const sentence = "no expressions, bindings, callable functions, loops, error handling, modules or standard library yet";
    const named = { C1: "expressions", C2: "bindings", C3: "callable functions", C4: "loops", C9: "error handling", P1: "modules", P2: "standard library" };
    const done = Object.entries(named).filter(([id]) => marks.get(id) === "✅").map(([, what]) => what);
    for (const path of ["index.mdx", "status.mdx", "tracker.mdx"]) {
      const says = page(path).replace(/\s+/g, " ").replace(/\*\*/g, "").includes(sentence);
      if (!says) drift.push(`${path}: does not say Mzizi has ${sentence}`);
      else if (done.length > 0) drift.push(`${path}: says Mzizi has none of these, but the tracker marks ${done.join(", ")} ✅`);
      else console.log(`ok     ${path} says what Mzizi does not have yet, as the tracker does`);
    }

    // The arms: benchmark.mdx says "Exists" for exactly the directories in benchmarks/arms/.
    const present = new Set(git("ls-tree", "--name-only", "HEAD", "benchmarks/arms/").split("\n").filter(Boolean).map((p) => p.split("/").pop()));
    if (present.size === 0) throw new Error("benchmarks/arms/ is empty or missing");
    const bench = page("benchmark.mdx");
    const table = bench.slice(bench.indexOf("## The arms"), bench.indexOf("## What it measures"));
    const rows = [...table.matchAll(/^\| `([a-z-]+)`\s*\|[^|]*\|[^|]*\|\s*([^|]+?)\s*\|$/gm)].map((m) => [m[1], m[2]]);
    if (rows.length === 0) drift.push("benchmark.mdx: no arms table found; the page changed shape, update this script");
    for (const [arm, state] of rows) {
      const exists = /^Exists/.test(state);
      compare(`arm ${arm} (benchmark.mdx)`, exists ? "exists" : "not added", present.has(arm) ? "exists" : "not added");
    }
    for (const arm of present) {
      if (!rows.some(([id]) => id === arm)) drift.push(`benchmark.mdx: the arm ${arm} is in benchmarks/arms/ but not in the table`);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// api.mzizi.dev and mcp.mzizi.dev: the registry commit each is built from. Neither pin is stated
// on a page as current any more: the gateway's moves by itself through an hourly bot pull
// request, so the pages say how to read it and quote dated examples only. What is checked is
// that the header still has the shape the gateway page documents, and, as warnings, that the
// gateway has caught up with registry main and that the MCP server is on the same commit.
let gatewayPin;
await check("api.mzizi.dev", async () => {
  const shape = "x-mzizi-source: mzizi-api-gateway; registry=<registry commit>";
  if (!page("platform/api-gateway.mdx").includes(shape)) {
    drift.push(`platform/api-gateway.mdx: could not find the header shape "${shape}"; update this script`);
  }
  const { headers } = await get("https://api.mzizi.dev/v1/health");
  const header = headers.get("x-mzizi-source") ?? "";
  gatewayPin = header.match(/^mzizi-api-gateway; registry=([0-9a-f]{12})$/)?.[1];
  if (!gatewayPin) {
    drift.push(`api.mzizi.dev x-mzizi-source is "${header}", not the shape platform/api-gateway.mdx documents`);
    return;
  }
  console.log(`ok     api.mzizi.dev x-mzizi-source has the documented shape: registry=${gatewayPin}`);
  const registryMain = execFileSync(
    "git",
    ["ls-remote", "https://github.com/mzizi-dev/mzizi-registry", "refs/heads/main"],
    { encoding: "utf8" },
  ).split(/\s/)[0];
  if (!/^[0-9a-f]{40}$/.test(registryMain)) throw new Error("git ls-remote returned no commit for registry main");
  if (!registryMain.startsWith(gatewayPin)) {
    warnings.push(
      `api.mzizi.dev is pinned at registry ${gatewayPin}; registry main is ${registryMain.slice(0, 12)}. ` +
        "The gateway's pin bot bumps it within the hour; check its bot/registry-pin pull request, which waits " +
          "for a person if a check fails.",
    );
  } else {
    console.log(`ok     api.mzizi.dev pin is registry main: ${gatewayPin}`);
  }
});

// mcp.mzizi.dev: the version it serves matches the version the MCP page states, and its pin.
await check("mcp.mzizi.dev", async () => {
  const [docs] = stated("toolchain/mcp.mdx", /\(`([0-9.]+)`, read from npm/, "the MCP version") ?? [];
  const { body } = await get("https://mcp.mzizi.dev/catalogue.json");
  compare("mcp.mzizi.dev served version (toolchain/mcp.mdx)", docs, body.version);
  const pin = String(body.source?.registry ?? "").match(/mzizi-registry\/tree\/([0-9a-f]{40})/)?.[1];
  if (!pin) throw new Error("catalogue.json no longer names its registry commit in source.registry");
  if (gatewayPin && !pin.startsWith(gatewayPin)) {
    warnings.push(
      `mcp.mzizi.dev is pinned at registry ${pin.slice(0, 12)}, api.mzizi.dev at ${gatewayPin}. ` +
        "The docs say both are built from the same registry content; check which one lags.",
    );
  } else if (gatewayPin) {
    console.log(`ok     mcp.mzizi.dev pin matches api.mzizi.dev: ${pin.slice(0, 12)}`);
  }
});

// The MCP Registry: the server name the MCP page gives, its latest entry active and at the
// version the page states.
await check("MCP Registry", async () => {
  const [name] = stated("toolchain/mcp.mdx", /it is\s+`(io\.github\.[^`]+)`/, "the MCP Registry name") ?? [];
  const [version] = stated("toolchain/mcp.mdx", /\(`([0-9.]+)`, read from npm/, "the MCP version") ?? [];
  if (!name) return;
  const { body } = await get(
    `https://registry.modelcontextprotocol.io/v0/servers?search=${encodeURIComponent(name)}`,
  );
  const official = (s) => s._meta?.["io.modelcontextprotocol.registry/official"];
  const entry = (body.servers ?? []).find((s) => s.server.name === name && official(s)?.isLatest);
  compare(`MCP Registry ${name} latest status (toolchain/mcp.mdx)`, "active", official(entry ?? {})?.status ?? "missing");
  compare(`MCP Registry ${name} latest version (toolchain/mcp.mdx)`, version, entry?.server.version ?? "missing");
});

for (const w of warnings) console.log(`::warning::${w}`);
for (const u of unreachable) console.log(`::error::unreachable, not checked: ${u}`);
for (const d of drift) console.log(`::error::drift: ${d}`);
if (drift.length > 0) process.exit(1);
if (unreachable.length > 0) process.exit(2);
console.log("Every checked fact matches its source.");
