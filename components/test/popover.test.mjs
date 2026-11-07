import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("Popover contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/popover/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/popover/contract.json"));

  assert.equal(contract.contract.id, "fincore.popover");
  assert.equal(contract.contract.name, "Popover");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 8, "Popover contract specifies 8 tokens");

  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("popover."), `${dep.name} is not in popover.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-popover-"), `${dep.cssVar} is not in --fc-popover-* namespace`);
  }
});

test("Popover CSS consumes only --fc-popover-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/popover/popover.css")), "popover.css must exist");
  const rawCss = read("components/popover/popover.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "popover.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-popover-"),
      `popover.css consumes non-popover variable: ${variable}`,
    );
  }
});

test("Popover native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/popover/popover.html")), "popover.html reference must exist");
  const html = read("components/popover/popover.html");

  const expectedClasses = [
    "fc-popover",
    "fc-popover-arrow",
    "fc-popover-close",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `popover.html is missing reference to .${cls}`);
  }
});

test("Popover React implementation and CLI artifacts exist", () => {
  assert.ok(existsSync(resolve(root, "react/popover/index.tsx")), "react component must exist");
  assert.ok(existsSync(resolve(root, "cli/src/registry/popover.js")), "cli registry entry must exist");
  assert.ok(existsSync(resolve(root, "cli/templates/components/popover/index.tsx")), "cli component template must exist");
  assert.ok(existsSync(resolve(root, "cli/templates/styles/popover.css")), "cli style template must exist");
});
