# Divider

Visual separation line with horizontal and vertical orientations. Canonical sources:
[`components/divider`](../../components/divider/README.md) and
[`contract.json`](../../components/divider/contract.json).

## Import

```tsx
import { Divider } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/divider.css";
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `orientation` | `"horizontal" | "vertical"` | `"horizontal"` | Separation direction |
| native attributes | `HTMLAttributes<HTMLElement>` | — | Standard HTML attributes pass through. |

## Accessibility

- Conforms to WCAG 2.2 AA standards.
- Token contrast verified against standard surfaces.
- Preserves high-contrast / forced-colors indicators.

## Tokens

Consumes `--fc-divider-*` component tokens exclusively.
