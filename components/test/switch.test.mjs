import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("Switch contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/switch/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/switch/contract.json"));

  assert.equal(contract.contract.id, "fincore.switch");
  assert.equal(contract.contract.name, "Switch");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 18, "Switch contract specifies 18 tokens");

  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("switch."), `${dep.name} is not in switch.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-switch-"), `${dep.cssVar} is not in --fc-switch-* namespace`);
  }
});

test("Switch CSS consumes only --fc-switch-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/switch/switch.css")), "switch.css must exist");
  const rawCss = read("components/switch/switch.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "switch.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-switch-"),
      `switch.css consumes non-switch variable: ${variable}`,
    );
  }
});

test("Switch native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/switch/switch.html")), "switch.html reference must exist");
  const html = read("components/switch/switch.html");

  const expectedClasses = [
    "fc-switch-wrapper",
    "fc-switch",
    "fc-switch__thumb",
    "fc-switch__label",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `switch.html missing expected class: ${cls}`);
  }

  assert.ok(html.includes('role="switch"'), 'switch.html must use role="switch"');
  assert.ok(html.includes('aria-checked='), 'switch.html must use aria-checked');
});

