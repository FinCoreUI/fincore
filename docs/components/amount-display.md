# AmountDisplay

Tabular numeric monetary amount with positive/negative color variants. Canonical sources:
[`components/amount-display`](../../components/amount-display/README.md) and
[`contract.json`](../../components/amount-display/contract.json).

## Import

```tsx
import { AmountDisplay } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/amount-display.css";
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `ReactNode` | `—` | Amount value |
| `variant` | `"positive" | "negative" | "default"` | `"default"` | Sign styling |
| native attributes | `HTMLAttributes<HTMLElement>` | — | Standard HTML attributes pass through. |

## Accessibility

- Conforms to WCAG 2.2 AA standards.
- Token contrast verified against standard surfaces.
- Preserves high-contrast / forced-colors indicators.

## Tokens

Consumes `--fc-amount-display-*` component tokens exclusively.
