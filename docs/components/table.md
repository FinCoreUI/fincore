# Table

Structured data table with responsive rows, headers, and cells. Canonical sources:
[`components/table`](../../components/table/README.md) and
[`contract.json`](../../components/table/contract.json).

## Import

```tsx
import { Table } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/table.css";
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `className` | `string` | `undefined` | Additional CSS classes |
| native attributes | `HTMLAttributes<HTMLElement>` | — | Standard HTML attributes pass through. |

## Accessibility

- Conforms to WCAG 2.2 AA standards.
- Token contrast verified against standard surfaces.
- Preserves high-contrast / forced-colors indicators.

## Tokens

Consumes `--fc-table-*` component tokens exclusively.
