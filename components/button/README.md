# Button

**Contract 1.0.0 · Component v0.1 · Implementation: framework-agnostic CSS + native HTML (Stage 2)**

Button is FinCore's action control. It has one text label, three visual variants and five mutually exclusive Figma states. It is 40px high, borderless, and uses only `button.*` component tokens.

This guide is the human-readable companion to the canonical machine contract:

- Machine contract: [`contract.json`](./contract.json)
- Implementation guide: [`../IMPLEMENTATION.md`](../IMPLEMENTATION.md)
- Component CSS: [button.css](./button.css)
- Native reference markup: [button.html](./button.html)
- Shared schema: [`../contract.schema.json`](../contract.schema.json)
- Token source: [`../../tokens/tokens.json`](../../tokens/tokens.json)
- Generated CSS: [`../../tokens/dist/tokens.css`](../../tokens/dist/tokens.css)
- Figma evidence: file `llp3APU7qaknEGJWq7vTI4`, page `1:3`, set `87:37` (15 variants, 204/204 bindings; Ghost/Focus corrected to `button.ghost.foreground`)
- Illustrative composition: [`../examples/financial-form.md`](../examples/financial-form.md)

> This repository includes production CSS and native HTML reference markup. There is no React, Vue, Web Component or JavaScript runtime package; contract-level props are a mapping to native classes, attributes and browser states, not exported code.

---

## 1. What Button is

Button is a native action control with:

- **Three variants:** Primary, Secondary, Ghost.
- **Five Figma states:** Default, Hover, Active, Focus, Disabled.
- **One editable label** and no icons.
- **One size:** 40px high, 6px radius, 16px horizontal padding, 14/20 medium text.
- **One focus treatment:** a 2px ring at a 2px offset, drawn outside the surface.

Primary is the strongest action. Secondary is a quieter filled alternative. Ghost is the lowest-emphasis action and is transparent at rest.

The product contract is deliberately narrow. Adding a danger, loading, icon-only, toggle, size or full-width variant is a design-system change, not an implementation detail.

---

## 2. When to use Button

### Use Button for

- The single strongest action in a form, dialog, panel or review step: “Review transfer”, “Save changes”, “Continue”.
- A secondary, non-destructive alternative in the same decision group: “Cancel”, “Back”.
- A low-emphasis action in a dense toolbar, row or panel where a filled surface would compete with content.
- Native form submission with `type="submit"`.
- A genuinely unavailable action, with the reason explained in surrounding content.

### Do not use Button for

| Do not use it for | Why | Use instead |
|---|---|---|
| Navigation to another page or site | A button that changes location breaks link semantics, history, open-in-new-tab and assistive-technology expectations | A semantic link, or a future Link component |
| An icon-only action | There is no icon system or icon-only variant; the visible label is the required accessible name | A text label; wait for an icon-button contract |
| Loading, progress or a spinner | No loading state, spinner or async contract exists | Keep the label stable, guard duplicate submission and announce status in a separate live region |
| Destructive actions | There is no danger or destructive variant | Do not restyle Primary red; request a destructive variant |
| Toggles, pressed states or segmented selection | No pressed/selected state and no `aria-pressed` contract | A future Toggle, Switch or Segmented Control |
| Two competing primary actions | It destroys the hierarchy the variant exists to create | One Primary plus Secondary or Ghost |
| Ghost on an inverse or dark surface | Ghost text is 1.00:1 on `color.surface.inverse` | A supported light surface, or design review for a new inverse contract |
| A disabled button as form validation | A disabled control cannot receive focus or explain what is missing | Keep the action enabled and validate on submit or blur |

---

## 3. Anatomy and geometry

```text
Button (non-focus)
└── Surface (the component frame)
    └── Label (single line, 14/20, weight 500)

Button (Focus)
└── Focus Ring (component frame, 2px OUTSIDE, 2px padding)
    └── Surface
        └── Label
```

