import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("Currency contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/currency/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/currency/contract.json"));

  assert.equal(contract.contract.id, "fincore.currency");
  assert.equal(contract.contract.name, "Currency");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 30, "Currency contract specifies 30 tokens");

  // Every token dependency is in currency.* namespace
  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("currency."), `${dep.name} is not in currency.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-currency-"), `${dep.cssVar} is not in --fc-currency-* namespace`);
  }
});

test("Currency CSS consumes only --fc-currency-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/currency/currency.css")), "currency.css must exist");
  const rawCss = read("components/currency/currency.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "currency.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-currency-"),
      `currency.css consumes non-currency variable: ${variable}`,
    );
  }
});

test("Currency native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/currency/currency.html")), "currency.html reference must exist");
  const html = read("components/currency/currency.html");

  // Expected classes
  const expectedClasses = [
    "fc-currency",
    "fc-currency__label",
    "fc-currency__control",
    "fc-currency__field",
    "fc-currency__prefix",
    "fc-currency__suffix",
    "fc-currency__message",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `currency.html missing expected class: ${cls}`);
  }

  // Uses inputMode decimal
  assert.ok(html.includes('inputmode="decimal"'), 'currency.html must specify inputmode="decimal"');
});

