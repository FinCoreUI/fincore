# Button

Native `<button>` with three visual variants. Canonical sources:
[`components/button`](../../components/button/README.md) and
[`contract.json`](../../components/button/contract.json).

## Import

```tsx
import { Button } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/button.css";
```

```html
<button class="sl-button sl-button--primary" type="button">Continue</button>
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `"primary" \| "secondary" \| "ghost"` | `"primary"` | Visual variant. |
| `type` | native button type | `"button"` | Prevents accidental form submission. |
| native attributes | `ButtonHTMLAttributes<HTMLButtonElement>` | — | `disabled`, `aria-*`, `data-*` pass through. |

## States

`Default → Hover → Active`, plus `Focus` and `Disabled`.

Precedence: `Disabled > Active > Hover > Default`. Focus is an additive ring and
is suppressed when disabled.

## Accessibility

- Native keyboard activation with Enter and Space.
- Visible focus overlay at 2px width and 2px offset.
- Disabled uses the native `disabled` attribute.
- Forced-colours rules preserve the boundary and focus indicator.

## Tokens

Consumes `--sl-button-*` only. Ghost has no default background token; the page
surface shows through.
