import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("Checkbox contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/checkbox/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/checkbox/contract.json"));

  assert.equal(contract.contract.id, "fincore.checkbox");
  assert.equal(contract.contract.name, "Checkbox");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 27, "Checkbox contract specifies 27 tokens");

  // Every token dependency is in checkbox.* namespace
  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("checkbox."), `${dep.name} is not in checkbox.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-checkbox-"), `${dep.cssVar} is not in --fc-checkbox-* namespace`);
  }
});

test("Checkbox CSS consumes only --fc-checkbox-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/checkbox/checkbox.css")), "checkbox.css must exist");
  const rawCss = read("components/checkbox/checkbox.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "checkbox.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-checkbox-"),
      `checkbox.css consumes non-checkbox variable: ${variable}`,
    );
  }
});

test("Checkbox native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/checkbox/checkbox.html")), "checkbox.html reference must exist");
  const html = read("components/checkbox/checkbox.html");

  // Expected classes
  const expectedClasses = [
    "fc-checkbox",
    "fc-checkbox__body",
    "fc-checkbox__control",
    "fc-checkbox__field",
    "fc-checkbox__box",
    "fc-checkbox__icon",
    "fc-checkbox__label",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `checkbox.html missing expected class: ${cls}`);
  }

  // Uses native <input type="checkbox">
  assert.ok(html.includes('type="checkbox"'), 'checkbox.html must use native type="checkbox"');

  // Uses label for association
  assert.ok(/<label[^>]+for="[^"]+"/.test(html), "checkbox.html must associate label via for attribute");
});

