import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

const read = (path) => readFileSync(resolve(root, path), "utf8");
const sha256 = (path) =>
  createHash("sha256").update(readFileSync(resolve(root, path))).digest("hex");
const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

const buttonContract = JSON.parse(read("components/button/contract.json"));
const inputContract = JSON.parse(read("components/input/contract.json"));
const tokenCss = read("tokens/dist/tokens.css");
const buttonCss = stripCssComments(read("components/button/button.css"));
const inputCss = stripCssComments(read("components/input/input.css"));
const buttonHtml = read("components/button/button.html");
const inputHtml = read("components/input/input.html");
const buttonReadme = read("components/button/README.md");
const inputReadme = read("components/input/README.md");
const implementationDoc = read("components/IMPLEMENTATION.md");

function parseCssVariables(css) {
  const rootBlock = css.split("/* Semantic tokens — dark theme overrides */")[0];
  const variables = new Map();
  const pattern = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let match;
  while ((match = pattern.exec(rootBlock)) !== null) {
    variables.set(match[1], match[2].trim());
  }
  return variables;
}

const tokenVariables = parseCssVariables(tokenCss);

function resolveToken(name, seen = new Set()) {
  assert.ok(tokenVariables.has(name), `missing token variable ${name}`);
  assert.ok(!seen.has(name), `cyclic token alias at ${name}`);
  seen.add(name);

  const value = tokenVariables.get(name);
  const alias = value.match(/^var\((--[a-z0-9-]+)\)$/i);
  return alias ? resolveToken(alias[1], seen) : value;
}

function usedVariables(css) {
  return new Set(
    [...css.matchAll(/var\((--[a-z0-9-]+)\)/gi)].map((match) => match[1]),
  );
}

function ruleBody(css, selector) {
  const selectorIndex = css.indexOf(selector);
  assert.notEqual(selectorIndex, -1, `missing selector ${selector}`);

  const open = css.indexOf("{", selectorIndex);
  assert.notEqual(open, -1, `missing block for ${selector}`);

  let depth = 0;
  for (let index = open; index < css.length; index += 1) {
    if (css[index] === "{") depth += 1;
    if (css[index] === "}") {
      depth -= 1;
      if (depth === 0) return css.slice(open + 1, index);
    }
  }

  assert.fail(`unclosed block for ${selector}`);
}

function assertBalancedBraces(css, label) {
  let depth = 0;
  for (const character of css) {
    if (character === "{") depth += 1;
    if (character === "}") depth -= 1;
    assert.ok(depth >= 0, `${label} has an unmatched closing brace`);
  }
  assert.equal(depth, 0, `${label} has unbalanced braces`);
}

function htmlClasses(html) {
  const classes = new Set();
  for (const match of html.matchAll(/\bclass="([^"]+)"/g)) {
    for (const className of match[1].split(/\s+/)) {
      if (className) classes.add(className);
    }
  }
  return classes;
}

function cssClasses(css) {
  return new Set(
    [...css.matchAll(/\.(fc-[a-z0-9_-]+)/gi)].map((match) => match[1]),
  );
}

