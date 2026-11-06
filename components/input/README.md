# Input

**Contract 1.0.0 · Component v0.1 · Implementation: framework-agnostic CSS + native HTML (Stage 2)**

Input is FinCore's single-line text field. It renders a complete field — label, control and helper/error row — with four mutually exclusive Figma states, an independent keyboard-focus ring and 28 component tokens.

The component renders state. It does **not** validate, format, mask or submit. Those are application responsibilities.

This guide is the human-readable companion to the canonical machine contract:

- Machine contract: [`contract.json`](./contract.json)
- Implementation guide: [`../IMPLEMENTATION.md`](../IMPLEMENTATION.md)
- Component CSS: [input.css](./input.css)
- Native reference markup: [input.html](./input.html)
- Shared schema: [`../contract.schema.json`](../contract.schema.json)
- Token source: [`../../tokens/tokens.json`](../../tokens/tokens.json)
- Generated CSS: [`../../tokens/dist/tokens.css`](../../tokens/dist/tokens.css)
- Figma evidence: file `llp3APU7qaknEGJWq7vTI4`, page `1:3`, set `99:46` (4 variants, 10 properties, 176/176 bound fields)
- Illustrative composition: [`../examples/financial-form.md`](../examples/financial-form.md)

> This repository includes production CSS and native HTML reference markup. There is no React, Vue, Web Component or JavaScript runtime package; contract-level props are a mapping to native classes, attributes and browser states, not exported code.

---

## 1. What Input is

Input is a full field, not a bare `<input>`:

```text
Field
├── Top (8px gap)
│   ├── Label        14/20, weight 500, input.label.color
│   └── Control      40px high, 1px INSIDE border, 6px radius, 12px padding-x
│       └── Text Area
│           ├── Value        14/20, weight 400, input.text
│           └── Placeholder  14/20, weight 400, input.placeholder
└── Helper           12/16, weight 400, input.helper.color
```

The focus ring is an absolute sibling overlay, not a fifth state:

```text
Focus Ring  324×44 at (-2,-2), 2px OUTSIDE, radius 8
└── Control (40px high)
```

- **Four states:** Default, Hover, Error, Disabled.
- **Independent `Focused` overlay:** shown in Default, Hover and Error; suppressed by Disabled.
- **Separate `Filled` and `ShowPlaceholder`:** complementary design booleans, derived from the value in production.
- **One label slot and one helper/error slot:** no icons, affixes, counters, clear buttons or reveal controls.
- **One size:** 40px high, 6px radius, 14/20 text, 12/16 helper.
- **Five supported surfaces:** default, canvas, subtle, muted and raised.
- **Inverse is unsupported.** The full field fails contrast on dark surfaces.

The Figma 320px width is a demo literal. Production width belongs to layout.

---

## 2. When to use Input

### Use Input for

- Single-line text entry: `text`, `email`, `tel`, `number` and `url`.
- Financial form fields such as recipient email, transfer amount, account reference and payee name.
- Fields that need a persistent visible label and supporting helper copy.
- Fields that show a post-validation error in the same slot as the helper, so the message cannot be missed.
- Disabled fields that are genuinely unavailable, with the reason explained nearby.
- Required fields, when the application supplies the required semantics and a visible required indication.

### Do not use Input for

| Do not use it for | Why | Use instead |
|---|---|---|
| Placeholder-only fields | The placeholder is not a label; it disappears on entry and is not a reliable accessible name | A visible label, or a visually hidden but programmatically associated label |
| Password entry | Needs a reveal affordance and masking; there is no icon system | A future Password Input |
| Search | Needs a leading icon and clear affordance | A future Search Input |
| Multiline text | Needs separate height, resize and overflow rules | A future Textarea |
| Select / dropdown | Needs option semantics and a popup | A future Select |
| OTP / currency / PIN | Needs grouped cells, formatting or masking | Future specialised financial components |
| Inverse or dark surfaces | Label 1.70:1, helper 2.29:1, error 2.13:1, hover border 2.29:1 | A supported light surface |
| Validation while typing | Interrupts entry and announces errors before the user is finished | Validate on blur or submit |
| Error by red border only | Colour alone is not an accessible error signal | `errorMessage` plus the red border |
| ReadOnly | No visual, token or accessibility contract exists | Native disabled only when the field is unavailable |
| Success, warning or info states | Only Default, Hover, Error and Disabled exist | Helper copy, or a new state and token contract |
| A hidden label with no accessible name | Removes the field's name | `hideLabel` with a visually hidden label |
| Figma booleans as runtime props | Lets applications fake focus or desynchronise value, placeholder and error | Derive them from value, focus and `errorMessage` |

