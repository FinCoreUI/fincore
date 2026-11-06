# Checkbox

Accessible checkbox input with persistent label and helper/error messaging. Canonical sources:
[`components/checkbox`](../../components/checkbox/contract.json) and
[`checkbox.html`](../../components/checkbox/checkbox.html).

## Import

```tsx
import { Checkbox } from "@weft-ui/react";
import "@weft-ui/react/styles/tokens.css";
import "@weft-ui/react/styles/checkbox.css";
```

## Features

- **Size Variants:** Supports `size` prop (`"sm" | "md" | "lg"`).
- **Loading State:** Supports `loading` prop / `aria-busy="true"`.
- **Dark Theme:** Automatically adapts to `[data-theme="dark"]` or `.dark` context.
- **Tokens:** Consumes only `--fc-checkbox-*` tokens.
