import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("Inline contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/inline/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/inline/contract.json"));

  assert.equal(contract.contract.id, "fincore.inline");
  assert.equal(contract.contract.name, "Inline");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 5, "Inline contract specifies 5 tokens");

  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("inline."), `${dep.name} is not in inline.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-inline-"), `${dep.cssVar} is not in --fc-inline-* namespace`);
  }
});

test("Inline CSS consumes only --fc-inline-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/inline/inline.css")), "inline.css must exist");
  const rawCss = read("components/inline/inline.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "inline.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-inline-"),
      `inline.css consumes non-inline variable: ${variable}`,
    );
  }
});

test("Inline native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/inline/inline.html")), "inline.html reference must exist");
  const html = read("components/inline/inline.html");

  const expectedClasses = [
    "fc-inline",
    "fc-inline--gap-md",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `inline.html is missing reference to .${cls}`);
  }
});

test("Inline React implementation and CLI artifacts exist", () => {
  assert.ok(existsSync(resolve(root, "react/inline/index.tsx")), "react component must exist");
  assert.ok(existsSync(resolve(root, "cli/src/registry/inline.js")), "cli registry entry must exist");
  assert.ok(existsSync(resolve(root, "cli/templates/components/inline/index.tsx")), "cli component template must exist");
  assert.ok(existsSync(resolve(root, "cli/templates/styles/inline.css")), "cli style template must exist");
});

