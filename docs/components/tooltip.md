# Tooltip

Contextual floating hint triggered on hover or focus. Canonical sources:
[`components/tooltip`](../../components/tooltip/README.md) and
[`contract.json`](../../components/tooltip/contract.json).

## Import

```tsx
import { Tooltip } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/tooltip.css";
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `content` | `ReactNode` | `—` | Tooltip label content |
| native attributes | `HTMLAttributes<HTMLElement>` | — | Standard HTML attributes pass through. |

## Accessibility

- Conforms to WCAG 2.2 AA standards.
- Token contrast verified against standard surfaces.
- Preserves high-contrast / forced-colors indicators.

## Tokens

Consumes `--fc-tooltip-*` component tokens exclusively.
