import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("Table contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/table/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/table/contract.json"));

  assert.equal(contract.contract.id, "fincore.table");
  assert.equal(contract.contract.name, "Table");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 15, "Table contract specifies 15 tokens");

  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("table."), `${dep.name} is not in table.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-table-"), `${dep.cssVar} is not in --fc-table-* namespace`);
  }
});

test("Table CSS consumes only --fc-table-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/table/table.css")), "table.css must exist");
  const rawCss = read("components/table/table.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "table.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-table-"),
      `table.css consumes non-table variable: ${variable}`,
    );
  }
});

test("Table native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/table/table.html")), "table.html reference must exist");
  const html = read("components/table/table.html");

  const expectedClasses = [
    "fc-table-container",
    "fc-table",
    "fc-table__header",
    "fc-table__th",
    "fc-table__row",
    "fc-table__td",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `table.html missing expected class: ${cls}`);
  }

  assert.ok(html.includes("<table"), "table.html must use native table element");
  assert.ok(html.includes("<thead"), "table.html must use thead element");
  assert.ok(html.includes("<tbody"), "table.html must use tbody element");
});

