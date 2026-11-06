# CVV

Masked payment security code input with length restriction and optional toggle. Canonical sources:
[`components/cvv`](../../components/cvv/contract.json) and
[`cvv.html`](../../components/cvv/cvv.html).

## Import

```tsx
import { CVV } from "@weft-ui/react";
import "@weft-ui/react/styles/tokens.css";
import "@weft-ui/react/styles/cvv.css";
```

## Features

- **Size Variants:** Supports `size` prop (`"sm" | "md" | "lg"`).
- **Loading State:** Supports `loading` prop / `aria-busy="true"`.
- **Dark Theme:** Automatically adapts to `[data-theme="dark"]` or `.dark` context.
- **Tokens:** Consumes only `--fc-cvv-*` tokens.
