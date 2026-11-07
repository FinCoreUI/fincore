# TransactionItem

Financial transaction row displaying lead icon, merchant, metadata, and amount. Canonical sources:
[`components/transaction-item`](../../components/transaction-item/README.md) and
[`contract.json`](../../components/transaction-item/contract.json).

## Import

```tsx
import { TransactionItem } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/transaction-item.css";
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `ReactNode` | `—` | Transaction title/merchant |
| native attributes | `HTMLAttributes<HTMLElement>` | — | Standard HTML attributes pass through. |

## Accessibility

- Conforms to WCAG 2.2 AA standards.
- Token contrast verified against standard surfaces.
- Preserves high-contrast / forced-colors indicators.

## Tokens

Consumes `--fc-transaction-item-*` component tokens exclusively.
