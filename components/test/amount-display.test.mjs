import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("AmountDisplay contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/amount-display/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/amount-display/contract.json"));

  assert.equal(contract.contract.id, "fincore.amount-display");
  assert.equal(contract.contract.name, "AmountDisplay");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 12, "AmountDisplay contract specifies 12 tokens");

  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("amount-display."), `${dep.name} is not in amount-display.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-amount-display-"), `${dep.cssVar} is not in --fc-amount-display-* namespace`);
  }
});

test("AmountDisplay CSS consumes only --fc-amount-display-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/amount-display/amount-display.css")), "amount-display.css must exist");
  const rawCss = read("components/amount-display/amount-display.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "amount-display.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-amount-display-"),
      `amount-display.css consumes non-amount-display variable: ${variable}`,
    );
  }
});

test("AmountDisplay native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/amount-display/amount-display.html")), "amount-display.html reference must exist");
  const html = read("components/amount-display/amount-display.html");

  const expectedClasses = [
    "fc-amount-display",
    "fc-amount-display-currency",
    "fc-amount-display-value",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `amount-display.html is missing reference to .${cls}`);
  }
});

test("AmountDisplay React implementation and CLI artifacts exist", () => {
  assert.ok(existsSync(resolve(root, "react/amount-display/index.tsx")), "react component must exist");
  assert.ok(existsSync(resolve(root, "cli/src/registry/amount-display.js")), "cli registry entry must exist");
  assert.ok(existsSync(resolve(root, "cli/templates/components/amount-display/index.tsx")), "cli component template must exist");
  assert.ok(existsSync(resolve(root, "cli/templates/styles/amount-display.css")), "cli style template must exist");
});