---

## 3. Properties

### Figma design properties

| Property | Type | Default | Production translation |
|---|---|---|---|
| `State` | VARIANT | `Default` | **Derived.** `Disabled > Error > Hover > Default`; not a prop |
| `Label` | TEXT | `Email address` (demo) | `label`: required string |
| `Value` | TEXT | `ada@fincore.dev` (demo) | `value`: required controlled string; default `""` |
| `Placeholder` | TEXT | `you@example.com` (demo) | `placeholder`: optional string; never a label |
| `Helper` | TEXT | `We never share this.` (demo) | `helperText` plus a separate `errorMessage`; error replaces helper |
| `Focused` | BOOLEAN | `false` | **Derived** from `:focus-visible`; suppressed by Disabled |
| `Filled` | BOOLEAN | `false` | **Derived** from `value.length > 0` |
| `ShowPlaceholder` | BOOLEAN | `true` | **Derived** from `value.length === 0` |
| `ShowLabel` | BOOLEAN | `true` | `hideLabel` (inverse); the label stays accessible |
| `ShowHelper` | BOOLEAN | `true` | **Derived** from helper/error presence; ignored in Error |

### Production API

The API below is the contract-level API. It is not an existing package export.

| Prop | Type | Default | Required | Notes |
|---|---|---|---|---|
| `id` | `string` | — | Yes | Stable id for label and error/helper associations |
| `label` | `string` | — | Yes | Visible and accessible name; must be non-empty |
| `value` | `string` | `""` | Yes | Controlled value |
| `onChange` | change handler | — | Yes | Updates the value; does not validate per keystroke |
| `placeholder` | `string` | — | No | Example or format hint, never a label |
| `helperText` | `string` | — | No | Supporting copy; replaced by the error |
| `errorMessage` | `string` | — | No | Sets Error and replaces helper; the application sets the error association and ARIA invalid state |
| `disabled` | `boolean` | `false` | No | Native disabled; wins over Error, Hover and Focused |
| `type` | `"text" \| "email" \| "tel" \| "number" \| "url"` | `"text"` | No | Only these five share the visual |
| `autoComplete` | `string` | — | No | The application supplies the correct token |
| `required` | `boolean` | `false` | No | Native required plus a visible indication |
| `name` | `string` | — | No | Native form field name |
| `inputMode` | `string` | — | No | Native keyboard hint, e.g. `decimal` |
| `onBlur` | blur handler | — | No | A valid place to run validation |
| `hideLabel` | `boolean` | `false` | No | Visually hides the label; never removes it |
| `className` | `string` | — | No | Layout only |
| native attributes | `InputHTMLAttributes` excluding managed props | — | No | `maxLength`, `pattern`, `min`, `max`, `step`, `aria-*`, `data-*` |

**Do not expose** `state`, `focused`, `filled`, `showPlaceholder` or `showHelper`. They are design-time concepts. The single visual-content exception is `hideLabel`, which maps `ShowLabel` but must preserve the accessible name.

### Native HTML/CSS API

The framework-agnostic implementation uses the following mapping. No JavaScript runtime is shipped.

| Contract-level prop / concept | Native implementation |
|---|---|
| `id` | Native `id` on the `<input>`; the label's `for` references it |
| `label` | `<label class="fc-input__label" for="…">` text |
| `hideLabel` | Add `fc-input__label--visually-hidden`; the label remains in the accessibility tree |
| `value` | Native `value` attribute/property; the application controls updates |
| `onChange` | Application-owned `input` listener; no runtime is shipped |
| `placeholder` | Native `placeholder`; never the label |
| `helperText` | `p.fc-input__message` with an id, referenced by `aria-describedby` |
| `errorMessage` | Application sets `aria-invalid="true"`, renders `p.fc-input__message--error`, and connects it with `aria-describedby` and/or `aria-errormessage` |
| `disabled` | Native `disabled`; wins over Error, Hover and Focus; do not add `aria-invalid` |
| `type` | Native supported type: `text`, `email`, `tel`, `number` or `url` |
| `autoComplete`, `name`, `required`, `inputMode` | Native attributes supplied by the application |
| `onBlur` | Application-owned blur listener; a valid place to validate |
| `className` | Native `class` attribute for layout only |
| `state`, `focused`, `filled`, `showPlaceholder`, `showHelper` | Not runtime props; derive from native interaction, the value and application error state |

