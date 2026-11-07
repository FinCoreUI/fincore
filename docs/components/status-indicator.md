# StatusIndicator

Status dot with label for financial workflow states. Canonical sources:
[`components/status-indicator`](../../components/status-indicator/README.md) and
[`contract.json`](../../components/status-indicator/contract.json).

## Import

```tsx
import { StatusIndicator } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/status-indicator.css";
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `status` | `"success" | "warning" | "error" | "info" | "neutral"` | `"neutral"` | State variant |
| native attributes | `HTMLAttributes<HTMLElement>` | — | Standard HTML attributes pass through. |

## Accessibility

- Conforms to WCAG 2.2 AA standards.
- Token contrast verified against standard surfaces.
- Preserves high-contrast / forced-colors indicators.

## Tokens

Consumes `--fc-status-indicator-*` component tokens exclusively.
