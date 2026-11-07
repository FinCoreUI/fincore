# Stack

Vertical flex layout primitive with tokenized gap scales. Canonical sources:
[`components/stack`](../../components/stack/README.md) and
[`contract.json`](../../components/stack/contract.json).

## Import

```tsx
import { Stack } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/stack.css";
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `gap` | `"xs" | "sm" | "md" | "lg" | "xl"` | `"md"` | Vertical spacing |
| native attributes | `HTMLAttributes<HTMLElement>` | — | Standard HTML attributes pass through. |

## Accessibility

- Conforms to WCAG 2.2 AA standards.
- Token contrast verified against standard surfaces.
- Preserves high-contrast / forced-colors indicators.

## Tokens

Consumes `--fc-stack-*` component tokens exclusively.
