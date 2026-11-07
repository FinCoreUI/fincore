import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("Tooltip contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/tooltip/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/tooltip/contract.json"));

  assert.equal(contract.contract.id, "fincore.tooltip");
  assert.equal(contract.contract.name, "Tooltip");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 8, "Tooltip contract specifies 8 tokens");

  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("tooltip."), `${dep.name} is not in tooltip.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-tooltip-"), `${dep.cssVar} is not in --fc-tooltip-* namespace`);
  }
});

test("Tooltip CSS consumes only --fc-tooltip-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/tooltip/tooltip.css")), "tooltip.css must exist");
  const rawCss = read("components/tooltip/tooltip.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "tooltip.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-tooltip-"),
      `tooltip.css consumes non-tooltip variable: ${variable}`,
    );
  }
});

test("Tooltip native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/tooltip/tooltip.html")), "tooltip.html reference must exist");
  const html = read("components/tooltip/tooltip.html");

  const expectedClasses = [
    "fc-tooltip",
    "fc-tooltip-arrow",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `tooltip.html is missing reference to .${cls}`);
  }
});

test("Tooltip React implementation and CLI artifacts exist", () => {
  assert.ok(existsSync(resolve(root, "react/tooltip/index.tsx")), "react component must exist");
  assert.ok(existsSync(resolve(root, "cli/src/registry/tooltip.js")), "cli registry entry must exist");
  assert.ok(existsSync(resolve(root, "cli/templates/components/tooltip/index.tsx")), "cli component template must exist");
  assert.ok(existsSync(resolve(root, "cli/templates/styles/tooltip.css")), "cli style template must exist");
});
