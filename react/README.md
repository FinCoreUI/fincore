# Weft React Components (Alpha)

Package: `@weft-ui/react`  
Version: `0.1.0-alpha.1`  
Status: Private alpha  
Peer dependencies: `react >=18.0.0`, `react-dom >=18.0.0`  
Optional: `libphonenumber-js >=1.10.0` (for full PhoneInput validation/inference)

## Installation

This package is private and not published. Install from a local build/tarball or from the repository as appropriate for your environment.

## Imports

```tsx
import { Button, Input, PasswordInput } from "@weft-ui/react";
import { PhoneInput } from "@weft-ui/react/phone-input";
```

### Button
```tsx
<Button variant="primary">Review transfer</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Learn more</Button>
```
Props follow the current `Button` implementation (see `react/types`). Uses a real `<button>` element with `type="button"` by default.

### Input
```tsx
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  helperText="We'll email a receipt."
/>

<Input
  label="Amount"
  type="number"
  errorMessage="Enter a valid amount."
/>
```
Builds label/control/message anatomy, associates label via `htmlFor`/`id`, sets `aria-invalid="true"` on error and replaces helper text with error message.

### PasswordInput
```tsx
<PasswordInput
  label="Account password"
  placeholder="Enter your password"
  helperText="Must be at least 12 characters."
/>

<PasswordInput
  label="Current password"
  errorMessage="Incorrect password."
/>
```
Provides accessible label/control/message anatomy, password visibility toggling with accessible button names (`showPasswordLabel` / `hidePasswordLabel`), value preservation when toggling, and support for controlled/uncontrolled visibility (`visible`, `defaultVisible`, `onVisibleChange`).

### PhoneInput
```tsx
<PhoneInput
  label="Phone number"
  onChange={(result) => {
    // result.inputValue: editable text
    // result.e164: E.164 only when valid/parseable as provided
    // result.status: "empty" | "incomplete" | "invalid" | "valid"
    // result.isValid: boolean
    // result.country: selected/inferred country code if available
  }}
/>
```

Notes on PhoneInput semantics:
- `inputValue` is the editable text (preserved exactly as typed).
- `e164` is only present when the number is valid/parseable according to the implementation; validity does not imply the number is active, reachable, or owned.
- `status` distinguishes `empty`, `incomplete`, `invalid`, and `valid`.
- No country is hard-coded as default. Country can be set via `country` (controlled) or `defaultCountry`; inference from international numbers follows library behavior. Shared calling codes (e.g., +1) may be ambiguous.
- `libphonenumber-js` is optional. If unavailable, PhoneInput degrades gracefully (no validity claims) and the country list may be limited/empty.

## CSS

Load token CSS before component CSS where required. CSS must be imported explicitly (components do not auto-load styles).

Package export paths (from `react/package.json`):
- `@weft-ui/react/styles/tokens.css`
- `@weft-ui/react/styles/button.css`
- `@weft-ui/react/styles/input.css`
- `@weft-ui/react/styles/password-input.css`
- `@weft-ui/react/styles/phone-input.css`

Example for Button, Input and PasswordInput:
```tsx
import "@weft-ui/react/styles/tokens.css";
import "@weft-ui/react/styles/button.css";
import "@weft-ui/react/styles/input.css";
import "@weft-ui/react/styles/password-input.css";
import { Button, Input, PasswordInput } from "@weft-ui/react";
```

Example for PhoneInput:
```tsx
import "@weft-ui/react/styles/tokens.css";
import "@weft-ui/react/styles/phone-input.css";
import { PhoneInput } from "@weft-ui/react/phone-input";
```

CSS imports require a bundler or environment that supports CSS imports (e.g., Vite, webpack, Next.js). In Node ESM without a loader, CSS imports may error; this is a consumer/environment configuration issue, not necessarily a package defect.

## Supported versions
- React `>=18.0.0`, React DOM `>=18.0.0`

## Alpha limitations
- Package is private (not published to npm).
- PhoneInput depends on `libphonenumber-js` for full validation/inference; fallback behavior is limited.
- No browser verification has been performed in this environment.
- API is alpha and may change.
- No automatic CSS injection.
