# Stage 2 implementation: Button and Input

**Status: Stage 2 implementation complete; Stage 5B documentation reconciled. Framework-agnostic CSS + native HTML. No runtime JavaScript, no package, no build step.**

This document records what was built from the approved Stage 1 contracts, how to use it, what was verified, and what remains unresolved. It is the implementation companion to:

- [`button/README.md`](./button/README.md) and [`button/contract.json`](./button/contract.json)
- [`input/README.md`](./input/README.md) and [`input/contract.json`](./input/contract.json)
- [`contract.schema.json`](./contract.schema.json)
- [`examples/financial-form.md`](./examples/financial-form.md)

---

## 1. Why no framework

The repository has no `package.json`, no package manager manifest, no `node_modules`, no bundler, no test framework and no build configuration. `ROADMAP.md` defers React and Tailwind packages to Version 1.0. The foundation is deliberately framework-agnostic: Markdown guidance, JSON tokens, generated CSS and zero-dependency Node validators.

Introducing React, Vue or a component runtime now would be an architectural change that the repository does not support, so Stage 2 is:

- production CSS for the real HTML elements, using only the generated component tokens;
- native HTML reference markup with no JavaScript;
- zero-dependency tests using Node's built-in `node:test` runner.

A consumer can use the CSS directly today. A future React/Vue/Web Component package can wrap the same class and token contract without changing the design decisions here.

### Contract-level props vs native API

The contracts define a React-shaped API for design intent. This repository exports CSS and native HTML, not JavaScript. The per-component class tables below are the canonical native API:

- Button contract `variant`, `className` and `onClick` map to classes and application-owned native listeners; `disabled` and `type` map to native attributes.
- Input contract `value`, `onChange`, `errorMessage` and `className` map to the native value, application-owned events and attributes, native error presentation and the `class` attribute.

No React, Vue or Web Component adapter is provided in Stage 5B.

---

## 2. Files created

| File | Purpose |
|---|---|
| [`button/button.css`](./button/button.css) | Button styles: three variants, native interaction states, additive focus ring, disabled treatment, forced-colors fallback. |
| [`input/input.css`](./input/input.css) | Input styles: label, control, field, helper/error row, disabled/hover/error precedence, focus overlay, forced-colors fallback. |
| [`button/button.html`](./button/button.html) | Native `<button>` reference markup: variants, disabled buttons, form actions. |
| [`input/input.html`](./input/input.html) | Native `<input>` reference markup: helper, error, disabled, hidden label, email/tel/url/decimal examples. |
| [`test/implementation.test.mjs`](./test/implementation.test.mjs) | Zero-dependency verification suite (20 tests). |
| [`test/browser-smoke.html`](./test/browser-smoke.html) | Stage 5E: dependency-free browser fixture for computed-style, DOM and association checks. |
| [`test/BROWSER-TESTING.md`](./test/BROWSER-TESTING.md) | Stage 5E: local serve, browser matrix and manual keyboard/visual runbook. |

No existing file was modified for Stage 2. The Stage 1 contracts, schema, validator, READMEs, example, six pre-existing modified docs and all three token files are unchanged.

---

## 3. Button

### Public API

| Class | Meaning |
|---|---|
| `.fc-button` | Primary action. This is the default surface. |
| `.fc-button--primary` | Optional explicit alias for the default. |
| `.fc-button--secondary` | Secondary action. |
| `.fc-button--ghost` | Low-emphasis action with a transparent resting surface. |

The element is a native `<button>`. There is no `variant` or `state` prop; the variant is a class and the state is derived by the browser. Always set an explicit `type` (`button`, `submit` or `reset`) — HTML defaults a missing `type` to `submit`.

```html
<link rel="stylesheet" href="tokens/dist/tokens.css">
<link rel="stylesheet" href="components/button/button.css">

<button class="fc-button" type="button">Primary action</button>
<button class="fc-button fc-button--secondary" type="button">Cancel</button>
<button class="fc-button fc-button--ghost" type="button">Back</button>
<button class="fc-button" type="submit" disabled>Review transfer</button>
```

Pass-through native attributes (`name`, `value`, `form`, `autofocus`, etc.) keep their platform behaviour. Disabled uses the real `disabled` attribute, not `aria-disabled`, so the control leaves the tab order and is not submitted.

