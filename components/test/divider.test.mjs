import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("Divider contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/divider/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/divider/contract.json"));

  assert.equal(contract.contract.id, "fincore.divider");
  assert.equal(contract.contract.name, "Divider");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 4, "Divider contract specifies 4 tokens");

  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("divider."), `${dep.name} is not in divider.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-divider-"), `${dep.cssVar} is not in --fc-divider-* namespace`);
  }
});

test("Divider CSS consumes only --fc-divider-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/divider/divider.css")), "divider.css must exist");
  const rawCss = read("components/divider/divider.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "divider.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-divider-"),
      `divider.css consumes non-divider variable: ${variable}`,
    );
  }
});

test("Divider native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/divider/divider.html")), "divider.html reference must exist");
  const html = read("components/divider/divider.html");

  const expectedClasses = [
    "fc-divider",
    "fc-divider--horizontal",
    "fc-divider--vertical",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `divider.html is missing reference to .${cls}`);
  }
});

test("Divider React implementation and CLI artifacts exist", () => {
  assert.ok(existsSync(resolve(root, "react/divider/index.tsx")), "react component must exist");
  assert.ok(existsSync(resolve(root, "cli/src/registry/divider.js")), "cli registry entry must exist");
  assert.ok(existsSync(resolve(root, "cli/templates/components/divider/index.tsx")), "cli component template must exist");
  assert.ok(existsSync(resolve(root, "cli/templates/styles/divider.css")), "cli style template must exist");
});
