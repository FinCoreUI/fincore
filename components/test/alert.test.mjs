import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("Alert contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/alert/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/alert/contract.json"));

  assert.equal(contract.contract.id, "fincore.alert");
  assert.equal(contract.contract.name, "Alert");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 19, "Alert contract specifies 19 tokens");

  // Every token dependency is in alert.* namespace
  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("alert."), `${dep.name} is not in alert.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-alert-"), `${dep.cssVar} is not in --fc-alert-* namespace`);
  }
});

test("Alert CSS consumes only --fc-alert-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/alert/alert.css")), "alert.css must exist");
  const rawCss = read("components/alert/alert.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "alert.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-alert-"),
      `alert.css consumes non-alert variable: ${variable}`,
    );
  }
});

test("Alert native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/alert/alert.html")), "alert.html reference must exist");
  const html = read("components/alert/alert.html");

  const expectedClasses = [
    "fc-alert",
    "fc-alert__title",
    "fc-alert__message",
    "fc-alert--info",
    "fc-alert--success",
    "fc-alert--warning",
    "fc-alert--error",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `alert.html missing expected class: ${cls}`);
  }

  // Uses native ARIA role attributes
  assert.ok(html.includes('role="status"'), 'alert.html must include status role');
  assert.ok(html.includes('role="alert"'), 'alert.html must include alert role');
});

