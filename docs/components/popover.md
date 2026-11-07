# Popover

Accessible interactive overlay anchored to a trigger. Canonical sources:
[`components/popover`](../../components/popover/README.md) and
[`contract.json`](../../components/popover/contract.json).

## Import

```tsx
import { Popover } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/popover.css";
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `trigger` | `ReactElement` | `—` | Anchor element |
| native attributes | `HTMLAttributes<HTMLElement>` | — | Standard HTML attributes pass through. |

## Accessibility

- Conforms to WCAG 2.2 AA standards.
- Token contrast verified against standard surfaces.
- Preserves high-contrast / forced-colors indicators.

## Tokens

Consumes `--fc-popover-*` component tokens exclusively.
