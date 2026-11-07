import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("Container contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/container/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/container/contract.json"));

  assert.equal(contract.contract.id, "fincore.container");
  assert.equal(contract.contract.name, "Container");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 3, "Container contract specifies 3 tokens");

  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("container."), `${dep.name} is not in container.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-container-"), `${dep.cssVar} is not in --fc-container-* namespace`);
  }
});

test("Container CSS consumes only --fc-container-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/container/container.css")), "container.css must exist");
  const rawCss = read("components/container/container.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "container.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-container-"),
      `container.css consumes non-container variable: ${variable}`,
    );
  }
});

test("Container native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/container/container.html")), "container.html reference must exist");
  const html = read("components/container/container.html");

  const expectedClasses = [
    "fc-container",
    "fc-container--md",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `container.html is missing reference to .${cls}`);
  }
});

test("Container React implementation and CLI artifacts exist", () => {
  assert.ok(existsSync(resolve(root, "react/container/index.tsx")), "react component must exist");
  assert.ok(existsSync(resolve(root, "cli/src/registry/container.js")), "cli registry entry must exist");
  assert.ok(existsSync(resolve(root, "cli/templates/components/container/index.tsx")), "cli component template must exist");
  assert.ok(existsSync(resolve(root, "cli/templates/styles/container.css")), "cli style template must exist");
});