---

## 4. States and precedence

### Precedence

```text
Disabled  >  Error  >  Hover  >  Default
```

**Focus is orthogonal** to State in Default, Hover and Error. Disabled suppresses it.

### State matrix

| State | Fill | Border | Value / placeholder | Helper |
|---|---|---|---|---|
| **Default** | `input.background` | `input.border` | `input.text` / `input.placeholder` | `input.helper.color` |
| **Hover** | `input.background` | `input.border-hover` | `input.text` / `input.placeholder` | `input.helper.color` |
| **Error** | `input.background` | `input.border-error` | `input.text` / `input.placeholder` | `input.text-error` |
| **Disabled** | `input.background-disabled` | `input.border-disabled` | `input.text-disabled` / `input.text-disabled` | `input.helper.color` |

### Focus combinations

| Combination | Supported? | Result |
|---|---|---|
| Default + Focused | Yes | Default border + focus ring |
| Hover + Focused | Yes | Hover border + focus ring |
| Error + Focused | Yes | Red border, red message + blue ring |
| Disabled + Focused | **No** | Focused is ignored; no ring |
| Error + Hover | **No** | Error border persists; no hover border |
| Disabled + Error | **No** | Disabled wins; no error border or message |
| Disabled + Hover | **No** | Disabled wins; no hover border |

`Focused` is a boolean overlay, not a fifth State. Do not create `State=Focus`.

### Filled and ShowPlaceholder

`Filled` and `ShowPlaceholder` are **complementary**, not independent. Figma needs two booleans because it cannot negate a boolean.

| Field | `Filled` | `ShowPlaceholder` | Result |
|---|---|---|---|
| Empty | `false` | `true` | Placeholder only |
| Filled | `true` | `false` | Value only |
| Invalid overlap | `true` | `true` | Value and placeholder overlap — prohibited |
| Empty with no hint | `false` | `false` | No text layer — prohibited |

In production, derive both from `value.length`. Do not expose either boolean.

### ShowLabel and ShowHelper

- `ShowLabel=false` hides the label row and collapses the gap. In production, `hideLabel` must render the label **visually hidden**, not absent. The field always needs an accessible name.
- `ShowHelper=false` hides the helper row and collapses the gap in Default, Hover and Disabled.
- **`ShowHelper` is ignored in Error.** The error message is the non-colour signal and cannot be hidden.
- Error copy and helper copy are never stacked. Error replaces helper in the same row.

---

## 5. Validation and application responsibilities

Input renders state; it does not decide validity.

### The component does

- Render `label`, `value`, `placeholder`, `helperText` or `errorMessage`.
- Resolve Disabled > Error > Hover > Default.
- Show the focus ring when focused, except when disabled.
- Keep the error message visible in Error.
- Present `errorMessage` visually in the helper row. It does not set `aria-invalid` or the error association itself; those are application responsibilities.

### The application does

- Decide when a value is invalid and what the message says.
- Validate on blur or submit, **never while typing**.
- Move focus to the first invalid field.
- Supply `aria-invalid`, `aria-describedby` and/or `aria-errormessage`, and announce new errors once.
- Supply `type`, `inputMode`, `autoComplete`, `name`, `required` and constraints.
- Explain why a disabled field is unavailable.
- Clear or withhold error presentation when a field becomes disabled.
- Own async validation, formatting, masking and submission.

### Recommended error flow

1. User edits the field. No error is shown.
2. User blurs or submits.
3. Application validates and sets `errorMessage`.
4. Input renders Error: red border + error copy; helper copy is replaced.
5. Application moves focus to the first invalid field, producing Error + Focused if it was not already focused.
6. When the value becomes valid, the application clears `errorMessage`; the helper returns.