- The label is the only child. There is no icon slot, badge, counter or nested interactive element.
- The default demo label is “Button”; its rendered width is 76px. Production width follows the label.
- Focus variants are 80×44 at the demo label because the ring adds 2px on each side. The inner surface remains 40px high.
- Ghost has no fill at rest. The page surface shows through.

| Property | Value | Token |
|---|---|---|
| Control height | 40px | `button.height` |
| Horizontal padding | 16px | `button.padding-x` |
| Corner radius | 6px | `button.radius` |
| Label font size | 14px | `button.font-size` |
| Label line height | 20px | `button.line-height` |
| Label weight | 500 | `button.font-weight` |
| Focus ring width | 2px | `button.focus.width` |
| Focus ring offset | 2px | `button.focus.offset` |
| Focus ring outer radius | 8px (6 + 2) | No Button token; documented literal |
| Vertical padding | 10px | No token; derived from 40px height and 20px line height |
| Border | none | Button is borderless |
| Focus ring stroke alignment | OUTSIDE | Figma geometry property |

### Documented literals

These are known gaps, not invitations to add arbitrary values:

1. **Vertical padding 10px.** No vertical padding token exists.
2. **Focus ring outer radius 8px.** No Button focus-radius token exists. Input has `input.focus.radius`; Button does not.
3. **Stroke alignment OUTSIDE.** A Figma geometry property, not a token.
4. **Font family IBM Plex Sans Medium.** A Figma text property; no font-family token exists.
5. **Ghost default background transparent.** There is no Ghost default background token.
6. **Width.** No width or min-width token exists; width follows the label or layout.

---

## 4. Properties

### Figma design properties

| Property | Type | Values / default | Production translation |
|---|---|---|---|
| `Variant` | VARIANT | `Primary` (default), `Secondary`, `Ghost` | `variant` prop: `"primary"`, `"secondary"`, `"ghost"`; default `"primary"` |
| `State` | VARIANT | `Default` (default), `Hover`, `Active`, `Focus`, `Disabled` | **Derived, not a prop.** Native interaction and `disabled` resolve the state |
| `Label` | TEXT | Default `Button` (demo copy) | `label` prop: required non-empty string |

### Production API

The API below is the contract-level API. It is not an existing package export.

| Prop | Type | Default | Required | Notes |
|---|---|---|---|---|
| `variant` | `"primary" \| "secondary" \| "ghost"` | `"primary"` | No | Only these three values |
| `label` | `string` | — | Yes | Visible and accessible name; must be non-empty |
| `disabled` | `boolean` | `false` | No | Native disabled; suppresses hover, active and focus |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | No | Explicit safe default; set `"submit"` for forms |
| `onClick` | mouse event handler | — | No | Must not fire when disabled |
| `className` | `string` | — | No | Layout only: spacing, alignment, width |
| native attributes | `ButtonHTMLAttributes` excluding `children`, `disabled`, `type` | — | No | `id`, `name`, `value`, `form`, `autoFocus`, `aria-*` |

**Do not expose `state`.** Allowing a caller to set `state="hover"` or `state="focus"` creates a second source of truth and lets an application fake interaction. The state is derived from `:hover`, `:active`, `:focus-visible` and `disabled`.

### Native HTML/CSS API

The framework-agnostic implementation uses the following mapping. No JavaScript runtime is shipped.

| Contract-level prop / concept | Native implementation |
|---|---|
| `variant="primary"` | `class="fc-button"` (primary is the default); `fc-button--primary` is an optional explicit alias |
| `variant="secondary"` | `class="fc-button fc-button--secondary"` |
| `variant="ghost"` | `class="fc-button fc-button--ghost"` |
| `label` | The button's text content; required and non-empty |
| `disabled` | Native `disabled` attribute |
| `type` | Native `type="button"`, `"submit"` or `"reset"`; always set it explicitly |
| `onClick` | Application-owned `click` listener or form `submit` handler; no runtime is shipped |
| `className` | Native `class` attribute for layout only |
| State | Browser-native `:hover`, `:active`, `:focus-visible` and `:disabled`; there is no state prop |
| Pass-through attributes | Native attributes such as `id`, `name`, `value`, `form` and `aria-*` |

