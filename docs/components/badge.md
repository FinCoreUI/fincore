# Badge

Compact indicator for status, counts, and tags. Canonical sources:
[`components/badge`](../../components/badge/README.md) and
[`contract.json`](../../components/badge/contract.json).

## Import

```tsx
import { Badge } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/badge.css";
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `"default" | "success" | "warning" | "error" | "outline"` | `"default"` | Visual badge variant |
| native attributes | `HTMLAttributes<HTMLElement>` | — | Standard HTML attributes pass through. |

## Accessibility

- Conforms to WCAG 2.2 AA standards.
- Token contrast verified against standard surfaces.
- Preserves high-contrast / forced-colors indicators.

## Tokens

Consumes `--fc-badge-*` component tokens exclusively.