Do not validate on every keystroke. Do not show a red border without a message.

---

## 6. Token dependencies

Input consumes 28 component tokens. Colour tokens alias Semantic roles; geometry and typography tokens alias Primitives because no semantic geometry layer exists yet.

| Token | CSS variable | Resolves to | Role |
|---|---|---|---|
| `input.height` | `--fc-input-height` | 40px | Control height |
| `input.padding-x` | `--fc-input-padding-x` | 12px | Horizontal padding |
| `input.radius` | `--fc-input-radius` | 6px | Control radius |
| `input.border-width` | `--fc-input-border-width` | 1px | Border width, INSIDE |
| `input.font-size` | `--fc-input-font-size` | 14px | Value and label size |
| `input.line-height` | `--fc-input-line-height` | 20px | Value and label line height |
| `input.font-weight` | `--fc-input-font-weight` | 400 | Value and helper weight |
| `input.label-gap` | `--fc-input-label-gap` | 8px | Label-to-control gap |
| `input.helper-gap` | `--fc-input-helper-gap` | 4px | Control-to-helper gap |
| `input.focus.color` | `--fc-input-focus-color` | `#2563EB` | Focus ring colour |
| `input.focus.width` | `--fc-input-focus-width` | 2px | Ring width |
| `input.focus.offset` | `--fc-input-focus-offset` | 2px | Ring offset/padding |
| `input.focus.radius` | `--fc-input-focus-radius` | 8px | Concentric ring radius (6 + 2) |
| `input.background` | `--fc-input-background` | `#FFFFFF` | Control fill |
| `input.border` | `--fc-input-border` | `#71717A` | Default boundary |
| `input.text` | `--fc-input-text` | `#18181B` | Value |
| `input.placeholder` | `--fc-input-placeholder` | `#71717A` | Placeholder |
| `input.border-hover` | `--fc-input-border-hover` | `#52525B` | Hover boundary |
| `input.border-error` | `--fc-input-border-error` | `#DC2626` | Error boundary |
| `input.text-error` | `--fc-input-text-error` | `#991B1B` | Error message |
| `input.background-disabled` | `--fc-input-background-disabled` | `#E4E4E7` | Disabled fill |
| `input.border-disabled` | `--fc-input-border-disabled` | `#E4E4E7` | Disabled boundary (matches fill) |
| `input.text-disabled` | `--fc-input-text-disabled` | `#A1A1AA` | Disabled value and placeholder |
| `input.label.color` | `--fc-input-label-color` | `#3F3F46` | Label |
| `input.label.font-weight` | `--fc-input-label-font-weight` | 500 | Label weight |
| `input.helper.color` | `--fc-input-helper-color` | `#52525B` | Helper text |
| `input.helper.font-size` | `--fc-input-helper-font-size` | 12px | Helper and error size |
| `input.helper.line-height` | `--fc-input-helper-line-height` | 16px | Helper and error line height |

### Collapsed roles

These are deliberately reused, not missing:

- Label size and line height reuse `input.font-size` and `input.line-height`.
- Helper weight reuses `input.font-weight`.
- Error text size and line height reuse `input.helper.font-size` and `input.helper.line-height`.
- Disabled placeholder colour reuses `input.text-disabled`.
- Hover and Error change only the border (and, for Error, the helper text).
- Focus does not change the border; the ring is separate.
- Disabled label and helper keep their normal colours; only the control is muted.

### Token rules

- Consume only `input.*` tokens. Do not consume `color.*`, `blue.*`, `red.*`, `neutral.*`, `space.*`, `radius.*`, `font.*` or `size.*` directly.
- Do not hardcode values that a token covers.
- Do not reuse `button.focus.*` for Input; Input has its own focus tokens, including `input.focus.radius`.
- Do not introduce a success, warning, readOnly, icon or stale error-border token without a token-source change and a new contract version.
- Theme overrides belong at the token layer and require revalidation of all 41 gated contrast pairs.

---

## 7. Accessibility

### Design requirements

