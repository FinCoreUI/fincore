# FinCore component catalogue

This is the canonical list of **implemented** FinCore components. It documents
what the current contracts, CSS stylesheets, and React adapters support.

| Component | Status | Contract | CSS | Native reference | React Adapter |
|---|---|---|---|---|---|
| Button | Implemented | [`fincore.button` 1.0.0](./button/contract.json) | [`button.css`](./button/button.css) | [`button.html`](./button/button.html) | [`Button` (React)](../react/button) |
| Input | Implemented | [`fincore.input` 1.0.0](./input/contract.json) | [`input.css`](./input/input.css) | [`input.html`](./input/input.html) | [`Input` (React)](../react/input) |
| PhoneInput | Implemented | [`fincore.phone-input` 1.0.0](./phone-input/contract.json) | [`phone-input.css`](./phone-input/phone-input.css) | [`phone-input.html`](./phone-input/phone-input.html) | [`PhoneInput` (React)](../react/phone-input) |
| Select | Implemented | [`fincore.select` 1.0.0](./select/contract.json) | [`select.css`](./select/select.css) | [`select.html`](./select/select.html) | [`Select` (React)](../react/select) |
| Checkbox | Implemented | [`fincore.checkbox` 1.0.0](./checkbox/contract.json) | [`checkbox.css`](./checkbox/checkbox.css) | [`checkbox.html`](./checkbox/checkbox.html) | [`Checkbox` (React)](../react/checkbox) |
| Radio Group | Implemented | [`fincore.radio-group` 1.0.0](./radio-group/contract.json) | [`radio-group.css`](./radio-group/radio-group.css) | [`radio-group.html`](./radio-group/radio-group.html) | [`RadioGroup` (React)](../react/radio-group) |
| Textarea | Implemented | [`fincore.textarea` 1.0.0](./textarea/contract.json) | [`textarea.css`](./textarea/textarea.css) | [`textarea.html`](./textarea/textarea.html) | [`Textarea` (React)](../react/textarea) |
| OTP | Implemented | [`fincore.otp` 1.0.0](./otp/contract.json) | [`otp.css`](./otp/otp.css) | [`otp.html`](./otp/otp.html) | [`OTP` (React)](../react/otp) |
| Currency | Implemented | [`fincore.currency` 1.0.0](./currency/contract.json) | [`currency.css`](./currency/currency.css) | [`currency.html`](./currency/currency.html) | [`Currency` (React)](../react/currency) |
| CVV | Implemented | [`fincore.cvv` 1.0.0](./cvv/contract.json) | [`cvv.css`](./cvv/cvv.css) | [`cvv.html`](./cvv/cvv.html) | [`CVV` (React)](../react/cvv) |
| DatePicker | Implemented | [`fincore.date-picker` 1.0.0](./date-picker/contract.json) | [`date-picker.css`](./date-picker/date-picker.css) | [`date-picker.html`](./date-picker/date-picker.html) | [`DatePicker` (React)](../react/date-picker) |

## Features & Cross-Cutting Capabilities

- **Dark Theme:** Token layer provides full dark theme support via `[data-theme="dark"]` or `.dark` selectors in `tokens/dist/tokens.css`.
- **Size Variants:** Controls support size variants (`sm` / `md` / `lg`) matching the design system control scales.
- **Loading Treatment:** Components support `loading` prop / `aria-busy="true"` state with accessible pointer-events suppression.
- **PhoneInput Dependency Architecture:** `libphonenumber-js` is configured as an optional peer dependency with safe fallback for zero-dependency core usage.

## Component References

All components follow the FinCore Stage 2 contract pattern:
- Framework-agnostic CSS consumed via `tokens/dist/tokens.css`
- Native semantic HTML references
- Zero-runtime CLI templates under `cli/templates`
- React component adapters with TypeScript types under `react/`
