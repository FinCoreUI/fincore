import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("BalanceCard contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/balance-card/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/balance-card/contract.json"));

  assert.equal(contract.contract.id, "fincore.balance-card");
  assert.equal(contract.contract.name, "BalanceCard");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 12, "BalanceCard contract specifies 12 tokens");

  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("balance-card."), `${dep.name} is not in balance-card.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-balance-card-"), `${dep.cssVar} is not in --fc-balance-card-* namespace`);
  }
});

test("BalanceCard CSS consumes only --fc-balance-card-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/balance-card/balance-card.css")), "balance-card.css must exist");
  const rawCss = read("components/balance-card/balance-card.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "balance-card.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-balance-card-"),
      `balance-card.css consumes non-balance-card variable: ${variable}`,
    );
  }
});

test("BalanceCard native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/balance-card/balance-card.html")), "balance-card.html reference must exist");
  const html = read("components/balance-card/balance-card.html");

  const expectedClasses = [
    "fc-balance-card",
    "fc-balance-card-header",
    "fc-balance-card-title",
    "fc-balance-card-amount",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `balance-card.html is missing reference to .${cls}`);
  }
});

test("BalanceCard React implementation and CLI artifacts exist", () => {
  assert.ok(existsSync(resolve(root, "react/balance-card/index.tsx")), "react component must exist");
  assert.ok(existsSync(resolve(root, "cli/src/registry/balance-card.js")), "cli registry entry must exist");
  assert.ok(existsSync(resolve(root, "cli/templates/components/balance-card/index.tsx")), "cli component template must exist");
  assert.ok(existsSync(resolve(root, "cli/templates/styles/balance-card.css")), "cli style template must exist");
});

