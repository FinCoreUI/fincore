#!/usr/bin/env node
/*
 * Zero-dependency compliance checker for the FinCore transaction-history PoC.
 *
 * It reads the five PoC files plus the generated token/component CSS and fails
 * with a non-zero exit code when the PoC breaks a documented FinCore usage rule.
 * It never writes or regenerates anything.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const POC_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(POC_DIR, "..", "..");

const EXPECTED_FILES = [
  "index.html",
  "poc.css",
  "poc.js",
  "check.mjs",
  "README.md",
];

const results = [];

function check(label, run) {
  try {
    const detail = run();
    results.push({ label, pass: true, detail: detail ?? "" });
  } catch (error) {
    results.push({ label, pass: false, detail: error.message });
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readPoc(name) {
  return readFileSync(join(POC_DIR, name), "utf8");
}

function stripHtmlComments(text) {
  return text.replace(/<!--[\s\S]*?-->/g, "");
}

function stripCssComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, "");
}

function stripJsComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function parseTags(html) {
  return [...stripHtmlComments(html).matchAll(/<([a-z][a-z0-9-]*)\b([^>]*)>/gi)].map(
    (match) => ({
      name: match[1].toLowerCase(),
      attrs: match[2],
      raw: match[0],
    }),
  );
}

function attr(tag, name) {
  const match = tag.attrs.match(
    new RegExp(`(?:^|\\s)${name}\\s*=\\s*"([^"]*)"`, "i"),
  );
  return match ? match[1] : null;
}

function hasAttr(tag, name) {
  return new RegExp(`(?:^|\\s)${name}(?:\\s*=\\s*"[^"]*")?(?=\\s|$)`, "i").test(
    tag.attrs,
  );
}

function classList(tag) {
  const value = attr(tag, "class");
  return value ? value.split(/\s+/).filter(Boolean) : [];
}

function attrNames(tag) {
  return [...tag.attrs.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=/g)].map(
    (match) => match[1],
  );
}

const html = readPoc("index.html");
const css = readPoc("poc.css");
const js = readPoc("poc.js");
const readme = readPoc("README.md");

const htmlNoComments = stripHtmlComments(html);
const cssNoComments = stripCssComments(css);
const jsNoComments = stripJsComments(js);
const tags = parseTags(html);

const tokenCss = readFileSync(join(ROOT, "tokens", "dist", "tokens.css"), "utf8");
const definedTokens = new Set(
  [...tokenCss.matchAll(/(--fc-[a-z0-9-]+)\s*:/g)].map((match) => match[1]),
);

const componentCss =
  readFileSync(join(ROOT, "components", "button", "button.css"), "utf8") +
  "\n" +
  readFileSync(join(ROOT, "components", "input", "input.css"), "utf8");
const definedComponentClasses = new Set(
  [...componentCss.matchAll(/\.(fc-[a-z0-9_-]+)/gi)].map((match) => match[1]),
);

// ---------------------------------------------------------------------------
// 1. Files
// ---------------------------------------------------------------------------

check("files: five authorised files exist", () => {
  const missing = EXPECTED_FILES.filter(
    (name) => !existsSync(join(POC_DIR, name)),
  );
  assert(missing.length === 0, `missing files: ${missing.join(", ")}`);
  return EXPECTED_FILES.join(", ");
});

// ---------------------------------------------------------------------------
// 2-5. Stylesheet rules
// ---------------------------------------------------------------------------

check("css: every referenced --fc-* token exists in tokens.css", () => {
  const used = new Set(
    [...cssNoComments.matchAll(/var\(\s*(--fc-[a-z0-9-]+)/g)].map(
      (match) => match[1],
    ),
  );
  assert(used.size > 0, "no --fc-* tokens are used");
  const unknown = [...used].filter((token) => !definedTokens.has(token));
  assert(
    unknown.length === 0,
    `tokens not present in tokens/dist/tokens.css: ${unknown.join(", ")}`,
  );
  return `${used.size} tokens resolved`;
});

check("css: no local --fc-* token definitions", () => {
  const definitions = [...cssNoComments.matchAll(/(^|[\s;{])--fc-[a-z0-9-]+\s*:/gm)];
  assert(
    definitions.length === 0,
    `poc.css defines ${definitions.length} local --fc-* token(s)`,
  );
  assert(
    !/<style\b/i.test(htmlNoComments),
    "index.html must not contain a <style> block",
  );
  return "no local token definitions";
});

check("css: no hardcoded colour literals", () => {
  const hex = [...cssNoComments.matchAll(/#[0-9a-f]{3,8}\b/gi)].map(
    (match) => match[0],
  );
  const functions = [
    ...cssNoComments.matchAll(/\b(?:rgb|rgba|hsl|hsla|oklch|oklab|lab|lch)\(/gi),
  ].map((match) => match[0]);
  assert(
    hex.length === 0 && functions.length === 0,
    `colour literals found: ${[...hex, ...functions].join(", ")}`,
  );
  return "all colours come from tokens";
});

check("css: no component selectors or state overrides", () => {
  const componentSelectors = [
    ...cssNoComments.matchAll(/\.fc-[a-z0-9_-]+/gi),
  ].map((match) => match[0]);
  assert(
    componentSelectors.length === 0,
    `poc.css selects FinCore classes: ${componentSelectors.join(", ")}`,
  );
  assert(
    !/@import\b/i.test(cssNoComments),
    "poc.css must not use @import",
  );
  assert(!/url\(/i.test(cssNoComments), "poc.css must not load external assets");
  return "component CSS is untouched";
});

// ---------------------------------------------------------------------------
// 6-17. Markup rules
// ---------------------------------------------------------------------------

check("html: documented FinCore classes only", () => {
  const used = [...new Set(tags.flatMap(classList))].filter((name) =>
    name.startsWith("fc-"),
  );
  assert(used.length > 0, "no FinCore component classes are used");
  const unknown = used.filter((name) => !definedComponentClasses.has(name));
  assert(
    unknown.length === 0,
    `undocumented FinCore classes: ${unknown.join(", ")}`,
  );
  return used.join(", ");
});

check("html: no contract-shaped props as fake native APIs", () => {
  const forbidden = new Set([
    "variant",
    "label",
    "helperText",
    "errorMessage",
    "onClick",
    "className",
    "state",
    "focused",
    "filled",
    "showPlaceholder",
    "showHelper",
    "hideLabel",
  ]);
  const found = [];
  for (const tag of tags) {
    for (const name of attrNames(tag)) {
      if (forbidden.has(name)) found.push(`${tag.name}[${name}]`);
    }
  }
  assert(found.length === 0, `contract props used as HTML attributes: ${found.join(", ")}`);
  return "native class/attribute API only";
});

check("html: explicit button types and one primary action", () => {
  const buttons = tags.filter((tag) => tag.name === "button");
  assert(buttons.length >= 2, `expected at least 2 buttons, found ${buttons.length}`);
  for (const button of buttons) {
    const type = attr(button, "type");
    assert(
      type === "button" || type === "submit" || type === "reset",
      `button without an explicit valid type: ${button.raw}`,
    );
    assert(!hasAttr(button, "disabled"), `button must not be disabled: ${button.raw}`);
  }
  const primaries = buttons.filter((button) => {
    const classes = classList(button);
    return (
      classes.includes("fc-button") &&
      !classes.includes("fc-button--secondary") &&
      !classes.includes("fc-button--ghost")
    );
  });
  assert(primaries.length === 1, `expected exactly one primary action, found ${primaries.length}`);
  assert(attr(primaries[0], "type") === "submit", "the primary action must submit the filter form");
  const secondaries = buttons.filter((button) =>
    classList(button).includes("fc-button--secondary"),
  );
  assert(secondaries.length === 1, "expected exactly one secondary action");
  assert(attr(secondaries[0], "type") === "button", "the secondary Clear action must be type=button");
  assert(
    !buttons.some((button) => classList(button).includes("fc-button--ghost")),
    "Ghost is intentionally omitted from this interface",
  );
  return "1 primary (submit), 1 secondary (button), no disabled or ghost actions";
});

check("html: filter input has an id and an associated label", () => {
  const inputs = tags.filter((tag) => tag.name === "input");
  assert(inputs.length === 1, `expected exactly one input, found ${inputs.length}`);
  const field = inputs[0];
  const id = attr(field, "id");
  assert(id, "the filter input has no id");
  assert(classList(field).includes("fc-input__field"), "the filter input is missing fc-input__field");
  assert(attr(field, "type") === "text", "the filter must be a text input");
  assert(attr(field, "name") === "filter", "the filter input needs name=\"filter\"");
  assert(attr(field, "autocomplete") === "off", "the filter input needs autocomplete=\"off\"");
  assert(!hasAttr(field, "disabled"), "the filter input must not be disabled");
  const labels = tags.filter(
    (tag) =>
      tag.name === "label" &&
      attr(tag, "for") === id &&
      classList(tag).includes("fc-input__label"),
  );
  assert(labels.length === 1, `no fc-input__label with for="${id}"`);
  return `label[for="${id}"] → input#${id}`;
});

check("html: aria-describedby references resolve", () => {
  const ids = new Map(
    tags.filter((tag) => attr(tag, "id")).map((tag) => [attr(tag, "id"), tag]),
  );
  const references = tags.filter((tag) => attr(tag, "aria-describedby"));
  assert(references.length > 0, "no aria-describedby reference is present");
  for (const tag of references) {
    for (const id of attr(tag, "aria-describedby").split(/\s+/).filter(Boolean)) {
      assert(ids.has(id), `aria-describedby="${id}" does not resolve`);
    }
  }
  const field = tags.find((tag) => attr(tag, "id") === "tx-filter");
  const helper = ids.get(attr(field, "aria-describedby"));
  assert(
    helper && classList(helper).includes("fc-input__message"),
    "the filter helper is not a fc-input__message",
  );
  return references
    .map((tag) => `${attr(tag, "id")} → ${attr(tag, "aria-describedby")}`)
    .join(", ");
});

check("html: no role=alert or assertive live region", () => {
  assert(
    !tags.some((tag) => attr(tag, "role") === "alert"),
    "static markup must not use role=\"alert\"",
  );
  assert(
    !tags.some((tag) => (attr(tag, "aria-live") || "").toLowerCase() === "assertive"),
    "the PoC must not use an assertive live region",
  );
  return "polite status only";
});

check("html: asset paths are local and resolve", () => {
  const links = tags.filter(
    (tag) =>
      tag.name === "link" &&
      (attr(tag, "rel") || "").toLowerCase().split(/\s+/).includes("stylesheet"),
  );
  const hrefs = links.map((tag) => attr(tag, "href"));
  const expected = [
    "../../tokens/dist/tokens.css",
    "../../components/button/button.css",
    "../../components/input/input.css",
    "poc.css",
  ];
  assert(
    hrefs.length === expected.length &&
      expected.every((href, index) => hrefs[index] === href),
    `stylesheet order/paths differ from the documented set: ${hrefs.join(", ")}`,
  );
  for (const href of hrefs) {
    assert(!/^(?:[a-z]+:)?\/\//i.test(href), `external stylesheet: ${href}`);
    assert(existsSync(resolve(POC_DIR, href)), `stylesheet does not resolve: ${href}`);
  }
  const scripts = tags.filter((tag) => tag.name === "script");
  assert(scripts.length === 1, `expected exactly one script, found ${scripts.length}`);
  const src = attr(scripts[0], "src");
  assert(src === "poc.js", `unexpected script src: ${src}`);
  assert(existsSync(resolve(POC_DIR, src)), `script does not resolve: ${src}`);
  assert(
    !/<script\b(?![^>]*\bsrc=)[^>]*>/i.test(htmlNoComments),
    "inline scripts are not allowed",
  );
  return "4 local stylesheets and poc.js resolve";
});

check("html: no unsupported input types or disabled actions", () => {
  const inputs = tags.filter((tag) => tag.name === "input");
  for (const field of inputs) {
    const type = (attr(field, "type") || "text").toLowerCase();
    assert(type !== "search", "type=\"search\" is out of contract scope");
    assert(type !== "password", "type=\"password\" is out of contract scope");
    assert(
      ["text", "email", "tel", "number", "url"].includes(type),
      `unsupported input type: ${type}`,
    );
  }
  assert(
    !tags.some((tag) => hasAttr(tag, "disabled")),
    "no control should be disabled in this interface",
  );
  assert(!/type\s*=\s*"search"/i.test(htmlNoComments), "type=\"search\" found");
  return "text input only, no disabled controls";
});

check("html: no inverse surface", () => {
  assert(
    !/surface-inverse/i.test(htmlNoComments) && !/surface-inverse/i.test(cssNoComments),
    "inverse surfaces are unsupported",
  );
  return "supported light surfaces only";
});

check("html: semantic table structure", () => {
  const names = tags.map((tag) => tag.name);
  for (const required of ["table", "caption", "thead", "tbody"]) {
    assert(names.includes(required), `missing <${required}>`);
  }
  const headers = tags.filter(
    (tag) => tag.name === "th" && attr(tag, "scope") === "col",
  );
  assert(headers.length >= 5, `expected 5 column headers, found ${headers.length}`);
  const tbody = tags.find((tag) => tag.name === "tbody");
  assert(attr(tbody, "id") === "tx-rows", "tbody must expose id=\"tx-rows\"");
  const caption = tags.find((tag) => tag.name === "caption");
  assert(
    caption && stripHtmlComments(html).includes("Transactions, most recent first."),
    "the table caption text is missing",
  );
  return "table + caption + 5 scoped column headers";
});

check("html: mobile transaction list is present and named", () => {
  const list = tags.find(
    (tag) => tag.name === "ul" && attr(tag, "id") === "tx-list",
  );
  assert(list, "missing <ul id=\"tx-list\">");
  assert(
    classList(list).includes("tx-list"),
    "the mobile list needs class=\"tx-list\"",
  );
  assert(
    hasAttr(list, "hidden"),
    "the mobile list must start hidden until it is rendered",
  );

  const labelledBy = attr(list, "aria-labelledby");
  const label = attr(list, "aria-label");
  const labelResolves =
    labelledBy && tags.some((tag) => attr(tag, "id") === labelledBy);
  assert(
    labelResolves || (label && label.trim()),
    "the mobile list needs aria-labelledby pointing at an existing element or a non-empty aria-label",
  );

  return `ul#tx-list named by ${labelledBy ? `#${labelledBy}` : "aria-label"}`;
});

check("html: no duplicate ids", () => {
  const ids = [...htmlNoComments.matchAll(/\sid\s*=\s*"([^"]+)"/g)].map(
    (match) => match[1],
  );
  const seen = new Set();
  const duplicates = [];

  for (const id of ids) {
    if (seen.has(id)) duplicates.push(id);
    seen.add(id);
  }

  assert(
    duplicates.length === 0,
    `duplicate id(s): ${[...new Set(duplicates)].join(", ")}`,
  );
  return `${ids.length} unique ids`;
});

check("html: polite result-count live region", () => {
  const region = tags.find((tag) => attr(tag, "id") === "tx-result-status");
  assert(region, "missing #tx-result-status");
  assert(attr(region, "role") === "status", "the result count needs role=\"status\"");
  assert(
    (attr(region, "aria-live") || "").toLowerCase() === "polite",
    "the result count needs aria-live=\"polite\"",
  );
  assert(
    tags.filter((tag) => attr(tag, "role") === "status").length === 1,
    "expected exactly one status region",
  );
  return "role=status + aria-live=polite";
});

check("html: no inline styles or style attributes", () => {
  assert(!/\sstyle\s*=/i.test(htmlNoComments), "inline style attributes are not allowed");
  assert(!/<style\b/i.test(htmlNoComments), "style blocks are not allowed");
  return "presentation lives in poc.css";
});

// ---------------------------------------------------------------------------
// 18-22. Script and presentation behaviour
// ---------------------------------------------------------------------------

check("js: no network calls, imports or external URLs", () => {
  const forbidden = [
    /\bfetch\s*\(/,
    /\bXMLHttpRequest\b/,
    /\bsendBeacon\b/,
    /\bWebSocket\b/,
    /\brequire\s*\(/,
    /(^|\s)import\s+[\s\S]*?from\s+/m,
    /\bimport\s*\(/,
    /https?:\/\//i,
  ];
  const found = forbidden.filter((pattern) => pattern.test(jsNoComments));
  assert(found.length === 0, `forbidden script patterns: ${found.map(String).join(", ")}`);
  return "static data, no dependencies";
});

check("js: ten illustrative records with credit and debit", () => {
  const ids = [...jsNoComments.matchAll(/\bid:\s*"txn-\d+"/g)];
  assert(ids.length === 10, `expected 10 records, found ${ids.length}`);
  const amounts = [...jsNoComments.matchAll(/\bamountCents:\s*(-?\d+)/g)].map(
    (match) => Number(match[1]),
  );
  assert(amounts.length === 10, `expected 10 amounts, found ${amounts.length}`);
  assert(amounts.every((amount) => Number.isInteger(amount) && amount !== 0), "amounts must be non-zero integers");
  assert(amounts.some((amount) => amount < 0), "no debit (negative) amount found");
  assert(amounts.some((amount) => amount > 0), "no credit (positive) amount found");
  return "10 records; both debit and credit present";
});

check("js: long description and long reference are present", () => {
  const descriptions = [...jsNoComments.matchAll(/\bdescription:\s*"([^"]+)"/g)].map(
    (match) => match[1],
  );
  const references = [...jsNoComments.matchAll(/\breference:\s*"([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert(descriptions.length === 10, `expected 10 descriptions, found ${descriptions.length}`);
  assert(references.length === 10, `expected 10 references, found ${references.length}`);
  const longestDescription = Math.max(...descriptions.map((value) => value.length));
  const longestReference = Math.max(...references.map((value) => value.length));
  assert(longestDescription >= 60, `longest description is only ${longestDescription} characters`);
  assert(longestReference >= 24, `longest reference is only ${longestReference} characters`);
  return `description ${longestDescription} chars, reference ${longestReference} chars`;
});

check("js: neutral statuses and one currency", () => {
  const statuses = [...jsNoComments.matchAll(/\bstatus:\s*"([^"]+)"/g)].map(
    (match) => match[1],
  );
  const allowed = new Set(["Completed", "Pending", "Failed"]);
  const unknown = statuses.filter((status) => !allowed.has(status));
  assert(unknown.length === 0, `unexpected status values: ${unknown.join(", ")}`);
  assert(new Set(statuses).size >= 2, "the data should exercise more than one status");
  assert(/CURRENCY\s*=\s*"USD"/.test(jsNoComments), "the currency must be declared as USD");
  assert(!/[€£¥]/.test(html + js), "a second currency symbol was found");
  assert(/Intl\.NumberFormat/.test(jsNoComments), "amounts should use Intl.NumberFormat");
  assert(/Intl\.DateTimeFormat/.test(jsNoComments), "dates should use Intl.DateTimeFormat");
  return "Completed/Pending/Failed, USD, Intl formatting";
});

check("js: one dataset rendered by the table and the list", () => {
  const datasets = [...jsNoComments.matchAll(/\bconst transactions\s*=\s*\[/g)];
  assert(datasets.length === 1, `expected one transactions array, found ${datasets.length}`);

  const rowBuilder = jsNoComments.match(/function buildRow\s*\([^)]*\)\s*\{([\s\S]*?)\n\}/);
  const cardBuilder = jsNoComments.match(/function buildCard\s*\([^)]*\)\s*\{([\s\S]*?)\n\}/);
  const renderBody = jsNoComments.match(/function render\s*\([^)]*\)\s*\{([\s\S]*?)\n\}/);

  assert(rowBuilder, "missing buildRow()");
  assert(cardBuilder, "missing buildCard()");
  assert(renderBody, "missing render()");

  assert(/formatAmount\s*\(/.test(cardBuilder[1]), "buildCard must reuse formatAmount()");
  assert(/formatDate\s*\(/.test(cardBuilder[1]), "buildCard must reuse formatDate()");
  assert(/createElement\("time"\)/.test(cardBuilder[1]), "buildCard must use a <time> element");
  assert(/\.dateTime\s*=/.test(cardBuilder[1]), "buildCard must set time.dateTime");
  assert(/tx-sr-only/.test(cardBuilder[1]), "the amount and direction need an accessible separator");

  assert(/buildRow\b/.test(renderBody[1]), "render() must build table rows");
  assert(/buildCard\b/.test(renderBody[1]), "render() must build list cards");
  assert(/tableWrap\.hidden\s*=\s*!hasResults/.test(renderBody[1]), "render() must hide the table when empty");
  assert(/listView\.hidden\s*=\s*!hasResults/.test(renderBody[1]), "render() must hide the list when empty");
  assert(/getElementById\("tx-list"\)/.test(jsNoComments), "poc.js must reference #tx-list");

  return "one dataset; shared formatting; both views rendered";
});

check("css: scoped amount, wrapping and responsive rules", () => {
  const ruleBody = (selector) => {
    for (const match of cssNoComments.matchAll(/(?:^|\n)([^{}@]+)\{([^{}]*)\}/g)) {
      const selectors = match[1].split(",").map((value) => value.trim());
      if (selectors.includes(selector)) return match[2];
    }
    return null;
  };

  const requireRule = (selector, pattern, message) => {
    const body = ruleBody(selector);
    assert(body !== null, `missing CSS rule for ${selector}`);
    assert(pattern.test(body), message);
  };

  requireRule(
    ".tx-table__amount",
    /font-variant-numeric:\s*tabular-nums/,
    ".tx-table__amount needs tabular numerals",
  );
  requireRule(
    ".tx-table__amount",
    /white-space:\s*nowrap/,
    ".tx-table__amount must not wrap",
  );
  requireRule(
    ".tx-table td.tx-table__amount",
    /text-align:\s*end/,
    ".tx-table td.tx-table__amount must align to the end",
  );

  requireRule(
    ".tx-card__amount",
    /font-variant-numeric:\s*tabular-nums/,
    ".tx-card__amount needs tabular numerals",
  );
  requireRule(
    ".tx-card__amount",
    /white-space:\s*nowrap/,
    ".tx-card__amount must not wrap",
  );
  requireRule(
    ".tx-card__amount",
    /text-align:\s*end/,
    ".tx-card__amount must align to the end",
  );

  for (const selector of [
    ".tx-table__description",
    ".tx-table__reference",
    ".tx-card__description",
    ".tx-card__meta dd",
  ]) {
    requireRule(
      selector,
      /overflow-wrap:\s*anywhere/,
      `${selector} must allow long text to wrap`,
    );
  }

  requireRule(
    ".tx-table-wrap",
    /overflow-x:\s*auto/,
    ".tx-table-wrap needs an overflow guard",
  );
  requireRule(
    ".tx-list",
    /display:\s*none/,
    ".tx-list must be hidden by default",
  );

  assert(
    /@media[^{]*max-width:\s*639px/.test(cssNoComments),
    "a 639px breakpoint is missing",
  );

  const mediaIndex = cssNoComments.indexOf("@media (max-width: 639px)");
  assert(mediaIndex !== -1, "the 639px media query must be explicit");
  const media = cssNoComments.slice(mediaIndex);

  assert(
    /\.tx-table-wrap\s*\{[^}]*display:\s*none/.test(media),
    "the table must be hidden below 640px",
  );
  assert(
    /\.tx-list:not\(\[hidden\]\)\s*\{[^}]*display:\s*block/.test(media),
    "the list must be shown below 640px when it has results",
  );

  return "scoped amount, wrapping, list and 639px rules";
});

check("readme: documents scope, serving, checker and limits", () => {
  assert(readme.length > 1500, `README.md is only ${readme.length} characters`);
  const required = [
    [/node poc\/transaction-history\/check\.mjs/i, "checker command"],
    [/python3 -m http\.server/i, "local server command"],
    [/illustrative/i, "illustrative-data note"],
    [/primitive/i, "primitive-token exception"],
    [/not\s+(?:a\s+)?FinCore\s+component/i, "application-scaffolding note"],
    [/screen reader/i, "manual accessibility note"],
    [/static/i, "static-check note"],
    [/browser/i, "browser-check note"],
  ];
  const missing = required
    .filter(([pattern]) => !pattern.test(readme))
    .map(([, label]) => label);
  assert(missing.length === 0, `README.md is missing: ${missing.join(", ")}`);
  return "scope, serving, checker and verification limits documented";
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

const failures = results.filter((result) => !result.pass);

console.log("FinCore PoC — transaction-history compliance");
console.log(`Source: ${POC_DIR}`);
console.log("");

for (const result of results) {
  const status = result.pass ? "PASS" : "FAIL";
  const detail = result.detail ? ` — ${result.detail}` : "";
  console.log(`${status}  ${result.label}${detail}`);
}

console.log("");
console.log("Summary");
console.log(`  Checks: ${results.length - failures.length} passed, ${failures.length} failed`);
console.log("");

if (failures.length > 0) {
  console.log("FAILED — the proof of concept breaks a documented FinCore usage rule.");
  process.exitCode = 1;
} else {
  console.log("PASSED — the proof of concept follows the FinCore usage rules.");
}