- **Target size:** the control is 40px high, above the 24px minimum.
- **Focus:** 2px ring at 2px offset, drawn outside, 8px concentric radius, at least 3:1 on every supported surface.
- **Text contrast:** value, placeholder, label, helper and error text meet 4.5:1 on every supported surface or control fill.
- **Boundary contrast:** default, hover, error and focus boundaries meet 3:1 against the page surface and the control fill.
- **Error not colour-only:** red border **and** a text message. The message is always visible in Error.
- **Label separate from placeholder:** the placeholder is never the label.
- **Supported surfaces:** default, canvas, subtle, muted and raised.
- **Inverse unsupported:** label 1.70:1, helper 2.29:1, error 2.13:1, hover border 2.29:1.
- **Disabled exempt:** value 2.02:1 and border 1.00:1. These are exempt because the control is inactive, not passing.

### Production requirements

- **Label association.** Use `<label for>` or `aria-labelledby`. The label text is the accessible name.
- **Visually hidden label.** When `hideLabel` is true, hide it visually, not with `display:none` or `aria-hidden`.
- **Placeholder is not a label.** It may be an example or format hint only.
- **Helper association.** Connect helper text with `aria-describedby`.
- **Error association.** Set `aria-invalid="true"` and connect the error with `aria-describedby` and/or `aria-errormessage`.
- **Error announcement.** Announce new errors once, on blur or submit, not on every keystroke.
- **Validation timing.** Never validate while typing.
- **Type and inputMode.** Use one of the five supported types and an appropriate keyboard hint.
- **Autocomplete.** Supply the correct token for the field's purpose.
- **Keyboard.** Tab reaches the field in DOM order, native typing works, and Enter submits the form where the form expects it. Disabled removes the field from the tab order. Do not add custom key handlers, keyboard traps or a roving tabindex.
- **Required.** Use native `required` and a visible indication that is not a bare asterisk.
- **Disabled.** Use native `disabled`, not `aria-disabled` alone and not `readOnly` as a substitute. A disabled field must not present an error or `aria-invalid`.
- **Focus visible.** Show the ring for keyboard focus; never remove it without an equivalent.
- **Text resize.** Use `min-height` rather than a fixed height; support 200% zoom and text-spacing overrides.
- **Long values.** Keep the stored value intact; truncate visually with ellipsis or scroll horizontally.
- **Forced colours.** Preserve a visible boundary and focus indicator with system colours.
- **Autofill.** Browser autofill styling is not modelled; verify legibility and ring visibility.
- **No validation inside the component.** No rules, masking, currency formatting, async lookup or submit logic.

### Contrast summary

| Pair | Ratios (default / canvas / subtle / muted / raised) | Status |
|---|---|---|
| Value on control | 17.72 | Pass |
| Placeholder on control | 4.83 | Pass |
| Label | 10.44 / 10.01 / 9.50 / 8.23 / 10.44 | Pass |
| Helper | 7.73 / 7.41 / 7.03 / 6.09 / 7.73 | Pass |
| Error text | 8.31 / 7.96 / 7.56 / 6.55 / 8.31 | Pass |
| Default border | 4.83 / 4.63 / 4.40 / 3.81 / 4.83 | Pass |
| Hover border | 7.73 / 7.41 / 7.03 / 6.09 / 7.73 | Pass |
| Error border | 4.83 / 4.63 / 4.39 / 3.81 / 4.83 | Pass |
| Focus ring | 5.17 / 4.95 / 4.70 / 4.07 / 5.17 | Pass |
| Disabled text on disabled fill | 2.02 | Exempt |
| Disabled border on disabled fill | 1.00 | Exempt |
| Disabled fill on white | 1.27 | Advisory, visual only |
| Inverse label / helper / error | 1.70 / 2.29 / 2.13 | Advisory — unsupported |
| Inverse hover border | 2.29 | Advisory — unsupported |

**41/41 gated pairs pass** on the five supported surfaces. Disabled pairs are exempt; inverse is measured and reported but unsupported.

### Browser support

The approved modern-browser baseline is:

| Browser | Minimum version | Status |
|---|---|---|
| Chrome / Edge | 105+ | Documented; verification pending |
| Safari | 15.4+ | Documented; verification pending |
| Firefox | 121+ | Documented; verification pending |

The Input focus overlay and disabled suppression use `:has()`. No transpilation or fallback is bundled. A browser not listed here is outside the approved baseline. Actual browser results are recorded in [`../IMPLEMENTATION.md`](../IMPLEMENTATION.md); unrun browsers are marked **UNVERIFIED**, never passed.

