# Payment form example

A small, runnable demo payment form built with FinCore's existing **Button** and
**Input** components. It is illustrative only: no payment is sent, no money
moves, no backend is called, and no real credentials are requested.

## Run it

From the repository root:

```sh
python3 -m http.server 8765
```

Open:

```text
http://127.0.0.1:8765/examples/payment-form/
```

Serving the root keeps the token and component stylesheet paths valid.

## Stylesheet order

The page loads these existing files from its own directory:

```html
<link rel="stylesheet" href="../../tokens/dist/tokens.css">
<link rel="stylesheet" href="../../components/button/button.css">
<link rel="stylesheet" href="../../components/input/input.css">
```

Token CSS must load first. The component stylesheets do not import it. The
page also sets a body font because the components use `font-family: inherit`;
FinCore ships no font file or font-family token.

## FinCore components reused

- **Button:** the native `.fc-button` primary action (`Review payment` and
  `Edit details`) and `.fc-button--secondary` actions (`Clear` and
  `Reset demo`).
- **Input:** the full `.fc-input` field anatomy for recipient name, account
  number, bank, optional payment reference and amount. The example uses the
  Default state and the application-driven Error state
  (`aria-invalid="true"` plus `.fc-input__message--error`). Focus is the
  component's native focus overlay.
- The source account is a static application summary rather than an Input. No
  field is genuinely unavailable, so the Input disabled state is not used.

The example does not copy component CSS, add `fc-` selectors or tokens, or add
a framework, package manager, bundler or JavaScript runtime from FinCore.

## What belongs to the example

FinCore supplies the Button and Input CSS and their documented native APIs. The
example owns:

- the demo source-account summary and demo bank list;
- form submission prevention and local validation, including optional reference
  handling;
- `aria-invalid`, helper/error copy, and `aria-describedby` wiring;
- the review summary, edit/reset transitions and focus management;
- the live status messages and the explicit “no payment sent” wording.

The amount is a native text input with `inputmode="decimal"` because FinCore has
no currency-input component. The bank field is a native Input with a
`<datalist>` of demo banks; there is no Select component in v0.1.

The example needs JavaScript for validation, review and reset. FinCore supplies
no JavaScript runtime; all interaction code is page-owned.

## Try it with demo data

1. Choose **Review payment** with empty fields. The form shows inline errors,
   updates the polite status, and moves focus to the first invalid field.
2. Enter a fictional recipient such as `Ada Lovelace`, account number
   `12345678`, bank `Northwind Bank`, an optional reference such as
   `Invoice 4821`, and amount `250.00`, then choose **Review payment**. The
   review panel shows the entered values and states clearly that no payment has
   been sent. A blank reference appears as “Not provided”.
3. Choose **Edit details** to return to the form with values preserved.
4. Choose **Reset demo** from review, or **Clear** from the form, to clear the
   fields, errors and review state and return focus to the first field.

The bank list contains only fictional demo banks: Northwind Bank, Harbor Credit
Union and Summit Savings. Amounts must be between $1.00 and $5,000.00. The
payment reference is optional and limited to 18 letters, numbers, spaces or
hyphens.

## Verify the setup

Open the existing browser fixture through the same server:

```text
http://127.0.0.1:8765/components/test/browser-smoke.html
```

It should end with `data-status="pass"` and `0 failed`. The keyboard and visual
checks are in
[components/test/BROWSER-TESTING.md](../../components/test/BROWSER-TESTING.md).

The approved modern-browser baseline is Chrome/Edge 105+, Safari 15.4+ and
Firefox 121+. Input uses `:has()` for its focus overlay and disabled
suppression; no fallback is bundled.

## Related documentation

- [Component consumption guide](../../components/README.md)
- [Token consumption](../../tokens/README.md)
- [Transaction-history example](../transaction-history/README.md)
- [Button documentation](../../components/button/README.md) and
  [native reference](../../components/button/button.html)
- [Input documentation](../../components/input/README.md) and
  [native reference](../../components/input/input.html)
