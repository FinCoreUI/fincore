import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("Tabs contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/tabs/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/tabs/contract.json"));

  assert.equal(contract.contract.id, "fincore.tabs");
  assert.equal(contract.contract.name, "Tabs");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 14, "Tabs contract specifies 14 tokens");

  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("tabs."), `${dep.name} is not in tabs.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-tabs-"), `${dep.cssVar} is not in --fc-tabs-* namespace`);
  }
});

test("Tabs CSS consumes only --fc-tabs-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/tabs/tabs.css")), "tabs.css must exist");
  const rawCss = read("components/tabs/tabs.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "tabs.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-tabs-"),
      `tabs.css consumes non-tabs variable: ${variable}`,
    );
  }
});

test("Tabs native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/tabs/tabs.html")), "tabs.html reference must exist");
  const html = read("components/tabs/tabs.html");

  const expectedClasses = [
    "fc-tabs",
    "fc-tabs__list",
    "fc-tabs__trigger",
    "fc-tabs__content",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `tabs.html missing expected class: ${cls}`);
  }

  assert.ok(html.includes('role="tablist"'), 'tabs.html must include tablist role');
  assert.ok(html.includes('role="tab"'), 'tabs.html must include tab role');
  assert.ok(html.includes('role="tabpanel"'), 'tabs.html must include tabpanel role');
});

