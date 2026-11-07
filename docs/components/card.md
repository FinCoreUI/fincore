# Card

Surface container for grouping related content and actions with optional header, body and footer. Canonical sources:
[`components/card`](../../components/card/README.md) and
[`contract.json`](../../components/card/contract.json).

## Import

```tsx
import { Card } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/card.css";
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

Consumes `--fc-card-*` component tokens exclusively.
