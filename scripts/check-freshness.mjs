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
import { readFileSync } from "node:fs";

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

// api.mzizi.dev: the registry commit the gateway is built from.
await check("api.mzizi.dev", async () => {
  const [docs] =
    stated("platform/api-gateway.mdx", /x-mzizi-source: mzizi-api-gateway; registry=([0-9a-f]+)/, "the gateway pin") ?? [];
  const { headers } = await get("https://api.mzizi.dev/v1/health");
  const live = (headers.get("x-mzizi-source") ?? "").match(/registry=([0-9a-f]+)/)?.[1];
  compare("api.mzizi.dev registry pin (platform/api-gateway.mdx)", docs, live);
});

// The MCP Registry: the server name the MCP page gives, and that it is active.
await check("MCP Registry", async () => {
  const [name] = stated("toolchain/mcp.mdx", /it is\s+`(io\.github\.[^`]+)`/, "the MCP Registry name") ?? [];
  if (!name) return;
  const { body } = await get(
    `https://registry.modelcontextprotocol.io/v0/servers?search=${encodeURIComponent(name)}`,
  );
  const entry = (body.servers ?? []).find((s) => s.server.name === name);
  const status = entry?._meta?.["io.modelcontextprotocol.registry/official"]?.status;
  compare(`MCP Registry ${name} (toolchain/mcp.mdx)`, "active", status ?? "missing");
});

for (const w of warnings) console.log(`::warning::${w}`);
for (const u of unreachable) console.log(`::error::unreachable, not checked: ${u}`);
for (const d of drift) console.log(`::error::drift: ${d}`);
if (drift.length > 0) process.exit(1);
if (unreachable.length > 0) process.exit(2);
console.log("Every checked fact matches its source.");