The focus ring is drawn by `.fc-button::after` and `.fc-button:focus-visible::after`. Ghost uses `button.ghost.foreground` for every state; the Figma Ghost/Focus label `87:34` was corrected to that token in Stage 5C-1.

---

## 5. Variants and states

The Figma set is a complete 3 × 5 matrix. Every combination is a separate variant; there are no combined states.

| Variant | Default | Hover | Active | Focus | Disabled |
|---|---|---|---|---|---|
| **Primary** | `button.primary.background` + `button.primary.foreground` | `button.primary.background-hover` + foreground | `button.primary.background-active` + foreground | Default surface + `button.focus.color` ring | `button.disabled.background` + `button.disabled.foreground` |
| **Secondary** | `button.secondary.background` + `button.secondary.foreground` | `button.secondary.background-hover` + foreground | `button.secondary.background-active` + foreground | Default surface + focus ring | `button.disabled.background` + `button.disabled.foreground` |
| **Ghost** | Transparent + `button.ghost.foreground` | `button.ghost.background-hover` + foreground | `button.ghost.background-active` + foreground | Transparent + focus ring | Transparent + `button.disabled.foreground` |

### State model and precedence

**Figma:** exactly one `State` value per instance. The five states are mutually exclusive. `Focus` is a state, not a boolean, because the Focus variant wraps the surface in a ring frame. `State=Focus` shows the variant's **Default** surface plus the ring; it does not show a hover or active surface.

**Production surface precedence:** `disabled > active > hover > default`.

**Production focus:** the ring is an additive keyboard-focus overlay, suppressed when disabled. Because CSS pseudo-classes can be active at once, a focused button may also be hovered or pressed, but **Hover and Focus are not independent axes and there is no combined Hover+Focus state**. The ring is a focus indicator, not a second state axis. This is a design-to-code translation, not an additional Figma variant.

| Combination | Modelled in Figma? | Rule |
|---|---|---|
| Focus + Hover | **No** | Do not create a combined variant and do not claim one exists. Keep the ring visible on hover. |
| Focus + Active | **No** | Same. Keep the ring visible while pressed. |
| Disabled + Hover/Active/Focus | **No** | Disabled wins; no hover, active or ring treatment. |

If a design shows a combined Hover+Focus or Active+Focus treatment, treat it as an open question. Do not add a sixth state or a combined variant without a new Figma build and contract version.

---

## 6. Token dependencies

Button consumes 22 component tokens. Colour tokens alias Semantic roles; geometry and typography tokens alias Primitives because no semantic geometry layer exists yet.

