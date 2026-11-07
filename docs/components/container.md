# Container

Centered page wrapper with maximum width constraint and responsive padding. Canonical sources:
[`components/container`](../../components/container/README.md) and
[`contract.json`](../../components/container/contract.json).

## Import

```tsx
import { Container } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/container.css";
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `"sm" | "md" | "lg"` | `"md"` | Max-width scale |
| native attributes | `HTMLAttributes<HTMLElement>` | — | Standard HTML attributes pass through. |

## Accessibility

- Conforms to WCAG 2.2 AA standards.
- Token contrast verified against standard surfaces.
- Preserves high-contrast / forced-colors indicators.

## Tokens

Consumes `--fc-container-*` component tokens exclusively.
