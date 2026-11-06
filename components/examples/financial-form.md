# Contract illustration: a financial transfer form

> **ILLUSTRATIVE ONLY — NOT PRODUCTION CODE. CONTRACT/STRUCTURE ILLUSTRATION, NOT RUNNABLE.**
>
> This file shows how the Button and Input contracts compose at the design-intent level. The components are implemented as production CSS plus native HTML in this repository; the TSX-shaped code below is pseudocode for contract vocabulary, not an exported API or a runnable page.
>
> For the actual consumption API and runnable references, use:
>
> - [Button native reference](../button/button.html) and [Button documentation](../button/README.md)
> - [Input native reference](../input/input.html) and [Input documentation](../input/README.md)
> - [Transaction-history example](../../examples/transaction-history/README.md)
>
> Every prop shown comes from [`../button/contract.json`](../button/contract.json) or [`../input/contract.json`](../input/contract.json). No unlisted prop, variant, state or token is used.

---

## 1. What the example demonstrates

A single-screen "Review transfer" step with three fields and two actions:

| Element | Contract used | Demonstrates |
|---|---|---|
| Recipient email | Input | Visible label, separate placeholder, `type="email"`, `autoComplete="email"`, helper copy |
| Amount (USD) | Input | `inputMode="decimal"`, helper constraint copy, `errorMessage` after unsuccessful validation |
| Reference | Input | Optional field, `helperText`, no error |
| Cancel | Button | `variant="secondary"`, `type="button"` |
| Review transfer | Button | `variant="primary"`, `type="submit"` |

The layout, state and validation plumbing are illustrative. Only the component APIs and tokens are contractual.

---

## 2. Layout

```text
Transfer details                       (application heading)

Recipient email            [required]
┌────────────────────────────────────────┐
│ you@example.com                        │
└────────────────────────────────────────┘
We'll email a receipt to this address.

Amount (USD)               [required]
┌────────────────────────────────────────┐
│ 1,250.00                               │
└────────────────────────────────────────┘
Enter an amount between 10.00 and 5,000.00.

Reference (optional)
┌────────────────────────────────────────┐
│ Invoice 4821                           │
└────────────────────────────────────────┘
Appears on your statement.

                          [ Cancel ] [ Review transfer ]
```

The error variant of the amount field after a failed submit:

```text
Amount (USD)               [required]
┌────────────────────────────────────────┐
│ 5                                      │  ← border: input.border-error
└────────────────────────────────────────┘
Enter an amount of at least 10.00.         ← text:   input.text-error
```

If focus moves to that field, it renders **Error + Focused**: the red border and red message remain, and the 2px blue `input.focus.color` ring appears around the control.

---

## 3. Component code — contract-shaped pseudocode (not runnable)

> The TSX below is pseudocode for contract vocabulary only. FinCore does not export a React component; the runnable API is native HTML/CSS, as shown in the reference pages linked above.

```tsx
// CONTRACT-SHAPED PSEUDOCODE ONLY. Not an exported API or a runnable page.
// The actual API is native HTML/CSS; see ../button/button.html,
// ../input/input.html and ../../examples/transaction-history/.

import { useState, type FormEvent } from "react";

export function TransferDetailsForm() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    amount?: string;
  }>({});

  // Application-owned validation. The Input component does not validate.
  // Field blur checks only that field; submit checks every field once.
  function emailError(value: string): string | undefined {
    if (!value.trim()) return "Enter the recipient's email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Enter a valid email address.";
    }
    return undefined;
  }

  function amountError(value: string): string | undefined {
    if (!value.trim()) return "Enter an amount.";
    const parsed = Number(value.replace(/,/g, ""));
    if (Number.isNaN(parsed)) return "Enter a valid amount.";
    if (parsed < 10) return "Enter an amount of at least 10.00.";
    if (parsed > 5000) return "Enter an amount of 5,000.00 or less.";
    return undefined;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next = {
      email: emailError(email),
      amount: amountError(amount),
    };
    setErrors(next);

    // Focus the first invalid field by its documented id. This produces
    // Error + Focused when the field was not already focused.
    const firstInvalidId = next.email
      ? "recipient-email"
      : next.amount
        ? "amount"
        : null;
    if (firstInvalidId) {
      document.getElementById(firstInvalidId)?.focus();
      return;
    }

    // Illustrative only: a real flow would call an API and handle failure.
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1>Transfer details</h1>

      <Input
        id="recipient-email"
        name="recipientEmail"
        label="Recipient email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        onBlur={() => {
          if (email.length > 0 || errors.email) {
            setErrors((prev) => ({ ...prev, email: emailError(email) }));
          }
        }}
        helperText="We'll email a receipt to this address."
        placeholder="you@example.com"
        errorMessage={errors.email}
        required
      />

      <Input
        id="amount"
        name="amount"
        label="Amount (USD)"
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        onBlur={() => {
          if (amount.length > 0 || errors.amount) {
            setErrors((prev) => ({ ...prev, amount: amountError(amount) }));
          }
        }}
        helperText="Enter an amount between 10.00 and 5,000.00."
        placeholder="0.00"
        errorMessage={errors.amount}
        required
      />

      <Input
        id="reference"
        name="reference"
        label="Reference (optional)"
        type="text"
        autoComplete="off"
        value={reference}
        onChange={(event) => setReference(event.target.value)}
        helperText="Appears on your statement."
        maxLength={18}
      />

      <div className="actions">
        {/* Secondary, type=button: cannot submit the form accidentally. */}
        <Button
          variant="secondary"
          type="button"
          label="Cancel"
          onClick={() => {
            // Illustrative: a real flow would navigate back or close the step.
          }}
        />
        {/* One primary action. type=submit drives native form submission. */}
        <Button variant="primary" type="submit" label="Review transfer" />
      </div>
    </form>
  );
}
```