| Token | CSS variable | Resolves to | Role |
|---|---|---|---|
| `button.height` | `--fc-button-height` | 40px | Control height |
| `button.padding-x` | `--fc-button-padding-x` | 16px | Horizontal padding |
| `button.radius` | `--fc-button-radius` | 6px | Corner radius |
| `button.font-size` | `--fc-button-font-size` | 14px | Label size |
| `button.font-weight` | `--fc-button-font-weight` | 500 | Label weight |
| `button.line-height` | `--fc-button-line-height` | 20px | Label line height |
| `button.focus.color` | `--fc-button-focus-color` | `#2563EB` | Focus ring colour |
| `button.focus.width` | `--fc-button-focus-width` | 2px | Ring width |
| `button.focus.offset` | `--fc-button-focus-offset` | 2px | Ring offset/padding |
| `button.primary.background` | `--fc-button-primary-background` | `#2563EB` | Primary default/focus surface |
| `button.primary.background-hover` | `--fc-button-primary-background-hover` | `#1D4ED8` | Primary hover surface |
| `button.primary.background-active` | `--fc-button-primary-background-active` | `#1E40AF` | Primary active surface |
| `button.primary.foreground` | `--fc-button-primary-foreground` | `#FFFFFF` | Primary label |
| `button.secondary.background` | `--fc-button-secondary-background` | `#F4F4F5` | Secondary default/focus surface |
| `button.secondary.background-hover` | `--fc-button-secondary-background-hover` | `#E4E4E7` | Secondary hover surface |
| `button.secondary.background-active` | `--fc-button-secondary-background-active` | `#D4D4D8` | Secondary active surface |
| `button.secondary.foreground` | `--fc-button-secondary-foreground` | `#18181B` | Secondary label |
| `button.ghost.foreground` | `--fc-button-ghost-foreground` | `#18181B` | Ghost label |
| `button.ghost.background-hover` | `--fc-button-ghost-background-hover` | `#F4F4F5` | Ghost hover surface |
| `button.ghost.background-active` | `--fc-button-ghost-background-active` | `#E4E4E7` | Ghost active surface |
| `button.disabled.background` | `--fc-button-disabled-background` | `#E4E4E7` | Disabled surface for Primary/Secondary |
| `button.disabled.foreground` | `--fc-button-disabled-foreground` | `#A1A1AA` | Disabled label for all variants |

### Token rules

- Consume only `button.*` tokens. Do not consume `color.*`, `blue.*`, `neutral.*` or any other primitive or Semantic token directly.
- Do not hardcode values that a token covers.
- Do not introduce a danger, success, Ghost default background or Button focus-radius token without a token-source change and a new contract version.
- Theme overrides belong at the token layer and require contrast revalidation.

---

## 7. Accessibility

### Design requirements

- **Target size:** every variant is 40px high, above the 24px minimum, and wider than 40px at the default label.
- **Focus:** 2px ring at 2px offset, drawn outside, at least 3:1 against the adjacent surface.
- **Text contrast:** enabled labels are 5.17:1 to 17.72:1, all above 4.5:1.
- **Disabled:** 2.02:1 for Primary/Secondary and 2.56:1 for Ghost on white. This is **exempt**, not passing. WCAG 1.4.3 and 1.4.11 exclude inactive controls.
- **Not colour-only:** hover and active change the surface; focus adds a ring; disabled changes fill and text and removes interaction.
- **State names are not ARIA:** `Variant` and `State` are design metadata. They must not be emitted as ARIA attributes or accessible names.

### Production requirements

- Render a native `<button>`. Do not use `role="button"` on a `div` or `span`.
- The visible `label` is the accessible name. There is no icon-only or `aria-label`-only mode.
- Enter and Space activate the button natively. Tab reaches it in DOM order. Disabled removes it from the tab order.
- Show the ring for `:focus-visible`. Never set `outline: none` without an equivalent visible replacement. Do not let a parent clip the ring.
- Use the native `disabled` attribute, not `aria-disabled` alone.
- Keep the rendered height at 40px. Do not compress it below 24px.
- There is no loading state. For async work, announce status in a separate live region and guard duplicate submission; do not silently disable the button as the only feedback.
- In forced-colors mode, preserve a visible boundary or focus indicator with system colours.
- Labels may grow or wrap in translation. Do not fix the width or truncate the only accessible name.
- A button must not change the current location. Navigation belongs to a link.

### Contrast summary

| Pair | Ratio | Status |
|---|---:|---|
| Primary Default / Hover / Active label | 5.17 / 6.70 / 8.72 | Pass |
| Secondary Default / Hover / Active label | 16.12 / 13.96 / 11.99 | Pass |
| Ghost Default / Hover / Active label | 17.72 / 16.12 / 13.96 | Pass |
| Primary and Secondary Disabled label | 2.02 | Exempt |
| Ghost Disabled label on white | 2.56 | Exempt |
| Focus ring on default / canvas / subtle / muted / inverse | 5.17 / 4.95 / 4.70 / 4.07 / 3.43 | Pass (non-text, 3:1) |
| Ghost on inverse | 1.00 | Advisory — unsupported |

