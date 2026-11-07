# BalanceCard

Account balance overview card with account mask and available funds. Canonical sources:
[`components/balance-card`](../../components/balance-card/README.md) and
[`contract.json`](../../components/balance-card/contract.json).

## Import

```tsx
import { BalanceCard } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/balance-card.css";
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `amount` | `ReactNode` | `—` | Balance amount display |
| native attributes | `HTMLAttributes<HTMLElement>` | — | Standard HTML attributes pass through. |

## Accessibility

- Conforms to WCAG 2.2 AA standards.
- Token contrast verified against standard surfaces.
- Preserves high-contrast / forced-colors indicators.

## Tokens

Consumes `--fc-balance-card-*` component tokens exclusively.
