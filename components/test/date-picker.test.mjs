import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("DatePicker contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/date-picker/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/date-picker/contract.json"));

  assert.equal(contract.contract.id, "fincore.date-picker");
  assert.equal(contract.contract.name, "DatePicker");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 30, "DatePicker contract specifies 30 tokens");

  // Every token dependency is in date-picker.* namespace
  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("date-picker."), `${dep.name} is not in date-picker.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-date-picker-"), `${dep.cssVar} is not in --fc-date-picker-* namespace`);
  }
});

test("DatePicker CSS consumes only --fc-date-picker-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/date-picker/date-picker.css")), "date-picker.css must exist");
  const rawCss = read("components/date-picker/date-picker.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "date-picker.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-date-picker-"),
      `date-picker.css consumes non-date-picker variable: ${variable}`,
    );
  }
});

test("DatePicker native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/date-picker/date-picker.html")), "date-picker.html reference must exist");
  const html = read("components/date-picker/date-picker.html");

  // Expected classes
  const expectedClasses = [
    "fc-date-picker",
    "fc-date-picker__label",
    "fc-date-picker__control",
    "fc-date-picker__field",
    "fc-date-picker__message",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `date-picker.html missing expected class: ${cls}`);
  }

  // Uses native date input
  assert.ok(html.includes('type="date"'), 'date-picker.html must use native date input');
});