---

## 8. Customisation

### Allowed

- Change the label copy and localise it.
- Choose Primary, Secondary or Ghost according to hierarchy.
- Stretch the button through its container for layout; keep height, radius, padding and typography unchanged.
- Pass standard native attributes such as `id`, `name`, `value`, `form` and `aria-*`.
- Supply `onClick` for actions and `type="submit"` for forms.
- Override component token values at the theme layer, preserving the three-layer alias chain and revalidating every contrast pair.
- Wrap the button in layout that does not clip its focus ring.

### Forbidden

- Hardcoding colours, radii, heights, padding, font sizes or weights.
- Adding danger, success, link, outline, loading, icon-only or full-width variants.
- Changing the 40px height, 6px radius, 16px horizontal padding, 14/20 label or 500 weight.
- Removing or restyling the focus ring.
- Using `aria-disabled` without the native `disabled` attribute.
- Using `role="button"` on a non-button element.
- Two Primary buttons in one decision group.
- `aria-pressed`, `aria-expanded` or other toggle semantics without a toggle contract.
- Ghost on an inverse surface.
- Per-instance visual overrides instead of correcting the token or contract.

### Theming

A consumer may remap semantic action and focus roles so `button.primary.background`, `button.secondary.background` and `button.focus.color` resolve to a brand palette. Every override must preserve the alias chain and be revalidated for text contrast, focus contrast, hover/active differentiation and the disabled exemption.

Light theme is the only implemented theme. Dark mode is not available and must not be simulated by inverting values.

---

## 9. Composition

### Canonical

- One Primary action per form, dialog or decision group; place it last in reading order when it advances the task.
- Pair Primary with Secondary for cancel or back.
- Use Ghost for low-emphasis toolbar and row actions on supported light surfaces.
- Keep labels verb-led and specific.
- Preserve DOM order that matches visual order.
- Let the button grow with translated copy; never clip the label or ring.

### Forbidden

- Two Primaries for the same decision.
- A button nested inside a button or link.
- Button for navigation.
- Button as an input adornment, clear button or password reveal.
- Destructive styling by overriding Primary with red.
- A disabled submit used instead of validation feedback.
- Ghost on inverse or dark surfaces.

### Illustrative composition

The financial-form example shows Button and Input together:

- [`../examples/financial-form.md`](../examples/financial-form.md)

It is illustrative only. No production form or component package exists.

---

## 10. Invalid configurations

| Invalid configuration | Why | Correct |
|---|---|---|
| `<Button state="hover" />` | State is derived; a caller can fake interaction | Let `:hover`, `:active`, `:focus-visible` and `disabled` drive it |
| A Figma variant `State=Hover+Focus` | The State axis is flat and has five values | Keep 15 variants; overlay the ring in production |
| `variant="danger"` | No danger variant or token | Do not implement destructive styling in v0.1 |
| `<Button loading />` with a spinner | No loading state or spinner | Keep label stable, guard duplicates, announce status separately |
| Icon-only square button | No icon system; label is the name | Use a text label |
| `style={{ background: "#2563EB" }}` | Bypasses tokens and themeability | Use `variant="primary"` |
| Ghost on `color.surface.inverse` | 1.00:1 contrast | Use a supported light surface |
| Button that calls a router | Breaks link semantics | Use a link |
| `aria-disabled="true"` only | Remains focusable and clickable | Use `disabled` |
| `button:focus { outline: none; }` | Removes the only focus indicator | Render the 2px ring with `:focus-visible` |
| A 32px-high button with 4px radius | Hardcodes geometry and bypasses the size tokens | Use `size="sm"`; it is 32px high with a 6px radius and 12px padding |
| Two Primary buttons: “Save” and “Save and close” | Competing primary actions | One Primary, the alternative as Secondary/Ghost |

More invalid and valid examples are in [`contract.json`](./contract.json).

---

## 11. Test requirements

### Visual

