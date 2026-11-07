# FinCore components

FinCore provides a comprehensive suite of 28 production CSS plus native HTML components. They ship no
JavaScript runtime, package, bundler or build step. The application owns
filtering, validation, error presentation, submission and focus management.

A component is consumed by loading the generated token CSS and the component
stylesheet, then using the native element with the documented classes and
attributes.

## Start here

- [Component catalogue](CATALOG.md) — implemented components, supported APIs and
  unsupported functionality.
- [Contract-first usage guide](USAGE-GUIDE.md) — the repeatable discovery,
  implementation and verification workflow.

## Quickstart

### 1. Serve the repository root

From the repository root:

```sh
python3 -m http.server 8765
```

Serving the root keeps the relative token and component paths valid.

### 2. Load token CSS before component CSS

For a page at the repository root:

```html
<link rel="stylesheet" href="tokens/dist/tokens.css">
<link rel="stylesheet" href="components/button/button.css">
<link rel="stylesheet" href="components/input/input.css">
```

If the page is nested, prefix the paths to match its depth. The
[transaction-history example](../examples/transaction-history/index.html) uses
`../../tokens/...` and `../../components/...`.

The component stylesheets **do not import** token CSS. Loading `button.css` or
`input.css` without `tokens/dist/tokens.css` leaves the component variables
undefined. See [tokens/README.md](../tokens/README.md).

### 3. Use the documented native APIs

FinCore does not export React, Vue or Web Component wrappers. Use native HTML.

```html
<div class="fc-input">
  <label class="fc-input__label" for="filter">Description</label>
  <div class="fc-input__control">
    <input
      class="fc-input__field"
      id="filter"
      name="filter"
      type="text"
      autocomplete="off"
      aria-describedby="filter-help"
    >
  </div>
  <p class="fc-input__message" id="filter-help">
    Matches description text only.
  </p>
</div>

<button class="fc-button fc-button--secondary" type="button">Clear</button>
<button class="fc-button" type="submit">Apply filter</button>
```

- `.fc-button` is Primary by default. Add `.fc-button--secondary` for a quieter
  action. Set an explicit `type` on every button.
- Input is the full `.fc-input` field anatomy. Keep the visible label associated
  with `for`/`id`; never use the placeholder as the label. Use
  `aria-describedby` for helper or error text.
- Supported input types are `text`, `email`, `tel`, `number` and `url`.
  Validation, error copy, `aria-invalid` and focus management are application
  responsibilities.
- Set a page font. Both components use `font-family: inherit`; no font file or
  font-family token is shipped.

## Verify the setup

Open the existing browser fixture through the same server:

```text
http://127.0.0.1:8765/components/test/browser-smoke.html
```

The page runs native DOM and computed-style checks and should end with
`data-status="pass"` and `0 failed`. The manual keyboard and visual checks are in
[test/BROWSER-TESTING.md](test/BROWSER-TESTING.md).

The approved modern-browser baseline is Chrome/Edge 105+, Safari 15.4+ and
Firefox 121+. Input uses `:has()` for its focus overlay and disabled
suppression; no fallback is bundled.

## Working example

[examples/transaction-history](../examples/transaction-history/README.md) is a
runnable financial interface that links the real token and component CSS and
uses the actual `.fc-button` and `.fc-input` markup. Its filtering and layout
are application code.

The [payment-form example](../examples/payment-form/README.md) is a second
runnable composition with inline validation and a review state.

## Component references

| Component | Documentation | Native reference | Machine contract |
|---|---|---|---|
| Button | [button/README.md](button/README.md) | [button/button.html](button/button.html) | [button/contract.json](button/contract.json) |
| Input | [input/README.md](input/README.md) | [input/input.html](input/input.html) | [input/contract.json](input/contract.json) |
| PhoneInput | [phone-input/README.md](phone-input/README.md) | [phone-input/phone-input.html](phone-input/phone-input.html) | [phone-input/contract.json](phone-input/contract.json) |
| Select | [select/contract.json](select/contract.json) | [select/select.html](select/select.html) | [select/contract.json](select/contract.json) |
| Checkbox | [checkbox/contract.json](checkbox/contract.json) | [checkbox/checkbox.html](checkbox/checkbox.html) | [checkbox/contract.json](checkbox/contract.json) |
| Radio Group | [radio-group/contract.json](radio-group/contract.json) | [radio-group/radio-group.html](radio-group/radio-group.html) | [radio-group/contract.json](radio-group/contract.json) |
| Textarea | [textarea/contract.json](textarea/contract.json) | [textarea/textarea.html](textarea/textarea.html) | [textarea/contract.json](textarea/contract.json) |
| OTP | [otp/contract.json](otp/contract.json) | [otp/otp.html](otp/otp.html) | [otp/contract.json](otp/contract.json) |
| Currency | [currency/contract.json](currency/contract.json) | [currency/currency.html](currency/currency.html) | [currency/contract.json](currency/contract.json) |
| CVV | [cvv/contract.json](cvv/contract.json) | [cvv/cvv.html](cvv/cvv.html) | [cvv/contract.json](cvv/contract.json) |
| DatePicker | [date-picker/contract.json](date-picker/contract.json) | [date-picker/date-picker.html](date-picker/date-picker.html) | [date-picker/contract.json](date-picker/contract.json) |

### Design Tokens & Features

- **Dark Theme:** Token CSS (`tokens/dist/tokens.css`) generates complete dark theme custom properties via `[data-theme="dark"]` and `.dark`.
- **Size & Loading Support:** Control components support size modifiers (`sm`, `md`, `lg`) and visual loading treatment (`loading` prop / `aria-busy="true"`).

Also useful:

- [Implementation guide](IMPLEMENTATION.md) — files, APIs, token compliance and
  test results.
- [Browser testing runbook](test/BROWSER-TESTING.md) and
  [fixture](test/browser-smoke.html).
- [Token consumption](../tokens/README.md).

## Copy into an application

Copy `tokens/dist/tokens.css` and the component stylesheets you use, keep the
token file loaded first, and use the native markup above. No package manager,
build command or JavaScript runtime is required. The generated token CSS must
not be edited by hand; see [tokens/README.md](../tokens/README.md).
