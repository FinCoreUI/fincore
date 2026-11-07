import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("TransactionItem contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/transaction-item/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/transaction-item/contract.json"));

  assert.equal(contract.contract.id, "fincore.transaction-item");
  assert.equal(contract.contract.name, "TransactionItem");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 15, "TransactionItem contract specifies 15 tokens");

  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("transaction-item."), `${dep.name} is not in transaction-item.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-transaction-item-"), `${dep.cssVar} is not in --fc-transaction-item-* namespace`);
  }
});

test("TransactionItem CSS consumes only --fc-transaction-item-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/transaction-item/transaction-item.css")), "transaction-item.css must exist");
  const rawCss = read("components/transaction-item/transaction-item.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "transaction-item.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-transaction-item-"),
      `transaction-item.css consumes non-transaction-item variable: ${variable}`,
    );
  }
});

test("TransactionItem native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/transaction-item/transaction-item.html")), "transaction-item.html reference must exist");
  const html = read("components/transaction-item/transaction-item.html");

  const expectedClasses = [
    "fc-transaction-item",
    "fc-transaction-item-lead",
    "fc-transaction-item-title",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `transaction-item.html is missing reference to .${cls}`);
  }
});

test("TransactionItem React implementation and CLI artifacts exist", () => {
  assert.ok(existsSync(resolve(root, "react/transaction-item/index.tsx")), "react component must exist");
  assert.ok(existsSync(resolve(root, "cli/src/registry/transaction-item.js")), "cli registry entry must exist");
  assert.ok(existsSync(resolve(root, "cli/templates/components/transaction-item/index.tsx")), "cli component template must exist");
  assert.ok(existsSync(resolve(root, "cli/templates/styles/transaction-item.css")), "cli style template must exist");
});

