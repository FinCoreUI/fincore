# Select

Native `<select>` with associated label and helper/error row. Canonical sources:
[`components/select`](../../components/select/contract.json) and
[`select.html`](../../components/select/select.html).

## Import

```tsx
import { Select } from "@weft-ui/react";
import "@weft-ui/react/styles/tokens.css";
import "@weft-ui/react/styles/select.css";
```

## Features

- **Size Variants:** Supports `size` prop (`"sm" | "md" | "lg"`).
- **Loading State:** Supports `loading` prop / `aria-busy="true"`.
- **Dark Theme:** Automatically adapts to `[data-theme="dark"]` or `.dark` context.
- **Tokens:** Consumes only `--fc-select-*` tokens.
