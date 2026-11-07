# Switch

Accessible toggle switch control for binary settings. Canonical sources:
[`components/switch`](../../components/switch/README.md) and
[`contract.json`](../../components/switch/contract.json).

## Import

```tsx
import { Switch } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/switch.css";
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `checked` | `boolean` | `false` | Whether the switch is on |
| native attributes | `HTMLAttributes<HTMLElement>` | — | Standard HTML attributes pass through. |

## Accessibility

- Conforms to WCAG 2.2 AA standards.
- Token contrast verified against standard surfaces.
- Preserves high-contrast / forced-colors indicators.

## Tokens

Consumes `--fc-switch-*` component tokens exclusively.