---

## 8. Customisation

### Allowed

- Change label, value, placeholder, helper and error copy. All are application-owned.
- Control width and responsive behaviour through layout; 320px is not a production width.
- Use `text`, `email`, `tel`, `number` or `url` with the matching `inputMode` and `autoComplete`.
- Set `required`, `name`, `id`, `maxLength`, `pattern` and other native constraints.
- Set `hideLabel` when the visual design needs no label, provided it remains visually hidden and programmatically associated.
- Supply `helperText`, `errorMessage`, `onBlur` validation and form-level validation.
- Override `input.*` component token values at the theme layer, preserving the alias chain and revalidating all 41 gated pairs.
- Use `className` for layout only.

### Forbidden

- Hardcoding colours, radii, heights, padding, gaps, font sizes or weights.
- Changing the 40px height, 6px radius, 1px border, 12px padding, 8px label gap or 4px helper gap.
- Using the placeholder as the label, or hiding the label without an accessible name.
- Hiding the error message, stacking helper and error, or signalling error with colour alone.
- Adding a success, warning, info, readOnly, loading or clearable state.
- Adding icons, password reveal, search clear, counters or inline actions.
- Using Input for password, search, textarea, select, OTP, currency or PIN.
- Placing the full field on inverse or dark surfaces.
- Exposing `focused`, `filled`, `showPlaceholder` or `showHelper` as public props.
- Running validation, formatting or masking inside the component.
- Setting `aria-invalid` on a disabled field or presenting an error on a disabled field.
- Using disabled as a validation strategy.
- Fixing the width at 320px.
- Using `readOnly` as a substitute for disabled.
- Reusing another field's id or label association.

### Theming

A consumer may remap semantic roles so `input.background`, `input.border`, `input.text`, `input.placeholder`, `input.border-error`, `input.text-error` and `input.focus.color` resolve to a brand palette. Every override must preserve the component-token alias chain and be revalidated for all 41 gated pairs, including hover, error, focus, label, helper and placeholder.

Light theme is the only implemented theme. Dark mode is not available and must not be simulated by inverting values.

---

## 9. Composition

### Canonical

- Render the full field: label above, control in the middle, helper or error below.
- Use one label per field and one field per value.
- Keep the label visible unless the design explicitly requires a visually hidden label.
- Let the error replace the helper copy in the same row.
- Pair fields with Button for submission and a secondary cancel action.
- Validate on blur or submit, then move focus to the first invalid field.
- Use helper text for format guidance and constraints before an error occurs.
- Group related fields with application-level structure such as `fieldset`/`legend` where required.
- Keep a stable id for each field.

### Forbidden

- Placeholder-only fields.
- A label hidden with `display:none` or `aria-hidden`.
- Helper and error shown at the same time.
- A red border without an error message.
- An Input with an embedded Button, icon, clear action or password reveal.
- Two fields sharing an id.
- An inverse or dark surface.
- A success or warning treatment.
- Validation on every keystroke.
- A fixed 320px width.

### Illustrative composition

The financial-form example shows Input and Button together:

- [`../examples/financial-form.md`](../examples/financial-form.md)

It is illustrative only. No production form or component package exists.

---

## 10. Invalid configurations

| Invalid configuration | Why | Correct |
|---|---|---|
| Placeholder-only field | Not a label; disappears on entry | Add `label` |
| Helper and error stacked | Conflicting guidance; breaks the anatomy | Error replaces helper |
| `<Input focused />` | Focus is derived, not a prop | Derive from `:focus-visible`; suppress when disabled |
| `<Input filled showPlaceholder />` | Value and placeholder overlap | Derive both from the value |
| Error plus hover border | No independent Error+Hover treatment | Keep the error border |
| Disabled plus error message | Disabled wins; no editable-invalid presentation | Clear or withhold the error |
| Disabled plus focus ring | Disabled suppresses focus | Ignore `Focused`; render no ring |
| `ShowHelper=false` in Error | Hides the non-colour error signal | Keep the error message visible |
| Inverse surface | Full field fails contrast | Use a supported light surface |
| `type="password"` | No reveal or masking contract | Wait for Password Input |
| `readOnly` | No visual or semantic contract | Use disabled only when unavailable |
| Validate on every change | Interrupts entry; announces too early | Validate on blur or submit |
| Red border with no message | Colour-only error | Always set `errorMessage` |
| Hidden label with no accessible name | Field loses its name | Visually hidden label or equivalent association |
| `aria-invalid` on disabled | Disabled fields are not editable-invalid | Withhold validation while disabled |
| Fixed 320px width | Demo literal, not responsive | Let the field fill its container |
| Invented success state | No success state or token mapping | Helper copy or a new contract |
| Exposing Figma booleans as props | Desynchronises value, placeholder, focus and error | Derive them |