### ARIA wiring is application-owned

The example deliberately does not invent an `aria-describedby` convention. The application sets `aria-invalid="true"` and associates the visible error with the control (`aria-describedby` and/or `aria-errormessage`) using a stable id in its own markup. The native reference markup shows this; it is a production requirement, not a prop invented here.

---

## 4. Why each decision follows the contracts

### Input decisions

| Decision | Contract rule |
|---|---|
| Every field has a visible `label` | The label is required; the placeholder is never the label. |
| `placeholder` is an example or format hint | `placeholder` is optional and never carries the accessible name. |
| `helperText` explains format before an error exists | Helper copy is the pre-error guidance slot. |
| `errorMessage` is set only after validation | The application owns validation; error replaces helper copy. |
| Error is a red border **and** a message | Colour alone is not an accessible error signal. |
| No `focused`, `filled` or `showPlaceholder` props | They are derived from focus and value, never exposed. |
| No `showHelper` prop | The helper row is derived; `ShowHelper` is ignored in Error anyway. |
| `type="email"` with `autoComplete="email"` | Only `text`, `email`, `tel`, `number` and `url` are supported, with the matching autocomplete token. |
| Amount uses `type="text"` + `inputMode="decimal"` | There is no currency input; `number` spinners are avoided by using a text control with a decimal keyboard hint. Formatting and parsing stay in the application. |
| `required` on email and amount | Native required plus a visible requirement in the form copy. |
| `noValidate` on the form | The example owns its error copy and timing; the component does not validate. |
| No fixed 320px width | 320px is a Figma demo literal; width belongs to layout. |

### Button decisions

| Decision | Contract rule |
|---|---|
| Exactly one `variant="primary"` | One primary action per decision group. |
| `Cancel` is `variant="secondary"`, `type="button"` | A quieter alternative that cannot submit accidentally. |
| `Review transfer` is `type="submit"` | Native form submission and keyboard activation. |
| No `disabled` on the primary action | Disabled is not used as form validation; the form validates and explains. |
| No loading or spinner | No loading state exists; async feedback belongs outside the button. |
| No icon | There is no icon system or icon-only contract. |
| Labels are verb-led and specific | "Review transfer", "Cancel". |
| No `state` prop | Interaction state is derived by the component. |

### Groups and surfaces

- The form sits on a supported surface: `default`, `canvas`, `subtle`, `muted` or `raised`.
- **Do not** place this form on `color.surface.inverse` or any dark surface. The Input label, helper and error text fail contrast there, and Ghost would fail on the buttons.

---

## 5. Invalid variants of the same screen

Each line below breaks a specific rule from the contracts.

```tsx
// 1. Placeholder-only email field: no label, no accessible name.
<Input id="email" placeholder="Email address" value={email} onChange={setEmail} />

// 2. Helper and error stacked: conflicting guidance in two rows.
<Input
  id="amount"
  label="Amount (USD)"
  helperText="Enter an amount between 10.00 and 5,000.00."
  errorMessage="Enter an amount of at least 10.00."
  stackedHelper
/>

// 3. Figma booleans exposed as props: the UI can lie about focus and value.
<Input id="email" label="Email" focused filled showPlaceholder />

// 4. Error hidden by a helper-visibility prop.
<Input id="email" label="Email" errorMessage="Enter a valid email." showHelper={false} />

// 5. Red border without a message.
<Input id="email" label="Email" state="error" />

// 6. Placeholder used as the only label.
<Input id="reference" placeholder="Reference (optional)" value={reference} onChange={setReference} />

// 7. Inverse surface: label 1.70:1, helper 2.29:1, error 2.13:1.
<div style={{ background: "var(--fc-color-surface-inverse)" }}>
  <Input id="email" label="Email" value={email} onChange={setEmail} />
</div>

// 8. Currency input faked from a text field with custom masking inside the component.
<Input id="amount" label="Amount" currency mask="USD" value={amount} onChange={setAmount} />

// 9. Two primary buttons competing for the same decision.
<Button variant="primary" label="Review transfer" />
<Button variant="primary" label="Send now" />

// 10. Disabled submit used instead of validation feedback.
<Button variant="primary" type="submit" label="Review transfer" disabled />

// 11. Button used for navigation.
<Button variant="ghost" label="Back to accounts" onClick={() => navigate("/accounts")} />

// 12. Danger variant invented for a destructive action.
<Button variant="danger" label="Cancel transfer" />
```

---

## 6. What this example deliberately does not do

- It does not implement the Button or Input primitives; those exist as production CSS and native HTML in this repository. This file is not a runnable page; use the native reference pages and the transaction-history example.
- It does not define new props, variants, states, tokens or CSS variables.
- It does not add a currency mask, formatting layer, async validation or submit API.
- It does not use an inverse or dark surface.
- It does not show a success state, because Input has none.
- It does not claim the layout, copy or validation rules are FinCore standards; they are illustrative.

---

## 7. Checklist for adapting this example

When reusing this composition in a real product:

1. Confirm the target surface is `default`, `canvas`, `subtle`, `muted` or `raised`.
2. Keep every field's visible label and its programmatic association.
3. Keep placeholder copy as an example, never as the label.
4. Move validation to the application, on blur or submit.
5. Set `errorMessage` with a real message; never style a red border alone.
6. Move focus to the first invalid field after a failed submit.
7. Keep exactly one primary action per decision group.
8. Keep `Cancel` as `type="button"` and the advancing action as `type="submit"`.
9. Do not add icons, loading, danger, success, readOnly or inverse treatments.
10. Verify all contrast pairs after any theme override; keep the protected token files unchanged.
