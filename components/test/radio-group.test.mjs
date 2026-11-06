import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("Radio Group contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/radio-group/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/radio-group/contract.json"));

  assert.equal(contract.contract.id, "fincore.radio-group");
  assert.equal(contract.contract.name, "Radio Group");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 31, "Radio Group contract specifies 31 tokens");

  // Every token dependency is in radio-group.* namespace
  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("radio-group."), `${dep.name} is not in radio-group.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-radio-group-"), `${dep.cssVar} is not in --fc-radio-group-* namespace`);
  }
});

test("Radio Group CSS consumes only --fc-radio-group-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/radio-group/radio-group.css")), "radio-group.css must exist");
  const rawCss = read("components/radio-group/radio-group.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "radio-group.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-radio-group-"),
      `radio-group.css consumes non-radio-group variable: ${variable}`,
    );
  }
});

test("Radio Group native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/radio-group/radio-group.html")), "radio-group.html reference must exist");
  const html = read("components/radio-group/radio-group.html");

  // Expected classes
  const expectedClasses = [
    "fc-radio-group",
    "fc-radio-group__label",
    "fc-radio-group__items",
    "fc-radio-group__item",
    "fc-radio-group__control",
    "fc-radio-group__field",
    "fc-radio-group__circle",
    "fc-radio-group__dot",
    "fc-radio-group__item-label",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `radio-group.html missing expected class: ${cls}`);
  }

  // Uses fieldset and legend
  assert.ok(html.includes("<fieldset"), "radio-group.html must use <fieldset>");
  assert.ok(html.includes("<legend"), "radio-group.html must use <legend>");

  // Uses native <input type="radio">
  assert.ok(html.includes('type="radio"'), 'radio-group.html must use native type="radio"');

  // Uses label for association
  assert.ok(/<label[^>]+for="[^"]+"/.test(html), "radio-group.html must associate label via for attribute");
});