- All 15 Variant × State combinations resolve to the expected tokens.
- Height 40px, radius 6px, padding 16px, label 14/20 weight 500.
- Focus ring 2px at 2px offset, OUTSIDE, 8px outer radius, inner surface 40px.
- Disabled fill/text for Primary and Secondary; transparent Ghost with muted label.
- Ghost has no fill of its own.

### Behaviour

- Click fires once.
- Enter and Space activate; Tab reaches the control.
- Disabled does not fire, is skipped in tab order, and shows no hover/active/ring.
- `type="submit"` submits once; `type="button"` does not.
- Label updates without losing token bindings.
- Pointer transitions default → hover → active → default.

### Accessibility

- Role is `button`; accessible name equals the visible label.
- Enabled text ≥4.5:1; focus ring ≥3:1 on every supported surface.
- Focus ring is visible, unclipped and persists while hovered.
- Disabled exposes the native disabled state and is not focusable.
- Forced-colors mode retains a boundary/focus indicator.
- 200% zoom and long translated labels do not clip.

### Tokens

- Every reference is a `button.*` token; zero primitive/Semantic references; zero hardcoded values covered by a token.
- All 22 dependencies exist, resolve to the stated values and map to the stated `--fc-*` variables.
- Every variant uses the tokens in its `stateMapping`.
- No danger, success or loading variant and no Ghost default background token exists.

### Regression

- Baseline snapshot of all 15 variants.
- Protected token hashes unchanged.
- Figma set still has 15 variants, 3 properties and the same variant IDs.
- Buttons do not create history entries or tabs.

---

## 12. Known limitations

1. **Flat State axis.** Focus cannot be combined with Hover or Active in Figma.
2. **Focus surface.** `State=Focus` uses the Default surface, not the Hover or Active surface.
3. **Focus-radius literal.** No Button focus-radius token; 8px is 6px + 2px.
4. **Vertical-padding literal.** 10px is derived from height and line height.
5. **Font family not tokenised.** IBM Plex Sans is a Figma text property.
6. **No icons.** No leading/trailing icon, icon-only button or adornment.
7. **No loading.** No spinner, progress or busy state.
8. **No destructive variant.** No danger/critical styling.
9. **No toggle.** No pressed, selected or `aria-pressed` state.
10. **Inverse unsupported.** Ghost fails at 1.00:1; Primary/Secondary have no inverse-specific tokens.
11. **Disabled contrast.** 2.02:1 (Primary/Secondary) and 2.56:1 (Ghost) are exempt, not accessible.
12. **Width not tokenised.** Width follows the label or layout.
13. **One size.** 40px high, 14/20 text only.
14. **Figma state is not runtime.** Do not expose `State` as a prop.
15. **Dark mode not implemented.** No dark values exist.

---

## 13. Examples

### Valid

```tsx
<Button variant="primary" type="submit" label="Review transfer" />
```

```tsx
<Button variant="secondary" type="button" label="Cancel" onClick={cancelTransfer} />
```

```tsx
<Button variant="ghost" label="View details" onClick={openDetails} />
```

```tsx
<Button variant="secondary" label="Download receipt" disabled />
```

### Invalid

```tsx
// No danger variant or danger token.
<Button variant="danger" label="Delete account" />

// State is derived; do not expose it.
<Button state="hover" label="Continue" />

// No icon-only contract; the visible label is required.
<Button aria-label="Delete" icon={<TrashIcon />} />

// Hardcoded values and a non-contract height.
<Button style={{ background: "#2563EB", color: "#fff", height: 32 }} label="Save" />
```

### Production checklist

An implementation is ready only when:

- All 15 combinations render from `button.*` tokens.
- Keyboard, click, submit, disabled and label updates pass.
- The focus ring is visible and unclipped at 100% and 200% zoom.
- Accessible name, role, disabled semantics and target size pass.
- The 22 dependencies match the token source and generated CSS.
- No unsupported variant, state, icon, loading, navigation or inverse usage exists.
