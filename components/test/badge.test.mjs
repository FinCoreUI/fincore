import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("Badge contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/badge/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/badge/contract.json"));

  assert.equal(contract.contract.id, "fincore.badge");
  assert.equal(contract.contract.name, "Badge");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 16, "Badge contract specifies 16 tokens");

  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("badge."), `${dep.name} is not in badge.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-badge-"), `${dep.cssVar} is not in --fc-badge-* namespace`);
  }
});

test("Badge CSS consumes only --fc-badge-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/badge/badge.css")), "badge.css must exist");
  const rawCss = read("components/badge/badge.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "badge.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-badge-"),
      `badge.css consumes non-badge variable: ${variable}`,
    );
  }
});

test("Badge native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/badge/badge.html")), "badge.html reference must exist");
  const html = read("components/badge/badge.html");

  const expectedClasses = [
    "fc-badge",
    "fc-badge--default",
    "fc-badge--success",
    "fc-badge--warning",
    "fc-badge--error",
    "fc-badge--info",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `badge.html missing expected class: ${cls}`);
  }
});

