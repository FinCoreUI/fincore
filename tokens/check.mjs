#!/usr/bin/env node
/**
 * FinCore token validation and CSS generation.
 *
 * Zero dependencies. Validates tokens/tokens.json, checks the component
 * colour pairs, control boundaries and focus ring against WCAG 2.2 AA
 * thresholds, and (with --write) generates tokens/dist/tokens.css.
 *
 * Usage:
 *   node tokens/check.mjs           validate and verify the CSS is current
 *   node tokens/check.mjs --write   validate and regenerate the CSS
 *
 * Scope: light theme only (v0.1). No dark-theme mappings are generated.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "tokens", "tokens.json");
const OUTPUT = join(ROOT, "tokens", "dist", "tokens.css");
const WRITE = process.argv.includes("--write");

const TEXT_MIN = 4.5;
const NON_TEXT_MIN = 3.0;
const TARGET_MIN_PX = 24;
const FOCUS_WIDTH_MIN_PX = 2;
const FOCUS_OFFSET_MIN_PX = 2;

// Single-segment names are allowed for primitives such as "white" and
// "black"; semantic and component names must use at least two segments.
const NAME_RE =
  /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*$/;
const HEX_RE = /^#[0-9A-Fa-f]{6}$/;
const ALIAS_RE = /^\{([^{}]+)\}$/;
const DIMENSION_RE = /^\d+(?:\.\d+)?px$/;
const ALLOWED_TYPES = new Set(["color", "dimension", "fontWeight", "number"]);

// Layer detection is prefix-based. Anything that is neither a component
// prefix nor `color.` falls through to the primitive layer, so the primitive
// group allowlist below catches typos such as `spac.1`.
const COMPONENT_PREFIXES = ["button.", "input.", "select.", "phone-input.", "checkbox.", "radio-group.", "textarea.", "otp.", "currency.", "cvv.", "date-picker.", "card.", "alert.", "tabs.", "table.", "badge.", "switch.", "tooltip.", "popover.", "drawer.", "divider.", "transaction-item.", "balance-card.", "amount-display.", "status-indicator.", "stack.", "inline.", "container."];
const PRIMITIVE_GROUPS = new Set([
  "neutral",
  "blue",
  "green",
  "amber",
  "red",
  "purple",
  "orange",
  "white",
  "black",
  "space",
  "radius",
  "font",
  "size",
]);

// Tokens the component layer and the accessibility baseline depend on. A
// missing entry here is a silent regression, so it fails loudly instead.
const REQUIRED_TOKENS = [
  "button.height",
  "button.padding-x",
  "button.radius",
  "button.font-size",
  "button.font-weight",
  "button.line-height",
  "button.focus.color",
  "button.focus.width",
  "button.focus.offset",
  "color.content.primary",
  "color.content.tertiary",
  "color.surface.default",
  "color.surface.subtle",
  "color.border.focus",
  "color.border.control",
  "color.border.control-hover",
  "color.border.error",
  "color.feedback.error-foreground",
  "size.control.md",
  "size.border.width",
  "size.focus-ring.width",
  "size.focus-ring.offset",
  "font.size.xs",
  "font.size.sm",
  "font.weight.regular",
  "font.weight.medium",
  "font.line-height.xs",
  "font.line-height.sm",
  "radius.lg",
  "color.content.helper",
  "input.height",
  "input.padding-x",
  "input.radius",
  "input.border-width",
  "input.font-size",
  "input.line-height",
  "input.font-weight",
  "input.label-gap",
  "input.helper-gap",
  "input.focus.color",
  "input.focus.width",
  "input.focus.offset",
  "input.focus.radius",
  "input.background",
  "input.border",
  "input.text",
  "input.placeholder",
  "input.border-hover",
  "input.border-error",
  "input.text-error",
  "input.background-disabled",
  "input.border-disabled",
  "input.text-disabled",
  "input.label.color",
  "input.label.font-weight",
  "input.helper.color",
  "input.helper.font-size",
  "input.helper.line-height",
  "phone-input.height",
  "phone-input.padding-x",
  "phone-input.padding-y",
  "phone-input.radius",
  "phone-input.border-width",
  "phone-input.font-size",
  "phone-input.line-height",
  "phone-input.font-weight",
  "phone-input.label-gap",
  "phone-input.helper-gap",
  "phone-input.gap",
  "phone-input.country-width",
  "phone-input.focus.color",
  "phone-input.focus.width",
  "phone-input.focus.offset",
  "phone-input.focus.radius",
  "phone-input.background",
  "phone-input.border",
  "phone-input.text",
  "phone-input.placeholder",
  "phone-input.border-hover",
  "phone-input.border-error",
  "phone-input.text-error",
  "phone-input.background-disabled",
  "phone-input.border-disabled",
  "phone-input.text-disabled",
  "phone-input.label.color",
  "phone-input.label.font-weight",
  "phone-input.helper.color",
  "phone-input.helper.font-size",
  "phone-input.helper.line-height",
  "phone-input.country-select-padding-x",
];

const tokens = new Map();
const order = [];
const errors = [];
const structural = [];

function fail(list) {
  errors.push(...list);
}

function record(label, problems = []) {
  structural.push({ label, ok: problems.length === 0, problems });
  fail(problems);
}

function layerOf(name) {
  if (COMPONENT_PREFIXES.some((prefix) => name.startsWith(prefix))) {
    return "component";
  }
  if (name.startsWith("color.")) return "semantic";
  return "primitive";
}

function aliasTarget(value) {
  const match = typeof value === "string" ? ALIAS_RE.exec(value) : null;
  return match ? match[1] : null;
}

function cssVar(name) {
  return `--fc-${name.split(".").join("-")}`;
}

// JSON.parse silently keeps the last of two identical keys, which would let a
// duplicate token definition pass every downstream check. Scan the raw text
// before parsing so the collision is reported at its real location.
function scanDuplicateKeys(source) {
  const problems = [];
  const stack = [];
  const pathOf = (frame) =>
    [...frame.path, ...(frame.pendingKey ? [frame.pendingKey] : [])];
  let index = 0;

  while (index < source.length) {
    const character = source[index];

    if (character === '"') {
      let cursor = index + 1;
      let text = "";
      while (cursor < source.length && source[cursor] !== '"') {
        if (source[cursor] === "\\") {
          text += source[cursor + 1] ?? "";
          cursor += 2;
          continue;
        }
        text += source[cursor];
        cursor += 1;
      }
      const followedByColon = /^\s*:/.test(source.slice(cursor + 1));
      const frame = stack[stack.length - 1];
      if (followedByColon && frame && frame.type === "object") {
        if (frame.keys.has(text)) {
          problems.push(`duplicate key "${text}" at ${pathOf(frame).join(".") || "<root>"}`);
        } else {
          frame.keys.add(text);
        }
        frame.pendingKey = text;
      }
      index = cursor + 1;
      continue;
    }

    if (character === "{" || character === "[") {
      const parent = stack[stack.length - 1];
      const path = parent ? pathOf(parent) : [];
      if (parent) parent.pendingKey = null;
      stack.push({
        type: character === "{" ? "object" : "array",
        keys: new Set(),
        path,
        pendingKey: null,
      });
    } else if (character === "}" || character === "]") {
      stack.pop();
    }

    index += 1;
  }

  return problems;
}

function walk(node, path, inheritedType) {
  if (node === null || typeof node !== "object" || Array.isArray(node)) {
    errors.push(`invalid token group at ${path.join(".") || "<root>"}`);
    return;
  }

  const type = node.$type ?? inheritedType;
  const isToken = Object.hasOwn(node, "$value");

  if (isToken) {
    const name = path.join(".");
    if (tokens.has(name)) {
      errors.push(`duplicate token name ${name}`);
    }
    tokens.set(name, {
      name,
      value: node.$value,
      darkValue: node.$darkValue,
      type,
      description: node.$description,
    });
    order.push(name);
  }

  for (const [key, child] of Object.entries(node)) {
    if (key === "$value" || key === "$darkValue" || key === "$type" || key === "$description") continue;
    if (isToken) {
      errors.push(`token ${path.join(".")} has an unexpected child "${key}"`);
      continue;
    }
    walk(child, [...path, key], type);
  }
}

function resolveToken(name) {
  const chain = [];
  let current = name;

  while (true) {
    if (chain.includes(current)) {
      return { error: `alias cycle: ${[...chain, current].join(" → ")}` };
    }
    const token = tokens.get(current);
    if (!token) return { error: `unknown token {${current}}` };
    chain.push(current);

    const target = aliasTarget(token.value);
    if (!target) {
      return { literal: token.value, type: token.type, chain };
    }
    current = target;
  }
}

function resolveColor(name) {
  const result = resolveToken(name);
  if (result.error || result.type !== "color" || !HEX_RE.test(result.literal)) {
    return null;
  }
  return result.literal;
}

function dimensionPx(name) {
  const result = resolveToken(name);
  if (result.error) return null;
  const match = /^(-?\d+(?:\.\d+)?)px$/.exec(String(result.literal));
  return match ? Number(match[1]) : null;
}

function channel(value) {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a, b) {
  const first = luminance(a);
  const second = luminance(b);
  return (
    (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
  );
}

// ---------------------------------------------------------------------------
// Parse
// ---------------------------------------------------------------------------

let raw;
try {
  raw = readFileSync(SOURCE, "utf8");
  walk(JSON.parse(raw), [], undefined);
} catch (error) {
  console.error(`FinCore tokens — FAILED\n  Cannot read or parse ${SOURCE}\n  ${error.message}`);
  process.exit(1);
}

record("raw JSON contains no duplicate keys", scanDuplicateKeys(raw));
record(`tokens parsed (${tokens.size} total)`);

const counts = { primitive: 0, semantic: 0, component: 0 };
for (const name of tokens.keys()) counts[layerOf(name)] += 1;

record(
  `${counts.primitive} primitive, ${counts.semantic} semantic, ${counts.component} component tokens`,
);

// ---------------------------------------------------------------------------
// Structure
// ---------------------------------------------------------------------------

const badNames = [...tokens.values()]
  .filter(
    (token) =>
      !NAME_RE.test(token.name) ||
      (layerOf(token.name) !== "primitive" && !token.name.includes(".")),
  )
  .map((token) => `${token.name}: does not match category.role.property with hyphenated suffixes`);
record("names match the canonical pattern", badNames);

const badTypes = [...tokens.values()]
  .filter(
    (token) =>
      !token.type || !ALLOWED_TYPES.has(token.type),
  )
  .map((token) => `${token.name}: missing or unsupported $type ${JSON.stringify(token.type)}`);
record("every token declares a supported $type", badTypes);

const cssNames = new Map();
const cssCollisions = [];
for (const name of order) {
  const variable = cssVar(name);
  if (cssNames.has(variable)) {
    cssCollisions.push(`${variable}: produced by ${cssNames.get(variable)} and ${name}`);
  } else {
    cssNames.set(variable, name);
  }
}
record("CSS variable names are unique", cssCollisions);

const aliasProblems = [];
const layerProblems = [];

for (const token of tokens.values()) {
  const layer = layerOf(token.name);
  const target = aliasTarget(token.value);

  if (layer === "primitive") {
    if (target) {
      layerProblems.push(`${token.name}: primitive tokens must hold literals, not {${target}}`);
    }
    if (token.type === "color" && !HEX_RE.test(String(token.value))) {
      layerProblems.push(`${token.name}: invalid colour literal ${JSON.stringify(token.value)}`);
    }
    continue;
  }

  if (!target) {
    layerProblems.push(`${token.name}: ${layer} tokens must alias another token`);
    continue;
  }

  const targetToken = tokens.get(target);
  if (!targetToken) {
    aliasProblems.push(`${token.name}: unknown alias target {${target}}`);
    continue;
  }

  if (targetToken.type !== token.type) {
    layerProblems.push(
      `${token.name}: type ${token.type} aliases {${target}} of type ${targetToken.type}`,
    );
  }

  const targetLayer = layerOf(target);
  if (layer === "semantic") {
    if (token.type !== "color") {
      layerProblems.push(`${token.name}: semantic colour tokens must use $type "color"`);
    }
    if (targetLayer !== "primitive") {
      layerProblems.push(
        `${token.name}: semantic token must alias a primitive, not ${targetLayer} {${target}}`,
      );
    }
  }

  if (layer === "component") {
    // Colour follows the strict three-layer chain. Geometry has no semantic
    // layer yet, so dimension and weight tokens may alias primitives directly.
    const expected = token.type === "color" ? "semantic" : "primitive";
    if (targetLayer !== expected) {
      layerProblems.push(
        `${token.name}: component ${token.type} token must alias a ${expected} token, not ${targetLayer} {${target}}`,
      );
    }
  }

  if (token.darkValue) {
    const darkTarget = aliasTarget(token.darkValue);
    if (!darkTarget) {
      layerProblems.push(`${token.name}: dark token value must alias another token`);
    } else {
      const darkTargetToken = tokens.get(darkTarget);
      if (!darkTargetToken) {
        aliasProblems.push(`${token.name}: unknown dark alias target {${darkTarget}}`);
      } else {
        if (darkTargetToken.type !== token.type) {
          layerProblems.push(
            `${token.name}: dark type ${token.type} aliases {${darkTarget}} of type ${darkTargetToken.type}`,
          );
        }
        if (layerOf(darkTarget) !== "primitive") {
          layerProblems.push(
            `${token.name}: dark semantic token must alias a primitive, not ${layerOf(darkTarget)} {${darkTarget}}`,
          );
        }
      }
    }
  }
}

record("every alias resolves to an existing token", aliasProblems);
record("no literal values outside the primitive layer", layerProblems);

const cycleProblems = [];
for (const name of tokens.keys()) {
  const result = resolveToken(name);
  if (result.error && result.error.startsWith("alias cycle")) {
    cycleProblems.push(`${name}: ${result.error}`);
  }
}
record("alias chains contain no cycles", cycleProblems);

// ---------------------------------------------------------------------------
// Value validity
// ---------------------------------------------------------------------------

const badDimensions = [];
const badWeights = [];

for (const token of tokens.values()) {
  const resolved = resolveToken(token.name);
  if (resolved.error) continue; // already reported above

  if (token.type === "dimension") {
    const literal = String(resolved.literal);
    if (!DIMENSION_RE.test(literal)) {
      badDimensions.push(
        `${token.name}: dimension ${JSON.stringify(resolved.literal)} is not a non-negative px value`,
      );
    }
  }

  if (token.type === "fontWeight") {
    const weight = resolved.literal;
    if (typeof weight !== "number" || !Number.isInteger(weight) || weight < 100 || weight > 900 || weight % 100 !== 0) {
      badWeights.push(
        `${token.name}: fontWeight ${JSON.stringify(weight)} must be an integer 100–900 in steps of 100`,
      );
    }
  }
}

record("dimension values are non-negative px", badDimensions);
record("fontWeight values are 100–900 in steps of 100", badWeights);

const unknownPrimitiveGroups = [...tokens.values()]
  .filter((token) => layerOf(token.name) === "primitive")
  .map((token) => token.name.split(".")[0])
  .filter((group) => !PRIMITIVE_GROUPS.has(group))
  .map((group) => `${group}.*: unknown primitive group; add it to PRIMITIVE_GROUPS or fix the name`);
record("primitive tokens belong to a known group", [...new Set(unknownPrimitiveGroups)]);

const missingRequired = [];
for (const name of REQUIRED_TOKENS) {
  const token = tokens.get(name);
  if (!token) {
    missingRequired.push(`${name}: required token is missing`);
    continue;
  }
  const resolved = resolveToken(name);
  if (resolved.error) {
    missingRequired.push(`${name}: required token does not resolve (${resolved.error})`);
  }
}
record(
  `required tokens present (${REQUIRED_TOKENS.length} checked)`,
  missingRequired,
);

// ---------------------------------------------------------------------------
// Button geometry
// ---------------------------------------------------------------------------

const height = dimensionPx("button.height");
record(
  `Button height ${height ?? "unresolved"}px meets the ${TARGET_MIN_PX}px minimum target`,
  height === null
    ? ["button.height: missing or not a px dimension"]
    : height >= TARGET_MIN_PX
      ? []
      : [`button.height is ${height}px, below ${TARGET_MIN_PX}px`],
);

const focusWidth = dimensionPx("button.focus.width");
const focusOffset = dimensionPx("button.focus.offset");
const focusProblems = [];
if (focusWidth === null) focusProblems.push("button.focus.width: missing or not a px dimension");
if (focusOffset === null) focusProblems.push("button.focus.offset: missing or not a px dimension");
if (focusWidth !== null && focusWidth < FOCUS_WIDTH_MIN_PX) {
  focusProblems.push(
    `button.focus.width is ${focusWidth}px, below the approved ${FOCUS_WIDTH_MIN_PX}px`,
  );
}
if (focusOffset !== null && focusOffset < FOCUS_OFFSET_MIN_PX) {
  focusProblems.push(
    `button.focus.offset is ${focusOffset}px, below the approved ${FOCUS_OFFSET_MIN_PX}px`,
  );
}
record(
  `Focus ring ${focusWidth ?? "?"}px at ${focusOffset ?? "?"}px offset`,
  focusProblems,
);

// ---------------------------------------------------------------------------
// Input geometry and typography
// ---------------------------------------------------------------------------

const APPROVED_BORDER_WIDTH_PX = 1;
const APPROVED_FOCUS_WIDTH_PX = 2;
const APPROVED_FOCUS_OFFSET_PX = 2;
const APPROVED_INPUT_RADIUS_PX = 6;
const APPROVED_INPUT_FONT_SIZE_PX = 14;
const APPROVED_INPUT_LINE_HEIGHT_PX = 20;
const APPROVED_INPUT_WEIGHT = 400;
const APPROVED_LABEL_WEIGHT = 500;
const APPROVED_HELPER_FONT_SIZE_PX = 12;
const APPROVED_HELPER_LINE_HEIGHT_PX = 16;

const inputHeight = dimensionPx("input.height");
record(
  `Input height ${inputHeight ?? "unresolved"}px meets the ${TARGET_MIN_PX}px minimum target`,
  inputHeight === null
    ? ["input.height: missing or not a px dimension"]
    : inputHeight >= TARGET_MIN_PX
      ? []
      : [`input.height is ${inputHeight}px, below ${TARGET_MIN_PX}px`],
);

const inputBorderWidth = dimensionPx("input.border-width");
const inputFocusWidth = dimensionPx("input.focus.width");
const inputFocusOffset = dimensionPx("input.focus.offset");
const inputGeometryProblems = [];

for (const [name, value, approved] of [
  ["input.border-width", inputBorderWidth, APPROVED_BORDER_WIDTH_PX],
  ["input.focus.width", inputFocusWidth, APPROVED_FOCUS_WIDTH_PX],
  ["input.focus.offset", inputFocusOffset, APPROVED_FOCUS_OFFSET_PX],
]) {
  if (value === null) {
    inputGeometryProblems.push(`${name}: missing or not a px dimension`);
  } else if (value !== approved) {
    inputGeometryProblems.push(`${name} is ${value}px, approved ${approved}px`);
  }
}
record(
  `Input boundary ${inputBorderWidth ?? "?"}px, focus ring ${inputFocusWidth ?? "?"}px at ${inputFocusOffset ?? "?"}px offset`,
  inputGeometryProblems,
);

const inputRadius = dimensionPx("input.radius");
const inputFocusRadius = dimensionPx("input.focus.radius");
const inputRadiusProblems = [];
if (inputRadius === null) inputRadiusProblems.push("input.radius: missing or not a px dimension");
if (inputFocusRadius === null) inputRadiusProblems.push("input.focus.radius: missing or not a px dimension");
if (inputRadius !== null && inputRadius !== APPROVED_INPUT_RADIUS_PX) {
  inputRadiusProblems.push(
    `input.radius is ${inputRadius}px, approved ${APPROVED_INPUT_RADIUS_PX}px`,
  );
}
if (inputRadius !== null && inputFocusOffset !== null && inputFocusRadius !== null) {
  const expected = inputRadius + inputFocusOffset;
  if (inputFocusRadius !== expected) {
    inputRadiusProblems.push(
      `input.focus.radius is ${inputFocusRadius}px; expected control radius ${inputRadius}px + offset ${inputFocusOffset}px = ${expected}px`,
    );
  }
}
record(
  `Input focus radius ${inputFocusRadius ?? "?"}px is concentric with radius ${inputRadius ?? "?"}px + offset ${inputFocusOffset ?? "?"}px`,
  inputRadiusProblems,
);

const inputFontSize = dimensionPx("input.font-size");
const inputLineHeight = dimensionPx("input.line-height");
const helperFontSize = dimensionPx("input.helper.font-size");
const helperLineHeight = dimensionPx("input.helper.line-height");
const inputTextWeight = resolveToken("input.font-weight");
const inputLabelWeight = resolveToken("input.label.font-weight");
const inputTypeProblems = [];

for (const [name, value, approved] of [
  ["input.font-size", inputFontSize, APPROVED_INPUT_FONT_SIZE_PX],
  ["input.line-height", inputLineHeight, APPROVED_INPUT_LINE_HEIGHT_PX],
  ["input.helper.font-size", helperFontSize, APPROVED_HELPER_FONT_SIZE_PX],
  ["input.helper.line-height", helperLineHeight, APPROVED_HELPER_LINE_HEIGHT_PX],
]) {
  if (value === null) {
    inputTypeProblems.push(`${name}: missing or not a px dimension`);
  } else if (value !== approved) {
    inputTypeProblems.push(`${name} is ${value}px, approved ${approved}px`);
  }
}
for (const [name, resolved, approved] of [
  ["input.font-weight", inputTextWeight, APPROVED_INPUT_WEIGHT],
  ["input.label.font-weight", inputLabelWeight, APPROVED_LABEL_WEIGHT],
]) {
  if (resolved.error) {
    inputTypeProblems.push(`${name}: does not resolve (${resolved.error})`);
  } else if (resolved.literal !== approved) {
    inputTypeProblems.push(`${name} is ${resolved.literal}, approved ${approved}`);
  }
}
record(
  `Input typography ${inputFontSize ?? "?"}/${inputLineHeight ?? "?"} weight ${inputTextWeight.literal ?? "?"}, label weight ${inputLabelWeight.literal ?? "?"}, helper ${helperFontSize ?? "?"}/${helperLineHeight ?? "?"} weight ${inputTextWeight.literal ?? "?"}`,
  inputTypeProblems,
);

// ---------------------------------------------------------------------------
// Contrast
// ---------------------------------------------------------------------------

const contrastRows = [];
const contrastProblems = [];

function addPair({
  label,
  foreground,
  background,
  kind,
  minimum,
  exemption = null,
  advisory = false,
  note = "",
}) {
  const fg = resolveColor(foreground);
  const bg = resolveColor(background);
  if (!fg || !bg) {
    const reasons = [];
    for (const [role, name, value] of [
      ["foreground", foreground, fg],
      ["background", background, bg],
    ]) {
      if (value) continue;
      const token = tokens.get(name);
      if (!token) {
        reasons.push(`${role} {${name}} is not defined`);
        continue;
      }
      const resolved = resolveToken(name);
      if (resolved.error) {
        reasons.push(`${role} {${name}} does not resolve (${resolved.error})`);
      } else if (token.type !== "color") {
        reasons.push(`${role} {${name}} is $type "${token.type}", not color`);
      } else if (!HEX_RE.test(String(resolved.literal))) {
        reasons.push(
          `${role} {${name}} resolves to ${JSON.stringify(resolved.literal)}, not a #RRGGBB literal`,
        );
      }
    }
    contrastProblems.push(`${label}: ${reasons.join("; ")}`);
    return;
  }

  const ratio = contrastRatio(fg, bg);
  contrastRows.push({
    label,
    foreground,
    background,
    kind,
    minimum,
    ratio,
    pass: ratio >= minimum,
    exemption,
    advisory,
    note,
  });
}

const disabledExemption =
  "inactive component; WCAG 1.4.3 and 1.4.11 exclude disabled controls";

const variantRows = [
  ["primary", "button.primary.foreground", [
    ["default", "button.primary.background"],
    ["hover", "button.primary.background-hover"],
    ["active", "button.primary.background-active"],
  ]],
  ["secondary", "button.secondary.foreground", [
    ["default", "button.secondary.background"],
    ["hover", "button.secondary.background-hover"],
    ["active", "button.secondary.background-active"],
  ]],
  ["ghost", "button.ghost.foreground", [
    ["default", "color.surface.default"],
    ["hover", "button.ghost.background-hover"],
    ["active", "button.ghost.background-active"],
  ]],
];

for (const [variant, foreground, states] of variantRows) {
  for (const [state, background] of states) {
    addPair({
      label: `${variant}/${state}`,
      foreground,
      background,
      kind: "text",
      minimum: TEXT_MIN,
    });
  }
}

for (const [variant, background] of [
  ["primary", "button.disabled.background"],
  ["secondary", "button.disabled.background"],
  ["ghost", "color.surface.default"],
]) {
  addPair({
    label: `${variant}/disabled`,
    foreground: "button.disabled.foreground",
    background,
    kind: "text",
    minimum: TEXT_MIN,
    exemption: disabledExemption,
  });
}

for (const surface of ["default", "canvas", "subtle", "muted", "inverse"]) {
  addPair({
    label: `focus/${surface}`,
    foreground: "button.focus.color",
    background: `color.surface.${surface}`,
    kind: "non-text",
    minimum: NON_TEXT_MIN,
    note: "2px ring at 2px offset; adjacent surface",
  });
}

// Control boundaries are gated, unlike the advisory button surface boundaries
// below: the border is part of the control, so WCAG 1.4.11 requires 3:1
// against the adjacent surface.
for (const surface of ["default", "canvas", "subtle", "muted", "inverse"]) {
  addPair({
    label: `control/${surface}`,
    foreground: "color.border.control",
    background: `color.surface.${surface}`,
    kind: "non-text",
    minimum: NON_TEXT_MIN,
    note: "1px input boundary",
  });
  addPair({
    label: `control-error/${surface}`,
    foreground: "color.border.error",
    background: `color.surface.${surface}`,
    kind: "non-text",
    minimum: NON_TEXT_MIN,
    note: "1px invalid input boundary; helper text carries the error",
  });
}

for (const surface of ["default", "canvas", "subtle", "muted"]) {
  addPair({
    label: `control-hover/${surface}`,
    foreground: "color.border.control-hover",
    background: `color.surface.${surface}`,
    kind: "non-text",
    minimum: NON_TEXT_MIN,
    note: "1px hovered input boundary",
  });
}

// Reported, not gated: a dark-on-dark control is not an input context this
// version supports, and the limitation is documented rather than hidden.
addPair({
  label: "control-hover/inverse",
  foreground: "color.border.control-hover",
  background: "color.surface.inverse",
  kind: "non-text",
  minimum: NON_TEXT_MIN,
  advisory: true,
  note: "inverse surfaces are not a supported input context in v0.1",
});

// The Input-specific inverse error-text pair is reported in the Input section
// through input.text-error, which aliases color.feedback.error-foreground.
// Reporting the same resolved pair twice added noise without new evidence.

// ---------------------------------------------------------------------------
// Input contrast
// ---------------------------------------------------------------------------

// Value and placeholder sit inside the control's own fill, so they are gated
// against input.background rather than the page surface.
addPair({
  label: "input-value/control",
  foreground: "input.text",
  background: "input.background",
  kind: "text",
  minimum: TEXT_MIN,
});

addPair({
  label: "input-placeholder/control",
  foreground: "input.placeholder",
  background: "input.background",
  kind: "text",
  minimum: TEXT_MIN,
});

const INPUT_SURFACES = ["default", "canvas", "subtle", "muted", "raised"];

// Label, helper and error text sit on the page surface. All five supported
// surfaces are gated; inverse is reported separately as unsupported.
for (const surface of INPUT_SURFACES) {
  addPair({
    label: `input-label/${surface}`,
    foreground: "input.label.color",
    background: `color.surface.${surface}`,
    kind: "text",
    minimum: TEXT_MIN,
  });
  addPair({
    label: `input-helper/${surface}`,
    foreground: "input.helper.color",
    background: `color.surface.${surface}`,
    kind: "text",
    minimum: TEXT_MIN,
  });
  addPair({
    label: `input-error-text/${surface}`,
    foreground: "input.text-error",
    background: `color.surface.${surface}`,
    kind: "text",
    minimum: TEXT_MIN,
  });
}

// Boundaries and the focus ring are control affordances, so WCAG 1.4.11
// requires 3:1 both against the page surface and against the control fill.
for (const surface of INPUT_SURFACES) {
  for (const [label, foreground] of [
    ["input-border", "input.border"],
    ["input-border-error", "input.border-error"],
    ["input-border-hover", "input.border-hover"],
    ["input-focus", "input.focus.color"],
  ]) {
    addPair({
      label: `${label}/${surface}`,
      foreground,
      background: `color.surface.${surface}`,
      kind: "non-text",
      minimum: NON_TEXT_MIN,
    });
  }
}

for (const [label, foreground] of [
  ["input-border", "input.border"],
  ["input-border-error", "input.border-error"],
  ["input-border-hover", "input.border-hover"],
  ["input-focus", "input.focus.color"],
]) {
  addPair({
    label: `${label}/control`,
    foreground,
    background: "input.background",
    kind: "non-text",
    minimum: NON_TEXT_MIN,
    note: "against the control fill",
  });
}

addPair({
  label: "input-disabled-text/control",
  foreground: "input.text-disabled",
  background: "input.background-disabled",
  kind: "text",
  minimum: TEXT_MIN,
  exemption: disabledExemption,
});

addPair({
  label: "input-disabled-border/control",
  foreground: "input.border-disabled",
  background: "input.background-disabled",
  kind: "non-text",
  minimum: NON_TEXT_MIN,
  exemption: disabledExemption,
});

// Reported as advisory: the disabled fill is a visual treatment, not a WCAG
// boundary pair. It is surfaced so the weak 1.27:1 contrast is not hidden.
addPair({
  label: "input-disabled-fill/default",
  foreground: "input.background-disabled",
  background: "color.surface.default",
  kind: "non-text",
  minimum: NON_TEXT_MIN,
  advisory: true,
  note: "visual only; not a WCAG pair",
});

// Inverse is measured and reported, but the full field is unsupported: the
// label, helper, error text and hover border fall below 4.5:1 or 3:1.
for (const [label, foreground, kind, minimum] of [
  ["input-label", "input.label.color", "text", TEXT_MIN],
  ["input-helper", "input.helper.color", "text", TEXT_MIN],
  ["input-error-text", "input.text-error", "text", TEXT_MIN],
  ["input-border", "input.border", "non-text", NON_TEXT_MIN],
  ["input-border-error", "input.border-error", "non-text", NON_TEXT_MIN],
  ["input-border-hover", "input.border-hover", "non-text", NON_TEXT_MIN],
  ["input-focus", "input.focus.color", "non-text", NON_TEXT_MIN],
]) {
  addPair({
    label: `${label}/inverse`,
    foreground,
    background: "color.surface.inverse",
    kind,
    minimum,
    advisory: true,
    note: "inverse surfaces are not a supported Input context in v0.1",
  });
}

// Surface boundaries are advisory: the text label identifies the control, so
// WCAG 1.4.11 does not require a 3:1 container edge. They are still reported
// rather than hidden, because a visible boundary would need a stronger colour.
for (const [label, background] of [
  ["secondary/default", "button.secondary.background"],
  ["secondary/hover", "button.secondary.background-hover"],
  ["secondary/active", "button.secondary.background-active"],
  ["ghost/hover", "button.ghost.background-hover"],
  ["ghost/active", "button.ghost.background-active"],
]) {
  addPair({
    label: `boundary/${label}`,
    foreground: background,
    background: "color.surface.default",
    kind: "non-text",
    minimum: NON_TEXT_MIN,
    advisory: true,
    note: "surface boundary; label identifies the control",
  });
}

record("every contrast pair resolves to colour values", contrastProblems);

const requiredRows = contrastRows.filter((row) => !row.advisory);const advisoryRows = contrastRows.filter((row) => row.advisory);
const failedRequired = requiredRows.filter((row) => !row.pass && !row.exemption);
const exemptRows = requiredRows.filter((row) => row.exemption);

if (failedRequired.length > 0) {
  fail(
    failedRequired.map(
      (row) =>
        `contrast ${row.label}: ${row.ratio.toFixed(2)}:1, needs ${row.minimum}:1`,
    ),
  );
}

// ---------------------------------------------------------------------------
// CSS generation
// ---------------------------------------------------------------------------

function buildCss() {
  const digest = createHash("sha256").update(raw).digest("hex");
  const sections = [
    ["Primitive tokens", order.filter((name) => layerOf(name) === "primitive")],
    ["Semantic tokens — light theme", order.filter((name) => layerOf(name) === "semantic")],
    ["Component tokens", order.filter((name) => layerOf(name) === "component")],
  ];

  const lines = [
    "/* FinCore design tokens — generated file. Do not edit by hand. */",
    `/* Source: tokens/tokens.json (sha256: ${digest}) */`,
    "/* Themes: light (default) and dark ([data-theme=\"dark\"], .dark). */",
    "/* Regenerate: node tokens/check.mjs --write */",
    "",
    ":root {",
    "  color-scheme: light dark;",
  ];

  for (const [heading, names] of sections) {
    lines.push("", `  /* ${heading} */`);
    for (const name of names) {
      const token = tokens.get(name);
      const target = aliasTarget(token.value);
      const value = target ? `var(${cssVar(target)})` : String(token.value);
      lines.push(`  ${cssVar(name)}: ${value};`);
    }
  }

  lines.push("}", "");

  // Emit dark theme semantic overrides
  const darkTokens = order
    .filter((name) => layerOf(name) === "semantic" && tokens.get(name)?.darkValue);

  if (darkTokens.length > 0) {
    lines.push(
      "/* Semantic tokens — dark theme overrides */",
      "[data-theme=\"dark\"],",
      ".dark {",
      "  color-scheme: dark;",
      ""
    );
    for (const name of darkTokens) {
      const token = tokens.get(name);
      const target = aliasTarget(token.darkValue);
      const value = target ? `var(${cssVar(target)})` : String(token.darkValue);
      lines.push(`  ${cssVar(name)}: ${value};`);
    }
    lines.push("}", "");
  }

  return lines.join("\n");
}

