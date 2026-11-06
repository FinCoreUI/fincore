# Input

Native text-like input with a required label, optional helper text and an
explicit error state. Canonical sources:
[`components/input`](../../components/input/README.md) and
[`contract.json`](../../components/input/contract.json).

## Import

```tsx
import { Input } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/input.css";
```

```html
<div class="sl-input">
  <label class="sl-input__label" for="email">Email</label>
  <div class="sl-input__control">
    <input class="sl-input__field" id="email" type="email" placeholder="you@example.com">
  </div>
  <p class="sl-input__message">We only use this for account notices.</p>
</div>
```

## API

| Prop | Type | Notes |
|---|---|---|
| `label` | `string` | Required accessible label. |
| `hideLabel` | `boolean` | Visually hide the label; keep the accessible name. |
| `helperText` | `string` | Shown when there is no error. |
| `errorMessage` | `string` | Replaces helper text and sets `aria-invalid="true"`. |
| `type` | `"text" \| "email" \| "tel" \| "number" \| "url"` | Other types are out of scope. |
| `id` | `string` | Generated with `useId` when omitted. |

## States

`Default`, `Hover`, `Focus`, `Error`, `Disabled`.

Precedence: `Disabled > Error > Hover > Default`. The visible error border is
keyed to `aria-invalid="true"` so visual and semantic error states cannot drift.

## Accessibility

- Label is associated through `for`/`id`.
- Helper and error text are connected with `aria-describedby`.
- Errors are never colour-only; a message is required.
- The application owns validation timing and error copy.

## Tokens

Consumes `--sl-input-*` only.
