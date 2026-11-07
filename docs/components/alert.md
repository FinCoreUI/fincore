# Alert

Prominent feedback banner supporting info, success, warning, and error roles. Canonical sources:
[`components/alert`](../../components/alert/README.md) and
[`contract.json`](../../components/alert/contract.json).

## Import

```tsx
import { Alert } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/alert.css";
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `"info" | "success" | "warning" | "error"` | `"info"` | Feedback visual variant |
| native attributes | `HTMLAttributes<HTMLElement>` | — | Standard HTML attributes pass through. |

## Accessibility

- Conforms to WCAG 2.2 AA standards.
- Token contrast verified against standard surfaces.
- Preserves high-contrast / forced-colors indicators.

## Tokens

Consumes `--fc-alert-*` component tokens exclusively.