More invalid and valid examples are in [`contract.json`](./contract.json).

---

## 11. Test requirements

### Visual

- Four states resolve to the expected fill, border, text, placeholder, label and helper tokens.
- Focus ring appears on Default, Hover and Error; absent on Disabled.
- Error + Focused shows red border, red message and blue ring together.
- Control 40px high, radius 6px, border 1px INSIDE, padding 12px, label gap 8px, helper gap 4px.
- Value 14/20 weight 400; label 14/20 weight 500; helper/error 12/16 weight 400.
- Empty vs filled: placeholder only vs value only, no overlap.
- `ShowLabel=false` and `ShowHelper=false` collapse their rows; Error keeps the message.
- 44 bound fields per variant, 176/176 total, zero unbound paints, zero primitive/Semantic bypasses.

### Behaviour

- Disabled wins over Error, Hover, Default and Focused.
- Error + Hover keeps the error border; no hover border.
- `ShowHelper` is ignored in Error.
- Filled/ShowPlaceholder never overlap.
- `ShowLabel` hides the visual label; the accessible name remains in production.
- `ShowHelper` hides the helper in Default, Hover and Disabled.
- Label, value, placeholder and helper overrides work without losing token bindings.
- Focus persists across Default/Hover/Error; Disabled removes it.
- The component does not validate an invalid value without `errorMessage`.
- The controlled value follows the parent; there is no hidden second source of truth.

### Accessibility

- Programmatic label association; `hideLabel` keeps the accessible name.
- Placeholder is not the accessible name.
- Helper is connected with `aria-describedby`.
- Error sets `aria-invalid` and is connected with `aria-describedby`/`aria-errormessage`.
- Error is announced once, not per keystroke.
- Type, `inputMode` and `autoComplete` match the field purpose.
- Required is exposed and visibly explained.
- Disabled is native, not focusable, and presents no error.
- Focus ring is visible, unclipped and ≥3:1 on every supported surface.
- Keyboard-only tab order follows DOM order; Enter submits without a trap; disabled fields are skipped.
- 41/41 gated contrast pairs pass; disabled exempt; inverse advisory.
- 200% zoom and text-spacing overrides do not clip.
- Forced-colors mode keeps a boundary and focus indicator.

### Tokens

- Every reference is an `input.*` token; zero primitive/Semantic references; zero hardcoded values covered by a token.
- All 28 dependencies exist, resolve to the stated values and map to the stated `--fc-*` variables.
- Every variant uses the tokens in its `stateMapping`.
- `input.focus.radius` equals `input.radius` plus `input.focus.offset` (6 + 2 = 8).
- No stale error-border, border-focus, success, warning, readOnly or icon token exists.

### Regression

- Baseline snapshot of the four states and focus overlays.
- Protected token hashes unchanged.
- Figma set still has 4 variants, 10 properties, the same variant IDs and 44 bound fields per variant.
- 41/41 gated pairs still pass; inverse remains advisory and unsupported.
- Button `87:37`, all 195 foundation variables and every page remain unchanged.

---

## 12. Known limitations

