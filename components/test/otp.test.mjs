import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

test("OTP contract is present and valid", () => {
  assert.ok(existsSync(resolve(root, "components/otp/contract.json")), "contract.json must exist");
  const contract = JSON.parse(read("components/otp/contract.json"));

  assert.equal(contract.contract.id, "fincore.otp");
  assert.equal(contract.contract.name, "OTP");
  assert.ok(Array.isArray(contract.tokens.dependencies));
  assert.equal(contract.tokens.dependencies.length, 27, "OTP contract specifies 27 tokens");

  // Every token dependency is in otp.* namespace
  for (const dep of contract.tokens.dependencies) {
    assert.ok(dep.name.startsWith("otp."), `${dep.name} is not in otp.* namespace`);
    assert.ok(dep.cssVar.startsWith("--fc-otp-"), `${dep.cssVar} is not in --fc-otp-* namespace`);
  }
});

test("OTP CSS consumes only --fc-otp-* variables", () => {
  assert.ok(existsSync(resolve(root, "components/otp/otp.css")), "otp.css must exist");
  const rawCss = read("components/otp/otp.css");
  const cleanCss = stripCssComments(rawCss);

  const tokenMatches = [...cleanCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((m) => m[1]);
  assert.ok(tokenMatches.length > 0, "otp.css should consume CSS variables");

  for (const variable of tokenMatches) {
    assert.ok(
      variable.startsWith("--fc-otp-"),
      `otp.css consumes non-otp variable: ${variable}`,
    );
  }
});

test("OTP native HTML reference uses expected classes and semantics", () => {
  assert.ok(existsSync(resolve(root, "components/otp/otp.html")), "otp.html reference must exist");
  const html = read("components/otp/otp.html");

  // Expected classes
  const expectedClasses = [
    "fc-otp",
    "fc-otp__label",
    "fc-otp__cells",
    "fc-otp__cell-wrapper",
    "fc-otp__cell",
    "fc-otp__message",
  ];

  for (const cls of expectedClasses) {
    assert.ok(html.includes(cls), `otp.html missing expected class: ${cls}`);
  }

  // Uses native single-character inputs
  assert.ok(html.includes('maxlength="1"'), 'otp.html must use maxlength="1" inputs');
});

