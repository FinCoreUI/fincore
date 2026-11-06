# Textarea

Multi-line text input with customisable resize handling. Canonical sources:
[`components/textarea`](../../components/textarea/contract.json) and
[`textarea.html`](../../components/textarea/textarea.html).

## Import

```tsx
import { Textarea } from "@weft-ui/react";
import "@weft-ui/react/styles/tokens.css";
import "@weft-ui/react/styles/textarea.css";
```

## Features

- **Size Variants:** Supports `size` prop (`"sm" | "md" | "lg"`).
- **Loading State:** Supports `loading` prop / `aria-busy="true"`.
- **Dark Theme:** Automatically adapts to `[data-theme="dark"]` or `.dark` context.
- **Tokens:** Consumes only `--fc-textarea-*` tokens.
