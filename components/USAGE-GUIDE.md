# Contract-first component usage

Use this workflow whenever a developer or AI agent adds FinCore components to an
interface. The goal is to consume the existing classes and tokens, not to
recreate or extend the components.

## 1. Find the component in the catalogue

Start with [CATALOG.md](./CATALOG.md). It lists the **implemented** components,
their supported variants/states and their canonical files. If a component or
state is not listed, it is not available. Do not invent it.

## 2. Inspect the canonical contract and implementation

Read the contract first, then the native reference markup and CSS:

| Component | Contract | Native reference | CSS | Documentation |
|---|---|---|---|---|
| Button | [`button/contract.json`](./button/contract.json) | [`button/button.html`](./button/button.html) | [`button/button.css`](./button/button.css) | [`button/README.md`](./button/README.md) |
| Input | [`input/contract.json`](./input/contract.json) | [`input/input.html`](./input/input.html) | [`input/input.css`](./input/input.css) | [`input/README.md`](./input/README.md) |

Also read [`IMPLEMENTATION.md`](./IMPLEMENTATION.md) for the framework-agnostic
native API and [`contract.schema.json`](./contract.schema.json) for the schema.
The TypeScript/React fragments in `examples/financial-form.md` are
contract-shaped pseudocode, not exported code.

## 3. Confirm states, markup and stylesheet dependencies

Load the generated token CSS before the component CSS:

```html
<link rel="stylesheet" href="tokens/dist/tokens.css">
<link rel="stylesheet" href="components/button/button.css">
<link rel="stylesheet" href="components/input/input.css">
```

Adjust the paths for the page's depth. The component CSS does not import token
CSS. Set a page font because both components use `font-family: inherit`.
FinCore ships no font file or font-family token.

The component stylesheets consume only their own component tokens
(`--fc-button-*` or `--fc-input-*`). Do not create or redefine `--fc-*` tokens in
application CSS.

## 4. Reuse the existing API

### Button

```html
<button class="fc-button fc-button--secondary" type="button">Clear</button>
<button class="fc-button" type="submit">Review payment</button>
```

- `.fc-button` is Primary by default; `.fc-button--secondary` is the quieter
  alternative. `.fc-button--ghost` exists for low-emphasis actions on supported
  light surfaces. `.fc-button--primary` is an optional explicit primary alias.
- Always set an explicit native `type`.
- Use one Primary per decision group.
- Native `disabled` is the disabled API. There is no `state`, `variant`,
  `loading` or icon prop.

### Input

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
```

For an application-owned error, keep the same field anatomy, set
`aria-invalid="true"`, replace the helper copy with the error text and add
`.fc-input__message--error`:

```html
<div class="fc-input">
  <label class="fc-input__label" for="filter">Description</label>
  <div class="fc-input__control">
    <input
      class="fc-input__field"
      id="filter"
      name="filter"
      type="text"
      aria-invalid="true"
      aria-describedby="filter-error"
    >
  </div>
  <p class="fc-input__message fc-input__message--error" id="filter-error">
    Enter a description before applying the filter.
  </p>
</div>
```

- Use a persistent `.fc-input__label`; the placeholder is never the label.
- Use `aria-describedby` for helper or error text.
- The application sets `aria-invalid`, supplies the error text and associates it.
- Validate on blur or submit, not on every keystroke.
- Supported single-line types are `text`, `email`, `tel`, `number` and `url`.
- Password, search, textarea, select, OTP, currency, PIN and read-only fields are
  not Input; use a future contract, not a workaround that pretends otherwise.

## 5. Keep application behaviour outside the component

FinCore provides CSS and native markup. It does **not** provide JavaScript
runtime, event handlers, filtering, validation, formatting, masking, focus
management, review state, loading state, errors or submission.

The application owns:

- layout and responsive presentation around the components;
- values, labels, helper and error copy;
- `aria-invalid`, `aria-describedby`, focus movement and error announcements;
- click, submit, reset, filtering and review behaviour;
- application-specific messages and status regions;
- any data, API or payment service. None is connected in the examples.

If the UI needs a state the component does not support, stop and propose a
contract change, or use page-owned layout/content around the existing component.
Do not fake a component state with a new class or token.

## 6. Run the checks and test the interface

From the repository root:

```sh
node components/validate-contracts.mjs
node tokens/check.mjs
node --test components/test/implementation.test.mjs
```

Then serve the root and verify in a browser:

```sh
python3 -m http.server 8765
```

Useful checks:

```text
http://127.0.0.1:8765/components/test/browser-smoke.html
http://127.0.0.1:8765/components/button/button.html
http://127.0.0.1:8765/components/input/input.html
```

The browser fixture should end with `data-status="pass"` and `0 failed`; its
manual checks are in [`test/BROWSER-TESTING.md`](./test/BROWSER-TESTING.md).
Test the actual composition at the target widths, including keyboard order,
focus, invalid submission, empty/reset states and any review flow.

## Runnable examples

- [Transaction history](../examples/transaction-history/README.md) — table/list
  filtering, empty state, one Primary and one secondary Clear.
- [Payment form](../examples/payment-form/README.md) — validation, review and
  reset with the same Button and Input APIs.

Both examples link the real token and component stylesheets. They do not copy
component CSS or introduce a framework.

## Do not

- Do not invent variants such as danger, success, loading, icon-only, link, size
  or full-width variants.
- Do not invent props or attributes such as `variant`, `state`, `focused`,
  `filled`, `showPlaceholder` or `showHelper`.
- Do not invent `fc-` classes, `--fc-*` tokens, component state selectors or
  framework wrappers.
- Do not copy component CSS into an application or override component state
  rules.
- Do not claim FinCore supplies JavaScript behaviour. The application owns it.
- Do not use unsupported input types, inverse/dark Input surfaces, or an error
  border without explanatory text.
- Do not introduce a package manager, bundler or runtime unless a separate
  architectural decision explicitly approves it.

If a required capability is missing, document the gap and propose a contract
change. Existing APIs are the source of truth.