### State model

| Contract state | Selector | Visual source |
|---|---|---|
| Default | `.fc-button` | `button.primary.*` |
| Hover | `.fc-button:not(:disabled):hover` | `button.primary.background-hover` |
| Active | `.fc-button:not(:disabled):active` | `button.primary.background-active` |
| Focus | `.fc-button:focus-visible` | `button.focus.*` ring |
| Disabled | `.fc-button:disabled` | `button.disabled.*` |

Secondary and Ghost override the same five states with their own background tokens.

Focus is **additive**, not a sixth axis and not a combined variant. The ring is a `::after` overlay inset by `button.focus.offset` (2px), with width `button.focus.width` (2px) and radius `radius + offset` (8px). Hover and focus can therefore coexist visually without inventing a `Hover+Focus` contract value. Disabled removes the ring entirely.

Ghost has no resting background token; the page surface shows through (`background-color: transparent`). That is the contract's explicit resolution, not a missing token. Ghost disabled also stays transparent with `button.disabled.foreground`.

### Geometry and typography

Height, inline padding, radius, font size, weight and line height all come from `--fc-button-*` tokens. Vertical padding is calculated from the height and line-height tokens rather than hardcoded:

```css
padding-block: calc((var(--fc-button-height) - var(--fc-button-line-height)) / 2);
```

This yields 10px above and below the 20px line box inside the 40px control.

---

## 4. Input

### Public API

```html
<div class="fc-input">
  <label class="fc-input__label" for="recipient-email">Recipient email</label>
  <div class="fc-input__control">
    <input
      class="fc-input__field"
      id="recipient-email"
      name="recipientEmail"
      type="email"
      autocomplete="email"
      placeholder="you@example.com"
      aria-describedby="recipient-email-helper"
      required
    >
  </div>
  <p class="fc-input__message" id="recipient-email-helper">
    We'll email a receipt to this address.
  </p>
</div>
```

| Class / attribute | Meaning |
|---|---|
| `.fc-input` | Field wrapper (label + control + message). |
| `.fc-input__label` | Visible label. Keep the `for`/`id` association. |
| `.fc-input__label--visually-hidden` | Hides the label visually while keeping it in the accessibility tree. Use instead of removing the label. |
| `.fc-input__control` | Positioning context for the focus ring. |
| `.fc-input__field` | The native `<input>`. |
| `.fc-input__message` | Helper text. |
| `.fc-input__message--error` | Error text; pair with `aria-invalid="true"` on the field. |
| `aria-invalid="true"` | The application-owned error flag. Drives the error border. |
| `aria-describedby` | Points at the helper or error element's `id`. |

Supported native types are `text`, `email`, `tel`, `number` and `url`. Supply `autocomplete` and, where useful, `inputmode`. Read-only, search, password, multiline and specialised pickers are out of contract scope.

### State precedence

```
Disabled > Error > Hover > Default
```

- **Disabled** wins over everything. It uses the disabled background, border and text tokens and removes the focus overlay. Disabled fields should not carry `aria-invalid`.
- **Error** is keyed to `aria-invalid="true"` and is declared after Hover, so hovering an invalid field keeps the error border.
- **Hover** is suppressed on disabled fields by `:not(:disabled)`.
- **Focus** is an independent overlay around the control. It is derived from `:focus-visible` (via `:has()`), is allowed together with Error, and is suppressed when the field is disabled.
- **Helper vs error** visibility is an application decision. The contract says helper text is ignored in the error state, so render one message, not both.

The field uses the native `value` attribute/property. That supports uncontrolled use directly and controlled use when the application writes the property on input and re-renders. No JavaScript is shipped, so `value`/`onChange` from the React-shaped contract examples are a consumer integration concern rather than a package API.

### Error and validation ownership

The component renders visual state only. The application must:

1. validate on blur or submit, never on every keystroke;
2. set `aria-invalid="true"` and render the error message;
3. point `aria-describedby` at the message;
4. announce a **new** error once, using a live region or an alert pattern, without re-announcing on every keystroke;
5. decide whether the helper or the error is visible; they are not shown simultaneously.

The reference markup intentionally omits `role="alert"` from the static first-paint example. The nearby comment documents that an application may add `role="alert"` when it inserts the error after validation.

---

## 5. Token compliance

