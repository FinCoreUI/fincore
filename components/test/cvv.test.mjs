import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("CVV contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/cvv/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/cvv/contract.json"));

  assert.equal(contract.contract.id, "fincore.cvv");
  assert.equal(contract.contract.name, "CVV");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 29, "CVV contract specifies 29 tokens");

  // Every token dependency is in cvv.* namespace
  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("cvv."), `${dep.name} is not in cvv.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-cvv-"), `${dep.cssVar} is not in --fc-cvv-* namespace`);
  }
});

test("CVV CSS consumes only --fc-cvv-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/cvv/cvv.css")), "cvv.css must exist");
  const rawCss = read("components/cvv/cvv.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "cvv.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-cvv-"),
      `cvv.css consumes non-cvv variable: ${variable}`,
    );
  }
});

test("CVV native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/cvv/cvv.html")), "cvv.html reference must exist");
  const html = read("components/cvv/cvv.html");

  // Expected classes
  const expectedClasses = [
    "fc-cvv",
    "fc-cvv__label",
    "fc-cvv__control",
    "fc-cvv__field",
    "fc-cvv__message",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `cvv.html missing expected class: ${cls}`);
  }

  // Uses native masked input with max length and autocomplete
  assert.ok(html.includes('type="password"'), 'cvv.html must use password type');
  assert.ok(html.includes('maxlength="4"'), 'cvv.html must specify maxlength="4"');
  assert.ok(html.includes('autocomplete="cc-csc"'), 'cvv.html must specify autocomplete="cc-csc"');
});