const css = buildCss();
let cssStatus;

if (errors.length > 0) {
  cssStatus = "not written (fix the errors above)";
} else if (WRITE) {
  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, css, "utf8");
  cssStatus = `written to tokens/dist/tokens.css (${tokens.size} variables)`;
} else {
  let current = null;
  try {
    current = readFileSync(OUTPUT, "utf8");
  } catch {
    // handled below
  }

  if (current === null) {
    errors.push(
      "tokens/dist/tokens.css is missing; run node tokens/check.mjs --write",
    );
    cssStatus = "missing (run with --write)";
  } else if (current !== css) {
    errors.push(
      "tokens/dist/tokens.css is out of date; run node tokens/check.mjs --write",
    );
    cssStatus = "out of date (run with --write)";
  } else {
    cssStatus = "up to date";
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const passCount = structural.filter((entry) => entry.ok).length;
const structureFailCount = structural.filter((entry) => !entry.ok).length;
const requiredPassCount = requiredRows.filter((row) => row.pass).length;
const advisoryBelow = advisoryRows.filter((row) => !row.pass).length;

console.log("FinCore tokens — validation");
console.log(`Source: ${SOURCE.replace(`${ROOT}/`, "")}`);
console.log("Theme: light only (v0.1). Dark theme is not implemented.");
console.log("");
console.log("Structure");
for (const entry of structural) {
  console.log(`  ${entry.ok ? "PASS" : "FAIL"}  ${entry.label}`);
  for (const problem of entry.problems) {
    console.log(`          ${problem}`);
  }
}

console.log("");
console.log(
  `Contrast — required (WCAG 2.2 AA: ${TEXT_MIN}:1 text, ${NON_TEXT_MIN}:1 non-text)`,
);
for (const row of requiredRows) {
  const status = row.exemption ? "EXEMPT" : row.pass ? "PASS" : "FAIL";
  const suffix = row.exemption ? ` — ${row.exemption}` : row.note ? ` — ${row.note}` : "";
  console.log(
    `  ${status.padEnd(7)} ${row.kind.padEnd(8)} ${row.label.padEnd(26)} ` +
      `${`${row.ratio.toFixed(2)}:1`.padStart(7)}  ` +
      `${`≥${row.minimum.toFixed(1)}`.padStart(4)}  ` +
      `${row.foreground} on ${row.background}${suffix}`,
  );
}

console.log("");
console.log("Contrast — advisory (non-text surface boundaries, not gated)");
for (const row of advisoryRows) {
  const status = row.pass ? "PASS" : "ADVISORY";
  console.log(
    `  ${status.padEnd(8)} ${row.kind.padEnd(8)} ${row.label.padEnd(26)} ` +
      `${`${row.ratio.toFixed(2)}:1`.padStart(7)}  ` +
      `${`≥${row.minimum.toFixed(1)}`.padStart(4)}  ` +
      `${row.foreground} on ${row.background}` +
      `${row.pass ? "" : ` — ${row.note}`}`,
  );
}

console.log("");
console.log("Summary");
console.log(
  `  Structure: ${passCount} passed, ${structureFailCount} failed`,
);
console.log(
  `  Contrast: ${requiredPassCount} passed, ${exemptRows.length} exempt, ` +
    `${failedRequired.length} failed, ${advisoryBelow} advisory below threshold`,
);
console.log(`  CSS: ${cssStatus}`);

if (errors.length > 0) {
  console.log("");
  console.log(`FAILED — ${errors.length} problem(s) need attention.`);
  process.exitCode = 1;
} else {
  console.log("");
  console.log("PASSED — token source is valid and the generated CSS is current.");
}
