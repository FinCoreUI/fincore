# Radio Group

Radio input choices with shared name for mutual exclusion. Canonical sources:
[`components/radio-group`](../../components/radio-group/contract.json) and
[`radio-group.html`](../../components/radio-group/radio-group.html).

## Import

```tsx
import { RadioGroup } from "@weft-ui/react";
import "@weft-ui/react/styles/tokens.css";
import "@weft-ui/react/styles/radio-group.css";
```

## Features

- **Size Variants:** Supports `size` prop (`"sm" | "md" | "lg"`).
- **Loading State:** Supports `loading` prop / `aria-busy="true"`.
- **Dark Theme:** Automatically adapts to `[data-theme="dark"]` or `.dark` context.
- **Tokens:** Consumes only `--fc-radio-group-*` tokens.
