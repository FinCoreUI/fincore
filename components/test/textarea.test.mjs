import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("Textarea contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/textarea/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/textarea/contract.json"));

  assert.equal(contract.contract.id, "fincore.textarea");
  assert.equal(contract.contract.name, "Textarea");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 29, "Textarea contract specifies 29 tokens");

  // Every token dependency is in textarea.* namespace
  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("textarea."), `${dep.name} is not in textarea.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-textarea-"), `${dep.cssVar} is not in --fc-textarea-* namespace`);
  }
});

test("Textarea CSS consumes only --fc-textarea-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/textarea/textarea.css")), "textarea.css must exist");
  const rawCss = read("components/textarea/textarea.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "textarea.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-textarea-"),
      `textarea.css consumes non-textarea variable: ${variable}`,
    );
  }
});

test("Textarea native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/textarea/textarea.html")), "textarea.html reference must exist");
  const html = read("components/textarea/textarea.html");

  // Expected classes
  const expectedClasses = [
    "fc-textarea",
    "fc-textarea__label",
    "fc-textarea__control",
    "fc-textarea__field",
    "fc-textarea__message",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `textarea.html missing expected class: ${cls}`);
  }

  // Uses native <textarea>
  assert.ok(html.includes("<textarea"), "textarea.html must use native <textarea>");
  assert.ok(html.includes("</textarea>"), "textarea.html must close </textarea>");

  // Uses label for association
  assert.ok(/<label[^>]+for="[^"]+"/.test(html), "textarea.html must associate label via for attribute");
});

