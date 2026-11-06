# PhoneInput

Phone field with a native country selector and optional `libphonenumber-js`
format validation. Canonical sources:
[`components/phone-input`](../../components/phone-input/README.md) and
[`contract.json`](../../components/phone-input/contract.json).

## Import

```tsx
import { PhoneInput } from "@sorleed/react/phone-input";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/phone-input.css";

// Optional but required for parsing and format validation:
// npm install libphonenumber-js
```

## API

| Prop | Type | Notes |
|---|---|---|
| `label` | `string` | Required. |
| `hideLabel` | `boolean` | Visually hidden label. |
| `helperText` | `string` | Shown when there is no error. |
| `errorMessage` | `string` | Sets `aria-invalid="true"`. |
| `value` / `defaultValue` | `string` | Controlled or uncontrolled editing value. |
| `country` / `defaultCountry` | `string` | ISO 3166-1 alpha-2. Never inferred from IP. |
| `countries` | `string[]` | Optional ISO allow-list. |
| `onChange` | `(result: PhoneInputChangeResult) => void` | Reports editing value and status. |
| `onCountryChange` | `(country?: string) => void` | Selector callback. |
| `international` | `boolean` | Accepted for compatibility; does not change behaviour yet. |

```ts
interface PhoneInputChangeResult {
  inputValue: string;
  e164?: string;
  country?: string;
  status: "empty" | "incomplete" | "invalid" | "valid";
  isValid: boolean;
}
```

## Behaviour

- Native `<select>` for the country. Full English region names plus dial codes,
  with a two-letter fallback.
- No IP geolocation and no forced default country.
- Changing the country does not rewrite the current editing value.
- `isValid` means format validity only; it does not prove deliverability,
  reachability or ownership.

## Accessibility

- Number input has a programmatic label.
- Country selector has its own accessible name.
- Error message is connected with `aria-describedby`.
- Both controls use native `disabled`.
- No custom listbox and no keyboard trap.

## Tokens

Consumes `--sl-phone-input-*` only.
