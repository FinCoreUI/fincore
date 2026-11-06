# Currency

Specialised financial input with currency prefix and suffix affixes. Canonical sources:
[`components/currency`](../../components/currency/contract.json) and
[`currency.html`](../../components/currency/currency.html).

## Import

```tsx
import { Currency } from "@weft-ui/react";
import "@weft-ui/react/styles/tokens.css";
import "@weft-ui/react/styles/currency.css";
```

## Features

- **Size Variants:** Supports `size` prop (`"sm" | "md" | "lg"`).
- **Loading State:** Supports `loading` prop / `aria-busy="true"`.
- **Dark Theme:** Automatically adapts to `[data-theme="dark"]` or `.dark` context.
- **Tokens:** Consumes only `--fc-currency-*` tokens.