function assertIdReferences(html, label) {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${label} has duplicate ids`);
  const idSet = new Set(ids);

  for (const match of html.matchAll(/\bfor="([^"]+)"/g)) {
    assert.ok(idSet.has(match[1]), `${label} label target ${match[1]} is missing`);
  }

  for (const match of html.matchAll(
    /\baria-(?:describedby|errormessage|labelledby)="([^"]+)"/g,
  )) {
    for (const id of match[1].split(/\s+/)) {
      assert.ok(idSet.has(id), `${label} ARIA reference ${id} is missing`);
    }
  }
}

function assertContractDependencies(contract, css, prefix) {
  const variables = usedVariables(css);

  for (const dependency of contract.tokens.dependencies) {
    assert.ok(
      dependency.cssVar.startsWith(prefix),
      `${dependency.name} uses ${dependency.cssVar}, outside ${prefix}`,
    );
    assert.ok(
      tokenVariables.has(dependency.cssVar),
      `${dependency.cssVar} is missing from tokens/dist/tokens.css`,
    );

    const resolved = resolveToken(dependency.cssVar);
    assert.equal(
      String(resolved).toLowerCase(),
      String(dependency.resolved).toLowerCase(),
      `${dependency.name} resolves to ${resolved}, contract says ${dependency.resolved}`,
    );

    assert.ok(
      variables.has(dependency.cssVar),
      `component CSS does not consume ${dependency.cssVar}`,
    );
  }

  for (const variable of variables) {
    assert.ok(
      variable.startsWith(prefix),
      `component CSS consumes non-component token ${variable}`,
    );
    assert.ok(
      tokenVariables.has(variable),
      `component CSS consumes unknown token ${variable}`,
    );
  }
}

test("protected token source, validator and generated CSS are unchanged", () => {
  const baseline = {
    "tokens/tokens.json":
      "4ba1e92192b1d77b8fe3a787a9a58b67e40f4211114c19754657c0a2da0cd795",
    "tokens/check.mjs":
      "bbe7d31dc394c70e1e3c867ccf3903524cc83b0e5c652b61e58e4f7e012f5559",
    "tokens/dist/tokens.css":
      "85e219bc1ae8dd8bd776a2934ff525b9ed6beac2a798d24671dd7eb61b595956",
  };

  for (const [file, expected] of Object.entries(baseline)) {
    assert.equal(sha256(file), expected, `${file} no longer matches the baseline`);
  }
});

test("contracts keep their approved variant and token counts", () => {
  assert.equal(buttonContract.variants.length, 15);
  assert.equal(buttonContract.tokens.dependencies.length, 32);
  assert.equal(inputContract.variants.length, 4);
  assert.equal(inputContract.tokens.dependencies.length, 38);

  assert.equal(
    buttonContract.properties.find((property) => property.name === "State")
      .production.prop,
    null,
    "Button must not expose a state prop",
  );
  assert.equal(
    inputContract.properties.find((property) => property.name === "State")
      .production.prop,
    null,
    "Input must not expose a state prop",
  );
});

test("Button consumes all 32 button.* tokens and no other token layer", () => {
  assertContractDependencies(buttonContract, buttonCss, "--fc-button-");
});

test("Input consumes all 38 input.* tokens and no other token layer", () => {
  assertContractDependencies(inputContract, inputCss, "--fc-input-");
});

test("Input focus radius still equals radius plus offset", () => {
  const px = (value) => Number.parseFloat(value);

  const radius = px(resolveToken("--fc-input-radius"));
  const offset = px(resolveToken("--fc-input-focus-offset"));
  const focusRadius = px(resolveToken("--fc-input-focus-radius"));

  assert.equal(focusRadius, radius + offset);
  assert.equal(focusRadius, 8);
});

test("component CSS contains no hardcoded colours or token-covered dimensions", () => {
  for (const [label, css] of [
    ["button.css", buttonCss],
    ["input.css", inputCss],
  ]) {
    assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i, `${label} contains a hex colour`);
    assert.doesNotMatch(
      css,
      /\b(?:rgb|rgba|hsl|hsla|oklch|lab|lch)\(/i,
      `${label} contains a colour function`,
    );
  }

  assert.doesNotMatch(buttonCss, /\b\d*\.?\d+px\b/i);

  const inputWithoutVisuallyHidden = inputCss.replace(
    /\.fc-input__label--visually-hidden\s*\{[^}]*\}/,
    "",
  );
  assert.doesNotMatch(inputWithoutVisuallyHidden, /\b\d*\.?\d+px\b/i);
});

test("component CSS does not define or invent token variables", () => {
  for (const [label, css] of [
    ["button.css", buttonCss],
    ["input.css", inputCss],
  ]) {
    assert.doesNotMatch(css, /--fc-[a-z0-9-]+\s*:/i, `${label} defines a token`);
    assert.doesNotMatch(css, /@import\b/i, `${label} imports external CSS`);
    assert.doesNotMatch(css, /url\(/i, `${label} references an external asset`);
    assertBalancedBraces(css, label);
  }

  assert.doesNotMatch(buttonCss, /--fc-button-ghost-background(?!-)/i);
  assert.doesNotMatch(buttonCss, /--fc-button-focus-radius/i);
  assert.doesNotMatch(buttonCss, /danger|success|loading|spinner|icon-only/i);

  assert.doesNotMatch(inputCss, /--fc-input-error-border/i);
  assert.doesNotMatch(inputCss, /--fc-input-border-focus/i);
  assert.doesNotMatch(inputCss, /--fc-input-success|--fc-input-warning/i);
  assert.doesNotMatch(inputCss, /--fc-input-readonly|--fc-input-icon/i);
  assert.doesNotMatch(inputCss, /success|warning|readonly|read-only/i);
});

test("Button CSS implements the contract geometry and variants", () => {
  const base = ruleBody(buttonCss, ".fc-button--primary");

  assert.match(base, /min-height:\s*var\(--fc-button-height\)/);
  assert.match(
    base,
    /padding-block:\s*calc\(\(var\(--fc-button-height\) - var\(--fc-button-line-height\)\) \/ 2\)/,
  );
  assert.match(base, /padding-inline:\s*var\(--fc-button-padding-x\)/);
  assert.match(base, /border:\s*0/);
  assert.match(base, /border-radius:\s*var\(--fc-button-radius\)/);
  assert.match(base, /background-color:\s*var\(--fc-button-primary-background\)/);
  assert.match(base, /color:\s*var\(--fc-button-primary-foreground\)/);
  assert.match(base, /font-size:\s*var\(--fc-button-font-size\)/);
  assert.match(base, /font-weight:\s*var\(--fc-button-font-weight\)/);
  assert.match(base, /line-height:\s*var\(--fc-button-line-height\)/);
  assert.match(base, /font-family:\s*inherit/);
  assert.match(base, /appearance:\s*none/);

  assert.match(
    ruleBody(buttonCss, ".fc-button:not(:disabled):hover"),
    /background-color:\s*var\(--fc-button-primary-background-hover\)/,
  );
  assert.match(
    ruleBody(buttonCss, ".fc-button:not(:disabled):active"),
    /background-color:\s*var\(--fc-button-primary-background-active\)/,
  );

  const secondary = ruleBody(buttonCss, ".fc-button--secondary");
  assert.match(secondary, /background-color:\s*var\(--fc-button-secondary-background\)/);
  assert.match(secondary, /color:\s*var\(--fc-button-secondary-foreground\)/);
  assert.match(
    ruleBody(buttonCss, ".fc-button--secondary:not(:disabled):hover"),
    /background-color:\s*var\(--fc-button-secondary-background-hover\)/,
  );
  assert.match(
    ruleBody(buttonCss, ".fc-button--secondary:not(:disabled):active"),
    /background-color:\s*var\(--fc-button-secondary-background-active\)/,
  );

  const ghost = ruleBody(buttonCss, ".fc-button--ghost");
  assert.match(ghost, /background-color:\s*transparent/);
  assert.match(ghost, /color:\s*var\(--fc-button-ghost-foreground\)/);
  assert.match(
    ruleBody(buttonCss, ".fc-button--ghost:not(:disabled):hover"),
    /background-color:\s*var\(--fc-button-ghost-background-hover\)/,
  );
  assert.match(
    ruleBody(buttonCss, ".fc-button--ghost:not(:disabled):active"),
    /background-color:\s*var\(--fc-button-ghost-background-active\)/,
  );

  assert.doesNotMatch(base, /(?:^|\s)height:/);
});

test("Button CSS keeps focus additive and suppressed when disabled", () => {
  const ring = ruleBody(buttonCss, ".fc-button::after");
  assert.match(ring, /inset:\s*calc\(-1 \* var\(--fc-button-focus-offset\)\)/);
  assert.match(
    ring,
    /border:\s*var\(--fc-button-focus-width\) solid transparent/,
  );
  assert.match(
    ring,
    /border-radius:\s*calc\(var\(--fc-button-radius\) \+ var\(--fc-button-focus-offset\)\)/,
  );
  assert.match(ring, /pointer-events:\s*none/);

  assert.match(
    ruleBody(buttonCss, ".fc-button:focus-visible"),
    /outline:\s*none/,
  );
  assert.match(
    ruleBody(buttonCss, ".fc-button:focus-visible::after"),
    /border-color:\s*var\(--fc-button-focus-color\)/,
  );

  const disabled = ruleBody(buttonCss, ".fc-button:disabled");
  assert.match(disabled, /background-color:\s*var\(--fc-button-disabled-background\)/);
  assert.match(disabled, /color:\s*var\(--fc-button-disabled-foreground\)/);
  assert.match(disabled, /cursor:\s*not-allowed/);
  assert.match(
    ruleBody(buttonCss, ".fc-button--ghost:disabled"),
    /background-color:\s*transparent/,
  );
  assert.match(
    ruleBody(buttonCss, ".fc-button:disabled::after"),
    /display:\s*none/,
  );

  assert.ok(
    buttonCss.indexOf(".fc-button:disabled {") >
      buttonCss.indexOf(".fc-button:not(:disabled):hover"),
    "disabled rules must come after hover rules",
  );
  assert.ok(
    buttonCss.indexOf(".fc-button:disabled {") >
      buttonCss.indexOf(".fc-button:not(:disabled):active"),
    "disabled rules must come after active rules",
  );

  assert.doesNotMatch(buttonCss, /\bstate\b|data-state|aria-pressed|role\s*=/i);
});

test("Button CSS retains a forced-colors boundary and focus indicator", () => {
  const forcedColors = ruleBody(buttonCss, "@media (forced-colors: active)");
  assert.match(forcedColors, /border:\s*var\(--fc-button-focus-width\) solid ButtonText/);
  assert.match(
    forcedColors,
    /outline:\s*var\(--fc-button-focus-width\) solid Highlight/,
  );
  assert.match(forcedColors, /outline-offset:\s*var\(--fc-button-focus-offset\)/);
  assert.match(forcedColors, /display:\s*none/);
});

test("Input CSS implements the full field anatomy and typography", () => {
  const field = ruleBody(inputCss, ".fc-input__field");

  assert.match(field, /width:\s*100%/);
  assert.match(field, /min-height:\s*var\(--fc-input-height\)/);
  assert.match(field, /padding-inline:\s*var\(--fc-input-padding-x\)/);
  assert.match(
    field,
    /border:\s*var\(--fc-input-border-width\) solid var\(--fc-input-border\)/,
  );
  assert.match(field, /border-radius:\s*var\(--fc-input-radius\)/);
  assert.match(field, /background-color:\s*var\(--fc-input-background\)/);
  assert.match(field, /color:\s*var\(--fc-input-text\)/);
  assert.match(field, /font-size:\s*var\(--fc-input-font-size\)/);
  assert.match(field, /font-weight:\s*var\(--fc-input-font-weight\)/);
  assert.match(field, /line-height:\s*var\(--fc-input-line-height\)/);
  assert.match(field, /font-family:\s*inherit/);
  assert.match(field, /appearance:\s*none/);
  assert.doesNotMatch(field, /(?:^|\s)height:\s*var\(--fc-input-height\)/);

  const label = ruleBody(inputCss, ".fc-input__label");
  assert.match(label, /margin-block-end:\s*var\(--fc-input-label-gap\)/);
  assert.match(label, /color:\s*var\(--fc-input-label-color\)/);
  assert.match(label, /font-size:\s*var\(--fc-input-font-size\)/);
  assert.match(label, /font-weight:\s*var\(--fc-input-label-font-weight\)/);
  assert.match(label, /line-height:\s*var\(--fc-input-line-height\)/);

  const helper = ruleBody(inputCss, ".fc-input__message");
  assert.match(helper, /margin-block-start:\s*var\(--fc-input-helper-gap\)/);
  assert.match(helper, /color:\s*var\(--fc-input-helper-color\)/);
  assert.match(helper, /font-size:\s*var\(--fc-input-helper-font-size\)/);
  assert.match(helper, /font-weight:\s*var\(--fc-input-font-weight\)/);
  assert.match(helper, /line-height:\s*var\(--fc-input-helper-line-height\)/);

  assert.match(
    ruleBody(inputCss, ".fc-input__message--error"),
    /color:\s*var\(--fc-input-text-error\)/,
  );
});

test("Input CSS applies Disabled > Error > Hover and derives the ring separately", () => {
  const hoverSelector = ".fc-input__field:not(:disabled):hover";
  const errorSelector = '.fc-input__field[aria-invalid="true"]:not(:disabled)';
  const disabledSelector = ".fc-input__field:disabled {";

  assert.match(
    ruleBody(inputCss, hoverSelector),
    /border-color:\s*var\(--fc-input-border-hover\)/,
  );
  assert.match(
    ruleBody(inputCss, errorSelector),
    /border-color:\s*var\(--fc-input-border-error\)/,
  );

  assert.ok(
    inputCss.indexOf(errorSelector) > inputCss.indexOf(hoverSelector),
    "Error must be declared after Hover",
  );
  assert.ok(
    inputCss.indexOf(disabledSelector) > inputCss.indexOf(errorSelector),
    "Disabled must be declared after Error",
  );

  const disabled = ruleBody(inputCss, ".fc-input__field:disabled");
  assert.match(disabled, /border-color:\s*var\(--fc-input-border-disabled\)/);
  assert.match(disabled, /background-color:\s*var\(--fc-input-background-disabled\)/);
  assert.match(disabled, /color:\s*var\(--fc-input-text-disabled\)/);
  assert.match(disabled, /cursor:\s*not-allowed/);

  assert.match(
    ruleBody(inputCss, ".fc-input__field::placeholder"),
    /color:\s*var\(--fc-input-placeholder\)[\s\S]*opacity:\s*1/,
  );
  assert.match(
    ruleBody(inputCss, ".fc-input__field:disabled::placeholder"),
    /color:\s*var\(--fc-input-text-disabled\)/,
  );

  const ring = ruleBody(inputCss, ".fc-input__control::after");
  assert.match(ring, /inset:\s*calc\(-1 \* var\(--fc-input-focus-offset\)\)/);
  assert.match(ring, /border:\s*var\(--fc-input-focus-width\) solid transparent/);
  assert.match(ring, /border-radius:\s*var\(--fc-input-focus-radius\)/);
  assert.match(ring, /pointer-events:\s*none/);

  assert.match(
    ruleBody(inputCss, ".fc-input__control:has(.fc-input__field:focus-visible)::after"),
    /border-color:\s*var\(--fc-input-focus-color\)/,
  );
  assert.doesNotMatch(inputCss, /:focus-within/);
  assert.match(
    ruleBody(inputCss, ".fc-input__field:focus"),
    /outline:\s*none/,
  );
  assert.match(
    ruleBody(inputCss, ".fc-input__control:has(.fc-input__field:disabled)::after"),
    /display:\s*none/,
  );

  assert.doesNotMatch(inputCss, /\bstate\b|data-state|aria-pressed|role\s*=/i);
});

test("Input CSS keeps the label visually hidden instead of removing it", () => {
  const hidden = ruleBody(inputCss, ".fc-input__label--visually-hidden");

  assert.match(hidden, /position:\s*absolute/);
  assert.match(hidden, /width:\s*1px/);
  assert.match(hidden, /height:\s*1px/);
  assert.match(hidden, /clip-path:\s*inset\(50%\)/);
  assert.doesNotMatch(hidden, /display:\s*none/);
  assert.doesNotMatch(hidden, /visibility:\s*hidden/);
  assert.doesNotMatch(hidden, /aria-hidden/);
});

test("Input CSS retains a forced-colors boundary and focus indicator", () => {
  const forcedColors = ruleBody(inputCss, "@media (forced-colors: active)");
  assert.match(forcedColors, /border-color:\s*ButtonText/);
  assert.match(forcedColors, /border-color:\s*Highlight/);
  assert.match(forcedColors, /display:\s*none/);
  assert.match(forcedColors, /display:\s*block/);
});

test("Button reference markup uses native buttons and native states", () => {
  assert.match(buttonHtml, /<button\b/);
  assert.doesNotMatch(buttonHtml, /<a\b/i);
  assert.doesNotMatch(buttonHtml, /role="button"/i);
  assert.doesNotMatch(buttonHtml, /aria-disabled/i);
  assert.doesNotMatch(buttonHtml, /aria-label=/i);
  assert.doesNotMatch(buttonHtml, /\bstate=|data-state/i);
  assert.doesNotMatch(buttonHtml, /danger|loading|spinner|icon/i);
  assert.doesNotMatch(buttonHtml, /\bstyle=/i);

  const buttons = [...buttonHtml.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)];
  assert.ok(buttons.length >= 3);

  for (const [, attributes, content] of buttons) {
    assert.match(attributes, /\btype="(?:button|submit|reset)"/, "every button needs an explicit type");
    assert.ok(content.replace(/<[^>]+>/g, "").trim().length > 0, "button label must not be empty");
  }

  const classes = htmlClasses(buttonHtml);
  for (const className of classes) {
    assert.match(buttonCss, new RegExp(`\\.${className}\\b`), `${className} has no CSS rule`);
  }

  for (const className of cssClasses(buttonCss)) {
    assert.ok(classes.has(className), `${className} is not shown in the reference markup`);
  }

  assertIdReferences(buttonHtml, "button.html");
});

test("Input reference markup keeps labels, errors and disabled semantics accessible", () => {
  assert.match(inputHtml, /<input\b/);
  assert.doesNotMatch(inputHtml, /role="textbox"/i);
  assert.doesNotMatch(inputHtml, /<textarea\b|<select\b/i);
  assert.doesNotMatch(inputHtml, /type="(?:password|search|hidden|file|checkbox|radio)"/i);
  assert.doesNotMatch(inputHtml, /readonly|read-only/i);
  assert.doesNotMatch(inputHtml, /aria-disabled/i);
  assert.doesNotMatch(inputHtml, /aria-label=/i);
  assert.doesNotMatch(inputHtml, /\bstate=|data-state/i);
  assert.doesNotMatch(inputHtml, /focused=|filled=|showplaceholder|showhelper/i);
  assert.doesNotMatch(inputHtml, /success|warning/i);
  assert.doesNotMatch(inputHtml, /\bstyle=/i);

  assertIdReferences(inputHtml, "input.html");

  const labels = [...inputHtml.matchAll(/<label\b[^>]*\bfor="([^"]+)"/g)].map(
    (match) => match[1],
  );
  const inputs = [...inputHtml.matchAll(/<input\b[^>]*>/g)].map((match) => match[0]);
  const inputIds = inputs.map((tag) => tag.match(/\bid="([^"]+)"/)?.[1]);

  assert.equal(new Set(inputIds).size, inputIds.length, "input ids must be unique");
  for (const id of inputIds) {
    assert.ok(labels.includes(id), `input ${id} has no label for association`);
  }

  const supportedTypes = new Set(["text", "email", "tel", "number", "url"]);
  for (const tag of inputs) {
    const type = tag.match(/\btype="([^"]+)"/)?.[1];
    assert.ok(supportedTypes.has(type), `unsupported input type ${type}`);
    assert.match(tag, /\bautocomplete="[^"]+"/, "every example supplies autocomplete");
    assert.match(tag, /\bname="[^"]+"/, "every example supplies a form name");

    if (/\bdisabled\b/.test(tag)) {
      assert.doesNotMatch(tag, /aria-invalid/, "disabled fields must not be aria-invalid");
    }
  }

  const errorInput = inputs.find((tag) => /\bid="amount"/.test(tag));
  assert.ok(errorInput, "error example is missing");
  assert.match(errorInput, /aria-invalid="true"/);
  assert.match(errorInput, /aria-describedby="amount-error"/);
  const errorMessageTag = inputHtml.match(
    /<p class="fc-input__message fc-input__message--error" id="amount-error"[^>]*>/,
  );
  assert.ok(errorMessageTag, "error message example is missing");
  assert.doesNotMatch(
    errorMessageTag[0],
    /role="alert"/,
    "static first-paint error example must not use role=alert",
  );
  assert.match(
    inputHtml,
    /application may add role="alert" when it inserts this message after validation/,
  );

  const hiddenLabel = inputHtml.match(
    /<label class="fc-input__label fc-input__label--visually-hidden" for="([^"]+)"/,
  );
  assert.ok(hiddenLabel, "hidden-label example must keep a label element");
  assert.match(inputHtml, new RegExp(`<input\\b[^>]*\\bid="${hiddenLabel[1]}"`));

  const classes = htmlClasses(inputHtml);
  for (const className of classes) {
    assert.match(inputCss, new RegExp(`\\.${className}\\b`), `${className} has no CSS rule`);
  }

  for (const className of cssClasses(inputCss)) {
    assert.ok(classes.has(className), `${className} is not shown in the reference markup`);
  }
});

test("repository documentation records the native API, browser baseline and Ghost/Focus correction", () => {
  assert.match(buttonContract.contract.maturity, /framework-agnostic CSS/);
  assert.match(inputContract.contract.maturity, /framework-agnostic CSS/);
  assert.doesNotMatch(buttonContract.contract.maturity, /production code does not/);
  assert.doesNotMatch(inputContract.contract.maturity, /production code does not/);

  const buttonEvidence = buttonContract.contract.canonical.evidence.join(" ");
  assert.match(buttonEvidence, /204\/204 bindings/);
  assert.match(buttonEvidence, /22 unique button\.\* tokens/);
  assert.match(buttonEvidence, /Stage 5C-1/);
  assert.doesNotMatch(buttonEvidence, /150\/150|23 unique|pending correction/);

  for (const contract of [buttonContract, inputContract]) {
    assert.ok(
      contract.aiGuidance.readOrder.some((entry) =>
        entry.includes("components/IMPLEMENTATION.md"),
      ),
      "contract read order must include the native implementation guide",
    );
  }

  const browserBaseline = inputContract.limitations.find(
    (limitation) => limitation.id === "browser-baseline",
  );
  assert.ok(browserBaseline, "Input contract must declare the browser baseline");
  assert.match(browserBaseline.limitation, /Chrome\/Edge 105\+/);
  assert.match(browserBaseline.limitation, /Safari 15\.4\+/);
  assert.match(browserBaseline.limitation, /Firefox 121\+/);
  assert.match(browserBaseline.limitation, /:has\(\)/);

  assert.match(buttonReadme, /### Native HTML\/CSS API/);
  assert.match(inputReadme, /### Native HTML\/CSS API/);
  assert.match(buttonReadme, /button\.ghost\.foreground/);
  assert.match(buttonReadme, /Ghost\/Focus corrected/);
  assert.match(buttonReadme, /corrected to that token in Stage 5C-1/);
  assert.doesNotMatch(buttonReadme, /pending Figma correction|still uses a Semantic token/);
  assert.match(inputReadme, /### Browser support/);
  assert.match(inputReadme, /Chrome \/ Edge \| 105\+/);
  assert.match(inputReadme, /Safari \| 15\.4\+/);
  assert.match(inputReadme, /Firefox \| 121\+/);
  assert.match(inputReadme, /UNVERIFIED/);

  assert.doesNotMatch(buttonReadme, /No production Button component exists/);
  assert.doesNotMatch(inputReadme, /No production Input component exists/);
  assert.match(implementationDoc, /### Browser baseline/);
  assert.match(implementationDoc, /no browser was run during Stage 5E/);
  assert.match(implementationDoc, /Stage 5C-1/);
  assert.match(implementationDoc, /FC-01 is resolved/);
  assert.match(implementationDoc, /VariableID:82:160/);
  assert.doesNotMatch(implementationDoc, /Ghost\/Focus label binding is pending Figma correction/);
});

test("contrast checker uses the Ghost surface and reports unique advisory pairs", () => {
  const result = spawnSync(process.execPath, ["tokens/check.mjs"], {
    cwd: root,
    encoding: "utf8",
  });

  assert.equal(
    result.status,
    0,
    `tokens/check.mjs failed\n${result.stdout}\n${result.stderr}`,
  );

  const lines = result.stdout.split(/\r?\n/);
  const ghostDisabled = lines.find((line) =>
    line.includes("ghost/disabled"),
  );
  assert.ok(ghostDisabled, "ghost/disabled contrast row is missing");
  assert.match(ghostDisabled, /color\.surface\.default/);
  assert.match(ghostDisabled, /2\.56:1/);
  assert.match(ghostDisabled, /EXEMPT/);
  assert.doesNotMatch(ghostDisabled, /button\.disabled\.background/);

  const inputInverse = lines.find((line) =>
    line.includes("input-error-text/inverse"),
  );
  assert.ok(
    inputInverse,
    "component-level input-error-text/inverse advisory is missing",
  );
  assert.match(inputInverse, /input\.text-error on color\.surface\.inverse/);

  const advisoryPairs = lines
    .filter((line) => /^\s+ADVISORY\s/.test(line))
    .map((line) => {
      const match = line.match(
        /^\s+ADVISORY\s+\S+\s+\S+\s+[\d.]+:1\s+≥[\d.]+\s+(\S+) on (\S+)/,
      );
      assert.ok(match, `could not parse advisory row: ${line}`);
      return `${match[1]} on ${match[2]}`;
    });

  assert.ok(advisoryPairs.length > 0, "no advisory rows were reported");
  assert.equal(
    new Set(advisoryPairs).size,
    advisoryPairs.length,
    `duplicate advisory pairs: ${advisoryPairs.join(", ")}`,
  );
});

test("browser smoke fixture covers the required cases and existing assets", () => {
  const fixture = read("components/test/browser-smoke.html");
  const runbook = read("components/test/BROWSER-TESTING.md");

  assert.match(fixture, /^<!doctype html>/i);
  assert.match(fixture, /\.\.\/\.\.\/tokens\/dist\/tokens\.css/);
  assert.match(fixture, /\.\.\/button\/button\.css/);
  assert.match(fixture, /\.\.\/input\/input\.css/);
  assert.match(fixture, /getComputedStyle/);
  assert.match(fixture, /window\.__fincoreBrowserSmoke/);

  for (const id of [
    "btn-primary",
    "btn-secondary",
    "btn-ghost",
    "btn-disabled-primary",
    "btn-disabled-secondary",
    "btn-disabled-ghost",
    "input-default",
    "input-disabled",
    "input-error",
    "input-hidden-label",
  ]) {
    assert.match(fixture, new RegExp(`id="${id}"`), `missing fixture case ${id}`);
  }

  assert.match(fixture, /aria-describedby="input-default-helper"/);
  assert.match(fixture, /aria-describedby="input-disabled-helper"/);
  assert.match(fixture, /aria-describedby="input-error-message"/);
  assert.match(fixture, /fc-input__label--visually-hidden/);
  assert.match(fixture, /application may add role="alert"/);

  assert.match(runbook, /python3 -m http\.server 8765/);
  assert.match(runbook, /components\/test\/browser-smoke\.html/);
  assert.match(runbook, /Chrome \/ Edge \| 105\+/);
  assert.match(runbook, /Safari \| 15\.4\+/);
  assert.match(runbook, /Firefox \| 121\+/);
  assert.match(runbook, /UNVERIFIED/);
});

test("existing contract and token validators still pass", () => {
  for (const script of ["components/validate-contracts.mjs", "tokens/check.mjs"]) {
    const result = spawnSync(process.execPath, [script], {
      cwd: root,
      encoding: "utf8",
    });

    assert.equal(
      result.status,
      0,
      `${script} failed\n${result.stdout}\n${result.stderr}`,
    );
  }
});
