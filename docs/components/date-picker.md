# DatePicker

Native date input with accessible label association and validation error handling. Canonical sources:
[`components/date-picker`](../../components/date-picker/contract.json) and
[`date-picker.html`](../../components/date-picker/date-picker.html).

## Import

```tsx
import { DatePicker } from "@weft-ui/react";
import "@weft-ui/react/styles/tokens.css";
import "@weft-ui/react/styles/date-picker.css";
```

## Features

- **Size Variants:** Supports `size` prop (`"sm" | "md" | "lg"`).
- **Loading State:** Supports `loading` prop / `aria-busy="true"`.
- **Dark Theme:** Automatically adapts to `[data-theme="dark"]` or `.dark` context.
- **Tokens:** Consumes only `--fc-date-picker-*` tokens.
