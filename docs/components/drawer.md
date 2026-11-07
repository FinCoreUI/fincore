# Drawer

Slide-out overlay dialog for focused workflows and sidebars. Canonical sources:
[`components/drawer`](../../components/drawer/README.md) and
[`contract.json`](../../components/drawer/contract.json).

## Import

```tsx
import { Drawer } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/drawer.css";
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | `false` | Controlled open state |
| native attributes | `HTMLAttributes<HTMLElement>` | — | Standard HTML attributes pass through. |

## Accessibility

- Conforms to WCAG 2.2 AA standards.
- Token contrast verified against standard surfaces.
- Preserves high-contrast / forced-colors indicators.

## Tokens

Consumes `--fc-drawer-*` component tokens exclusively.
