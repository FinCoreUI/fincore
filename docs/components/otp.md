# OTP

One-time password input group with automatic advance and paste support. Canonical sources:
[`components/otp`](../../components/otp/contract.json) and
[`otp.html`](../../components/otp/otp.html).

## Import

```tsx
import { OTP } from "@weft-ui/react";
import "@weft-ui/react/styles/tokens.css";
import "@weft-ui/react/styles/otp.css";
```

## Features

- **Size Variants:** Supports `size` prop (`"sm" | "md" | "lg"`).
- **Loading State:** Supports `loading` prop / `aria-busy="true"`.
- **Dark Theme:** Automatically adapts to `[data-theme="dark"]` or `.dark` context.
- **Tokens:** Consumes only `--fc-otp-*` tokens.