1. **Error + Hover** is not modelled; the error border persists.
2. **Disabled + Error** is not modelled; disabled wins.
3. **Disabled + Focused** is not a visible combination; the ring is suppressed.
4. **Flat State axis plus boolean Focus.** There is no `State=Focus` and no combined Error+Hover/Disabled+Error variant.
5. **Shared Helper copy.** Figma's Helper carries both helper and error copy; production exposes `helperText` and `errorMessage` separately.
6. **Figma booleans.** `Filled` and `ShowPlaceholder` are separate because Figma cannot negate a boolean; production derives both.
7. **ShowHelper ignored in Error.** The error row cannot be hidden.
8. **Ring position literal.** `-2,-2` because Figma cannot bind x/y; the offset token drives ring padding and size.
9. **320px width.** Demo literal; no width or size token.
10. **Font family not tokenised.** IBM Plex Sans is a Figma text property.
11. **No icons.** No adornment, clear button or password reveal.
12. **Unsupported types.** Password, search, textarea, select, OTP, currency and PIN are out of scope.
13. **Validation is application-owned.** No rules, formatting, masking, debouncing or submission.
14. **Inverse unsupported.** The full field fails contrast on inverse/dark surfaces.
15. **Disabled is visually weak.** 2.02:1 text and no visible boundary; exempt, not accessible.
16. **No success state.** Positive feedback cannot be expressed inside Input.
17. **Autofill and forced colours are not modelled** with tokens.
18. **Dark mode not implemented.**
19. **ReadOnly not modelled.**

---

## 13. Examples

### Valid

```tsx
<Input
  id="recipient-email"
  label="Recipient email"
  type="email"
  autoComplete="email"
  value={email}
  onChange={(event) => setEmail(event.target.value)}
  helperText="We'll email a receipt to this address."
  placeholder="you@example.com"
  required
/>
```

```tsx
<Input
  id="amount"
  label="Amount (USD)"
  inputMode="decimal"
  value={amount}
  onChange={(event) => setAmount(event.target.value)}
  helperText="Enter an amount between 10.00 and 5,000.00."
  errorMessage="Enter an amount of at least 10.00."
/>
```

`errorMessage` sets Error and replaces the helper. The application sets `aria-invalid` and associates the message. If focus moves here after submit, the field renders Error + Focused: red border, red message and blue ring.

```tsx
<Input
  id="transaction-filter"
  label="Filter transactions"
  hideLabel
  value={query}
  onChange={(event) => setQuery(event.target.value)}
  placeholder="Filter by description"
/>
```

`hideLabel` hides the visual row but keeps the label programmatically associated. The placeholder is still not the label.

```tsx
<Input
  id="account-number"
  label="Account number"
  value={accountNumber}
  onChange={() => {}}
  helperText="Selected from the account above."
  disabled
/>
```

Disabled wins over hover, focus and error. The reason for unavailability is explained in helper copy.

### Invalid

```tsx
// Placeholder-only: no accessible name.
<Input id="email" placeholder="Email address" value={email} onChange={setEmail} />

// Helper and error stacked instead of replaced.
<Input id="email" label="Email" helperText="We never share this." errorMessage="Enter a valid email." />

// Figma boolean exposed as a runtime prop.
<Input id="email" label="Email" focused filled showPlaceholder />

// Error hidden by a helper-visibility prop.
<Input id="email" label="Email" errorMessage="Enter a valid email." showHelper={false} />

// Value and placeholder overlap.
<Input id="email" label="Email" value="ada@fincore.dev" filled showPlaceholder />

// Unsupported type.
<Input id="password" label="Password" type="password" value={password} onChange={setPassword} />

// Validation on every keystroke.
onChange={(event) => { setValue(event.target.value); setError(validate(event.target.value)); }}

// Error presented on a disabled field.
<Input id="amount" label="Amount" value={amount} onChange={() => {}} errorMessage="Required" disabled />
```

### Production checklist

An implementation is ready only when:

- The full field renders from `input.*` tokens with no hardcoded values covered by a token.
- Default, Hover, Error, Disabled, Default+Focused, Hover+Focused and Error+Focused render correctly.
- Disabled suppresses the ring and wins over Error/Hover.
- Error + Hover keeps the error border; `ShowHelper` is ignored in Error.
- Filled and placeholder never overlap.
- Label association, placeholder separation, `aria-invalid`, error/helper description and announcement pass.
- Type, `inputMode`, `autoComplete`, `required` and disabled semantics match the field purpose.
- The 28 dependencies match the token source and generated CSS.
- 41/41 gated contrast pairs pass; inverse remains unsupported.
- No unsupported type, state, icon, validation logic or fixed 320px width exists.