| Component | Contract tokens | Consumed | Token layer |
|---|---|---|---|
| Button | 22 | 22 | `--fc-button-*` only |
| Input | 28 | 28 | `--fc-input-*` only |

Every `var()` is checked against `tokens/dist/tokens.css`, alias chains are resolved, and each resolved value is compared with the contract's recorded value. Both files also assert that no component token is missed.

No token file was edited or regenerated. The CSS contains:

- no hex colours;
- no `rgb()`/`hsl()`/`oklch()`/`lab()` values;
- no numeric `px` values in Button, and none in Input outside the visually-hidden utility;
- no token definitions, no `@import`, no external `url()`;
- no invented tokens such as `--fc-button-ghost-background`, `--fc-button-focus-radius`, `--fc-input-border-focus` or `--fc-input-error-border`.

Implementation-only values, all deliberate and visual rather than tokenised:

| Value | Why |
|---|---|
| `background-color: transparent` on Ghost | The contract states there is no Ghost resting-background token. |
| `font-family: inherit` | The token source has no font-family token; the component must inherit the page font. |
| `appearance: none`, `border: 0` on Button | Removes user-agent chrome so the token surface is the whole control. |
| `cursor: pointer` / `not-allowed` | Platform affordance, not a visual token. |
| `margin: 0`, `box-sizing: border-box` | Reset and predictable sizing at the component boundary. |
| `width: 1px; height: 1px; clip-path: inset(50%)` | Standard visually-hidden utility, isolated to `.fc-input__label--visually-hidden`. |
| `ButtonText`, `Highlight` | Forced-colors system colours; required because component tokens are ignored in forced-colors mode. |

---

## 6. Tests and results

### Commands run

```sh
node --test components/test/implementation.test.mjs
node components/validate-contracts.mjs
node tokens/check.mjs
```

### Results

| Check | Result |
|---|---|
| Implementation test suite | **20 passed, 0 failed** |
| Contract validator | **10/10 checks passed, 0 errors** |
| Token validator — structure | **20/20 passed** |
| Token validator — contrast | **69 passed, 5 exempt, 0 failed, 11 advisory** |
| Token validator — CSS | **up to date** |

The test suite covers:

- protected SHA-256 baselines for `tokens.json`, `check.mjs` and `tokens.css`;
- the approved 15/4 variant counts, 22/28 token counts and absence of a state prop;
- full token consumption, alias resolution and contract-value equality;
- no external token layer, hardcoded colour or token-covered dimension;
- no invented or forbidden tokens/variants (`danger`, `loading`, `success`, `readonly`, etc.);
- Button geometry, variant selectors, focus ring maths, disabled ordering and forced-colors rules;
- Input anatomy, typography, `Disabled > Error > Hover` source order, focus overlay, hidden-label technique and forced-colors rules;
- native Button semantics (real `<button>`, explicit `type`, non-empty label, no ARIA role fake);
- Input label/`for` association, unique ids, resolving `aria-describedby`, supported types, `autocomplete`, disabled/`aria-invalid` exclusion and hidden-label retention;
- class parity between CSS and reference markup;
- checker output for the Ghost Disabled surface and unique advisory pairs;
- browser fixture integrity, required cases and runbook links;
- both existing validators exiting successfully.

### Browser smoke check

Executed in Chromium against the reference pages served over `http://127.0.0.1:8765/`. This was a **computed-style and keyboard smoke check**, not a screenshot or visual-regression test.

Button, measured:

- 40px high, 10px/16px padding, 6px radius, 14px/500 type, 20px line height;
- Primary `rgb(37, 99, 235)` on white, Secondary `rgb(228, 228, 231)` hover, Ghost transparent, Disabled `rgb(228, 228, 231)` with `rgb(161, 161, 170)` text;
- Tab produces `:focus-visible`, a 2px `rgb(37, 99, 235)` ring at `-2px` inset with an 8px radius;
- a disabled Ghost button cannot receive focus and its overlay is `display: none`.

Input, measured:

