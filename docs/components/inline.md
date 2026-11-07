# Inline

Horizontal flex layout primitive with tokenized gap scales. Canonical sources:
[`components/inline`](../../components/inline/README.md) and
[`contract.json`](../../components/inline/contract.json).

## Import

```tsx
import { Inline } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/inline.css";
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `gap` | `"xs" | "sm" | "md" | "lg" | "xl"` | `"md"` | Horizontal spacing |
| native attributes | `HTMLAttributes<HTMLElement>` | — | Standard HTML attributes pass through. |

## Accessibility

- Conforms to WCAG 2.2 AA standards.
- Token contrast verified against standard surfaces.
- Preserves high-contrast / forced-colors indicators.

## Tokens

Consumes `--fc-inline-*` component tokens exclusively.
