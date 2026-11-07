import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("Drawer contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/drawer/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/drawer/contract.json"));

  assert.equal(contract.contract.id, "fincore.drawer");
  assert.equal(contract.contract.name, "Drawer");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 11, "Drawer contract specifies 11 tokens");

  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("drawer."), `${dep.name} is not in drawer.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-drawer-"), `${dep.cssVar} is not in --fc-drawer-* namespace`);
  }
});

test("Drawer CSS consumes only --fc-drawer-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/drawer/drawer.css")), "drawer.css must exist");
  const rawCss = read("components/drawer/drawer.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "drawer.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-drawer-"),
      `drawer.css consumes non-drawer variable: ${variable}`,
    );
  }
});

test("Drawer native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/drawer/drawer.html")), "drawer.html reference must exist");
  const html = read("components/drawer/drawer.html");

  const expectedClasses = [
    "fc-drawer",
    "fc-drawer-overlay",
    "fc-drawer-header",
    "fc-drawer-title",
    "fc-drawer-description",
    "fc-drawer-body",
    "fc-drawer-footer",
    "fc-drawer-close",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `drawer.html is missing reference to .${cls}`);
  }
});

test("Drawer React implementation and CLI artifacts exist", () => {
  assert.ok(existsSync(resolve(root, "react/drawer/index.tsx")), "react component must exist");
  assert.ok(existsSync(resolve(root, "cli/src/registry/drawer.js")), "cli registry entry must exist");
  assert.ok(existsSync(resolve(root, "cli/templates/components/drawer/index.tsx")), "cli component template must exist");
  assert.ok(existsSync(resolve(root, "cli/templates/styles/drawer.css")), "cli style template must exist");
});