- control 40px high, 9px/12px padding, 1px `rgb(113, 113, 122)` border, 6px radius, 14px/400 type, 20px line height;
- label 14px/500 `rgb(63, 63, 70)` with an 8px gap; helper 12px/400 `rgb(82, 82, 91)` with a 4px gap;
- error border `rgb(220, 38, 38)` and error text `rgb(153, 27, 27)` with `aria-invalid="true"`;
- disabled background/border `rgb(228, 228, 231)` with `rgb(161, 161, 170)` text;
- focus ring 2px `rgb(37, 99, 235)`, 8px radius, `-2px` inset, shown with Error still red;
- the disabled field is skipped by Tab and its overlay is `display: none`;
- the visually hidden label is 1px and clipped but still resolves through `input.labels`;
- every `for`/`id` and `aria-describedby` reference resolves.

### Reproducible browser fixture (Stage 5E)

[`test/browser-smoke.html`](./test/browser-smoke.html) is a dependency-free
manual fixture for the existing token and component CSS. Open it through the
local server procedure in [`test/BROWSER-TESTING.md`](./test/BROWSER-TESTING.md).
The page runs native DOM and `getComputedStyle` assertions in the browser and
displays pass/fail results; the Node test suite checks only fixture integrity
and required cases, not browser execution.

The fixture covers Button variants and disabled states, Default/disabled/Error
Input, helper and error associations, the visually hidden label, and enabled
focusable controls. True `:focus-visible`, Tab order and visual checks remain
manual.

### Not tested

No screen-reader run (VoiceOver/NVDA/JAWS), no visual-regression tooling, no Firefox or Safari run, no Windows High Contrast/forced-colors emulation, no mobile or touch testing, no 200% zoom/reflow run, no RTL run and no long-label/localisation stress test. The forced-colors rules are present but were not exercised in a forced-colors environment. Do not treat this as browser or assistive-technology certification.

### Browser baseline

The approved modern-browser baseline is **Chrome/Edge 105+, Safari 15.4+, Firefox 121+**. The Input focus overlay and disabled suppression require `:has()`; no transpilation or fallback is bundled. The baseline is documented in `input/README.md` and in the Input contract's `browser-baseline` limitation.

Browser verification status: the historical Chromium measurements remain manual and are not reproducible from this repository. The Stage 5E fixture provides a reproducible manual browser procedure, but no browser was run during Stage 5E; Chrome/Edge, Safari and Firefox remain **UNVERIFIED**. Forced-colours, zoom, RTL and screen-reader checks remain outside the fixture. No unrun browser result is claimed as passing.

---

## 7. Accessibility summary

Verified statically and in the Chromium smoke check:

- native `<button>` and `<input>` semantics; no `role="button"` or `role="textbox"` imitation;
- native `disabled` removes controls from interaction and tab order;
- `:focus-visible` keyboard focus is never removed without an equivalent visible ring;
- labels are associated programmatically; hidden labels remain in the accessibility tree;
- error state has both a visual border and the semantic `aria-invalid` flag;
- error/helper text is referenced with `aria-describedby`;
- the reference markup uses an explicit button `type` and a non-empty accessible name;
- forced-colors fallbacks preserve a boundary and focus indicator.

Application responsibilities remain: validation timing, error copy, error announcement, `aria-invalid`, `aria-describedby`, input type/`autocomplete`, and choosing when disabled is genuinely unavailable.

---

## 8. Contract discrepancies and follow-ups

These were found during implementation. None was silently resolved by editing a contract or token file.

1. **Ghost disabled contrast checker was corrected in Stage 5E.**
   The checker now measures Ghost Disabled against `color.surface.default` and reports **2.56:1 EXEMPT**. Primary and Secondary Disabled remain measured against `button.disabled.background` at 2.02:1 EXEMPT. The inactive-control exemption is unchanged; no result is promoted to a pass.

2. **The Input filter example terminology was corrected in Stage 5E.**
   The hidden-label example now uses `transaction-filter`, `Filter transactions` and `Filter by description` in the contract and README. It remains a text input and does not invent Search Input behaviour.

3. **The contract API is React-shaped; the implementation is native.**
   `variant`, `label`, `helperText`, `errorMessage`, `value`/`onChange` and `className` are contract-level props, not exports. CSS cannot enforce a controlled-only `value`/`onChange` contract. The native mapping is documented in both READMEs and in this file; no adapter is provided in Stage 5B. A future adapter must translate props and preserve the same classes, states and token usage.

4. **Stage 1 README disclaimers were reconciled in Stage 5B.**
   Both READMEs now link to this file and document the native HTML/CSS API. The old “no production implementation” note was removed.

