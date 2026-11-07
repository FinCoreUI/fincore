import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("Stack contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/stack/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/stack/contract.json"));

  assert.equal(contract.contract.id, "fincore.stack");
  assert.equal(contract.contract.name, "Stack");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 5, "Stack contract specifies 5 tokens");

  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("stack."), `${dep.name} is not in stack.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-stack-"), `${dep.cssVar} is not in --fc-stack-* namespace`);
  }
});

test("Stack CSS consumes only --fc-stack-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/stack/stack.css")), "stack.css must exist");
  const rawCss = read("components/stack/stack.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "stack.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-stack-"),
      `stack.css consumes non-stack variable: ${variable}`,
    );
  }
});

test("Stack native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/stack/stack.html")), "stack.html reference must exist");
  const html = read("components/stack/stack.html");

  const expectedClasses = [
    "fc-stack",
    "fc-stack--gap-md",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `stack.html is missing reference to .${cls}`);
  }
});

test("Stack React implementation and CLI artifacts exist", () => {
  assert.ok(existsSync(resolve(root, "react/stack/index.tsx")), "react component must exist");
  assert.ok(existsSync(resolve(root, "cli/src/registry/stack.js")), "cli registry entry must exist");
  assert.ok(existsSync(resolve(root, "cli/templates/components/stack/index.tsx")), "cli component template must exist");
  assert.ok(existsSync(resolve(root, "cli/templates/styles/stack.css")), "cli style template must exist");
});

