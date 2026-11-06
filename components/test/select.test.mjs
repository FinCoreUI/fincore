import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("Select contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/select/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/select/contract.json"));

  assert.equal(contract.contract.id, "fincore.select");
  assert.equal(contract.contract.name, "Select");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 27, "Select contract specifies 27 tokens");

  // Every token dependency is in select.* namespace
  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("select."), `${dep.name} is not in select.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-select-"), `${dep.cssVar} is not in --fc-select-* namespace`);
  }
});

test("Select CSS consumes only --fc-select-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/select/select.css")), "select.css must exist");
  const rawCss = read("components/select/select.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "select.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-select-"),
      `select.css consumes non-select variable: ${variable}`,
    );
  }
});

test("Select native HTML reference uses expected classes and associations", () => {
  assert.ok(existsSync(resolve(root, "components/select/select.html")), "select.html reference must exist");
  const html = read("components/select/select.html");

  // Expected classes
  const expectedClasses = [
    "fc-select",
    "fc-select__label",
    "fc-select__control",
    "fc-select__field",
    "fc-select__message",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `select.html missing expected class: ${cls}`);
  }

  // Uses native <select> element
  assert.ok(html.includes("<select"), "select.html must use native <select>");
  assert.ok(html.includes("</select>"), "select.html must close <select>");

  // Uses label for association
  assert.ok(/<label[^>]+for="[^"]+"/.test(html), "select.html must associate label via for attribute");
});