5. **Controlled-input semantics are application-owned.**
   The contract's `value`/`onChange` API implies a controlled component. Native HTML supports both uncontrolled (`value` attribute/defaultValue behaviour) and controlled (property writes plus input handling) use. This is documented rather than enforced; the component ships no state library or runtime.

6. **Disabled text contrast is intentionally low.**
   Primary/Secondary disabled text is 2.02:1 and Ghost disabled text is 2.56:1. Both are exempt under WCAG 1.4.3/1.4.11 because the control is inactive. The component does not “fix” this with new tokens, because that would change the approved visual design.

7. **Browser baseline is modern evergreen.**
   The CSS uses custom properties, `calc()`, logical properties, `:focus-visible` and `:has()`. `:has()` is required for the Input focus overlay and disabled suppression (Chrome/Edge 105+, Safari 15.4+, Firefox 121+). No transpilation or fallback is included. The baseline is stated in the Input contract and README, and the Stage 5E fixture/runbook provides a reproducible manual procedure. No browser was run in Stage 5E; all three baseline browsers remain **UNVERIFIED**.

8. **Ghost/Focus label binding was corrected in Stage 5C-1.**
   Label `87:34` in variant `87:32` was rebound from `color/content/link` (`VariableID:82:101`) to `button/ghost/foreground` (`VariableID:82:160`) using one fill-binding write. The Stage 5C-1 post-write inspection confirmed the target binding, unchanged text/typography/geometry, 15 variants, 3 properties, 204/204 bindings, 22 unique `button.*` tokens, all five Ghost labels on their expected tokens, and unchanged Input/playground/collections. **FC-01 is resolved.**

9. **The static first-paint error example was corrected in Stage 5E.**
   `input.html` no longer places `role="alert"` on the initially rendered error. The nearby comment documents that an application may add `role="alert"` when it inserts the message after validation. The existing test now enforces the no-first-paint-alert rule and the insertion guidance.

10. **The duplicate inverse error-text advisory was removed in Stage 5E.**
    The generic `error-text/inverse` row was removed; the component-level `input-error-text/inverse` advisory remains and still reports 2.13:1 as unsupported inverse evidence.

11. **The validator Markdown check label was corrected in Stage 5E.**
    The check is now reported as “required sections, links and example markers”, matching what it actually verifies. It does not claim to validate README disclaimers.

---

## 9. Preservation and repository state

Confirmed after the implementation and test runs:

- Branch: `docs/foundation-baseline`; HEAD: `59c775a`.
- Token source and generated CSS hashes unchanged:
  - `tokens/tokens.json` — `68caea55e0bdf9f5cda067d7993eee91ad6cc277a7aca81a19ec566bd33c6379`
  - `tokens/dist/tokens.css` — `49cc239f4b31367df4ba060d1420a784b880861395b64172a37325526771e178`
- `tokens/check.mjs` changed by the approved Stage 5E Batch A. Its current SHA-256 is `699b1c14187fa3db84e132f52c8fee9a3a482dd78ab9582048c999982d606c46`; the previous baseline `e5cf14a0a3f33366e83903585880ac39d554030420b09011e576e16428026d7f` no longer applies.
- The six pre-existing modified docs were preserved.
- Stage 5B changed documentation/test files only: `components/button/contract.json`, `components/button/README.md`, `components/input/contract.json`, `components/input/README.md`, this file and `components/test/implementation.test.mjs`. Token hashes and production CSS/HTML remained unchanged in Stage 5B.
- Stage 5C-1 performed exactly one approved Figma write: the fill binding of Button Ghost/Focus label `87:34` was corrected. No other Figma object was changed.
- Stage 5C-2 updated repository evidence only; no token, CSS, HTML, schema or Git state changes.
- Stage 5E changed `tokens/check.mjs` (approved Batch A), Input example documentation/markup, the validator label, the test suite, and added the browser fixture/runbook. `tokens/tokens.json` and `tokens/dist/tokens.css` remain unchanged; no schema, production CSS or Git state changes.
- No staging, commit, push, branch switch, stash, reset or other Git state change was performed.
- No Figma write was performed in Stage 5C-2 or Stage 5E, and no playground page was created or modified.

Stage 2 stops here. The Figma playground and any later stage have not been started.
