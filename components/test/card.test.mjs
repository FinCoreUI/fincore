import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("Card contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/card/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/card/contract.json"));

  assert.equal(contract.contract.id, "fincore.card");
  assert.equal(contract.contract.name, "Card");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 15, "Card contract specifies 15 tokens");

  // Every token dependency is in card.* namespace
  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("card."), `${dep.name} is not in card.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-card-"), `${dep.cssVar} is not in --fc-card-* namespace`);
  }
});

test("Card CSS consumes only --fc-card-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/card/card.css")), "card.css must exist");
  const rawCss = read("components/card/card.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "card.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-card-"),
      `card.css consumes non-card variable: ${variable}`,
    );
  }
});

test("Card native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/card/card.html")), "card.html reference must exist");
  const html = read("components/card/card.html");

  const expectedClasses = [
    "fc-card",
    "fc-card__header",
    "fc-card__title",
    "fc-card__description",
    "fc-card__body",
    "fc-card__footer",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `card.html missing expected class: ${cls}`);
  }
});

