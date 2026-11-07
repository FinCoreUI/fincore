import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("StatusIndicator contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/status-indicator/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/status-indicator/contract.json"));

  assert.equal(contract.contract.id, "fincore.status-indicator");
  assert.equal(contract.contract.name, "StatusIndicator");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 12, "StatusIndicator contract specifies 12 tokens");

  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("status-indicator."), `${dep.name} is not in status-indicator.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-status-indicator-"), `${dep.cssVar} is not in --fc-status-indicator-* namespace`);
  }
});

test("StatusIndicator CSS consumes only --fc-status-indicator-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/status-indicator/status-indicator.css")), "status-indicator.css must exist");
  const rawCss = read("components/status-indicator/status-indicator.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "status-indicator.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-status-indicator-"),
      `status-indicator.css consumes non-status-indicator variable: ${variable}`,
    );
  }
});

test("StatusIndicator native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/status-indicator/status-indicator.html")), "status-indicator.html reference must exist");
  const html = read("components/status-indicator/status-indicator.html");

  const expectedClasses = [
    "fc-status-indicator",
    "fc-status-indicator-dot",
    "fc-status-indicator-label",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `status-indicator.html is missing reference to .${cls}`);
  }
});

test("StatusIndicator React implementation and CLI artifacts exist", () => {
  assert.ok(existsSync(resolve(root, "react/status-indicator/index.tsx")), "react component must exist");
  assert.ok(existsSync(resolve(root, "cli/src/registry/status-indicator.js")), "cli registry entry must exist");
  assert.ok(existsSync(resolve(root, "cli/templates/components/status-indicator/index.tsx")), "cli component template must exist");
  assert.ok(existsSync(resolve(root, "cli/templates/styles/status-indicator.css")), "cli style template must exist");
});

