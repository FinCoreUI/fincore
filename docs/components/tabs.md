# Tabs

Accessible tabbed interface powered by Radix UI primitive with tokenized styling. Canonical sources:
[`components/tabs`](../../components/tabs/README.md) and
[`contract.json`](../../components/tabs/contract.json).

## Import

```tsx
import { Tabs } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/tabs.css";
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `defaultValue` | `string` | `undefined` | Initial active tab value |
| native attributes | `HTMLAttributes<HTMLElement>` | — | Standard HTML attributes pass through. |

## Accessibility

- Conforms to WCAG 2.2 AA standards.
- Token contrast verified against standard surfaces.
- Preserves high-contrast / forced-colors indicators.

## Tokens

Consumes `--fc-tabs-*` component tokens exclusively.
