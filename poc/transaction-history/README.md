# Transactions proof of concept

An application-level proof of concept that uses FinCore's existing **Button** and
**Input** implementations to build a transaction-history and filtering screen.

It exists to test whether an AI coding agent can follow FinCore's contracts,
token definitions and implementation rules while building a realistic financial
interface. It is **not** a new FinCore component, package or product feature.

- Data is static and **illustrative only**. It does not represent a real customer,
  account or transaction.
- There is no build step, package manifest, dependency, network request or
  external asset.
- The page needs JavaScript to render and filter the static records.
- The financial rules, copy and layout are not FinCore standards. Only the
  Button and Input usage and token consumption are contractual.

---

## 1. What is FinCore and what is application scaffolding

| Element | Ownership |
|---|---|
| `.fc-button` Primary and Secondary actions | **FinCore Button** |
| `.fc-input` field, label, control and helper | **FinCore Input** |
| Page header, account descriptor, balance summary | Application scaffolding |
| Filter form layout and action row | Application scaffolding |
| Transaction table, caption, headers and rows | Application scaffolding |
| Mobile transaction list and cards | Application scaffolding |
| Result-count live region | Application scaffolding |
| Empty state | Application scaffolding |
| Formatting, filtering and focus management | Application code (`poc.js`) |

The table, mobile list, summary block and empty state are ordinary HTML and CSS.
They are not FinCore components, and they deliberately avoid the `fc-` class
prefix. There is no FinCore Table, Card, Badge or Transaction Item in this
repository yet.

---

## 2. FinCore integration

### Button

```html
<button class="fc-button fc-button--secondary" id="tx-clear" type="button">Clear</button>
<button class="fc-button" type="submit">Apply filter</button>
```

- Primary is the default `.fc-button`; it is the single primary action and submits
  the filter form.
- Secondary is used for Clear and is explicitly `type="button"` so it cannot
  submit accidentally.
- Ghost is intentionally omitted: this interface has no additional low-emphasis
  action that is not navigation or asynchronous work.
- No loading, danger, icon-only or size variant is used, and no button is disabled.

### Input

```html
<div class="fc-input">
  <label class="fc-input__label" for="tx-filter">Description</label>
  <div class="fc-input__control">
    <input
      class="fc-input__field"
      id="tx-filter"
      name="filter"
      type="text"
      autocomplete="off"
      placeholder="Filter by description"
      aria-describedby="tx-filter-helper"
    >
  </div>
  <p class="fc-input__message" id="tx-filter-helper">
    Matches description text only. Amounts, references and statuses are not searched.
  </p>
</div>
```

- The label is visible and associated with `for`/`id`.
- The placeholder is a hint, never the label.
- The helper is connected with `aria-describedby` and is a `.fc-input__message`.
- This is a **text filter**, not a search field. `type="search"` is out of contract
  scope and is not used.
- There is no validation state, so no `aria-invalid`, error message or
  `role="alert"` is present. The page never invents an error.
- The application owns filtering and focus management; the Input owns none of it.

---

## 3. Tokens and the primitive-layout exception

The page loads the generated token CSS and the existing component CSS with the
verified relative paths:

```text
../../tokens/dist/tokens.css
../../components/button/button.css
../../components/input/input.css
```

Rules followed:

- No `--fc-*` token is defined locally.
- Every referenced `--fc-*` token exists in `tokens/dist/tokens.css`.
- No colour literal appears in `poc.css` or inline styles.
- `poc.css` never selects `.fc-button` or `.fc-input`, so component states and
  geometry are untouched.
- No token is invented for money, credit/debit direction or transaction status.
- Statuses are neutral text; `color.feedback.*` is not repurposed as a financial
  status meaning.

**Documented exception:** FinCore has no semantic spacing, radius or typography
tokens yet, and the only font sizes are 12px and 14px. Page-level layout therefore
uses primitive tokens — `space.*`, `radius.*`, `font.size.*`,
`font.line-height.*`, `font.weight.*` and `size.border.width`. This is an
application-layout exception only. It does not change the rule that production
components must consume their own component tokens.

Colour comes only from semantic tokens: `color.surface.canvas`,
`color.surface.default`, `color.content.primary`, `color.content.secondary` and
`color.border.subtle`. The page font stack is application-owned because the token
source has no font-family token.

The mobile list uses the same semantic colour tokens and primitive layout tokens.
It defines no new token and no `fc-` class.

---

## 4. Run the page locally

From the repository root:

```sh
python3 -m http.server 8765
```

Then open:

```text
http://127.0.0.1:8765/poc/transaction-history/index.html
```

Serving the repository root keeps the relative CSS paths valid. Opening the file
directly with `file://` is not supported.

Stop the server with `Ctrl+C` when finished.

---

## 5. Run the checker

From the repository root:

```sh
node poc/transaction-history/check.mjs
```

The checker is zero-dependency and exits non-zero on failure. It validates the
PoC's actual files, not the FinCore library. It checks:

1. All five expected files exist.
2. Every `var(--fc-*)` in `poc.css` exists in the generated token CSS.
3. `poc.css` defines no local `--fc-*` tokens and `index.html` has no `<style>`.
4. `poc.css` contains no hex, `rgb()`, `hsl()` or other colour literals.
5. Only FinCore classes that exist in the component CSS are used.
6. Contract-shaped props (`variant=`, `label=`, `helperText=`, `errorMessage=`,
   `state=`, `focused=`, etc.) are not used as native attributes.
7. Every button has an explicit native `type`; there is exactly one primary
   submit action and one secondary `type="button"` Clear action; nothing is
   disabled and Ghost is absent.
8. The filter input has an `id`, a matching `label[for]`, `type="text"`,
   `autocomplete="off"` and no `disabled`.
9. Every `aria-describedby` reference resolves, and the filter helper is a
   `.fc-input__message`.
10. No `role="alert"` or assertive live region is present; the result count is a
    single `role="status"` / `aria-live="polite"` region.
11. The four stylesheets and `poc.js` are local and resolve; there are no inline
    scripts or external URLs.
12. `type="search"`, `type="password"`, disabled controls and inverse surfaces
    are absent.
13. The table has a caption, `thead`, `tbody` and five scoped column headers, and
    the mobile list exists with an accessible name.
14. There are ten records with integer amounts, both credit and debit, at least
    one long description and one long reference, and neutral status values.
15. Amounts use `Intl.NumberFormat`, dates use `Intl.DateTimeFormat`, one currency
    is declared, and the stylesheet uses scoped tabular numerals, wrapping and the
    639px list/table switch.
16. IDs are unique, and `poc.js` renders the table and list from one transaction
    array using the shared date and amount formatters.
17. The README documents the scope, local serving, checker and verification
    limits.

### What the checker cannot verify

- It does not execute the page in a browser.
- It does not prove computed colours, dimensions or focus rings resolve.
- It does not test filtering, Enter submission, Clear, focus return or the
  no-results state.
- It does not test screen readers, keyboard-only use, zoom, forced colours, RTL,
  touch or cross-browser behaviour.
- It does not validate the financial plausibility of the illustrative records.

A passing checker run means the source follows the documented usage rules. It is
not a substitute for browser or accessibility testing.

---

## 6. Verification levels

| Level | What it covers | How |
|---|---|---|
| **Static checks** | File presence, token names, class names, markup structure, absence of forbidden patterns | `node poc/transaction-history/check.mjs` |
| **Library regression** | Contracts, tokens, component CSS/HTML and existing tests | `node components/validate-contracts.mjs`, `node tokens/check.mjs`, `node --test components/test/implementation.test.mjs` |
| **Browser-executed checks** | Asset loading, computed styles, filtering, Enter submission, Clear and focus return, live-region text, empty state, keyboard order, 320/375/640/800px layout and the table/list switch | Serve the root and run the page in a supported browser |
| **Manual accessibility checks** | Screen reader output, zoom/reflow, forced colours, RTL, touch | Manual, per browser and assistive technology |

The static and library checks above are automated. The browser and accessibility
observations below were recorded during Stage 6B, Stage 6C and Stage 6D-3. They
are historical results or stage-specific measurements, not tests executed while
reading this README, and they are not reproducible from the repository without
re-running them.

### Recorded browser evidence (historical, pre-6D-3 layout)

Environment: Google Chrome 156.0.8078.48 (headless, CDP) on macOS, plus the
OpenCode embedded Chromium used in Stage 6B. Firefox, Safari, Edge, screen
readers, zoom, forced colours and touch were not tested.

| Area | Recorded result | Stage |
|---|---|---|
| Assets and console | The document, four stylesheets and `poc.js` loaded from the local server; no console messages or exceptions; no external requests. | 6B |
| Button and Input | Primary `rgb(37, 99, 235)` with white text, Secondary `rgb(244, 244, 245)`, both 40px high; Input 40px with border `rgb(113, 113, 122)`; focus ring `rgb(37, 99, 235)`. | 6B |
| Filtering | Description matching is case-insensitive; Apply and Enter both submit; the result count updates. | 6B |
| Clear and focus | Clear restores all 10 records and returns focus to the filter; keyboard activation also returns `:focus-visible` focus. | 6B |
| Empty state | A no-match term hides the table, shows the empty state and updates the polite status region with the zero-result message. | 6B |
| Keyboard | Tab order is filter → Clear → Apply; in Chrome 156 the scrollable table wrapper is also reachable and ArrowRight scrolls it. | 6B, 6C |
| Accessibility tree | The filter exposes a textbox named “Description” with its helper as the description; the table exposes its caption and column headers; amounts expose sign plus “Debit”/“Credit”. The 320px scroll wrapper is an unnamed `generic` region. | 6B, 6C |

### Recorded responsive evidence (historical, pre-6D-3 layout)

| Width | Recorded result | Stage |
|---|---|---|
| 320px | No page-level horizontal overflow. The table is 326px inside a 302px wrapper, so it needs about 24px of internal horizontal scrolling and the Status column is clipped until scrolled. Dates wrap to three lines; the longest description occupies about ten line boxes. | 6B, re-measured 6C |
| 375px | No page-level or wrapper overflow. The table exactly fills the wrapper, leaving no slack, so the layout is fragile. Dates still wrap to three lines. | 6B, re-measured 6C |
| 800px | No page-level or table-wrapper horizontal scrolling. | 6B |

The table results above describe the layout before Stage 6D-3. They are kept as
history, not as the current behaviour.

### Implemented responsive behaviour (Stage 6D-3)

Below 640px the page shows a semantic transaction list and hides the table; from
640px it shows the table and hides the list. Both are rendered from the same
filtered array, with the same `Intl` date and amount formatting. The inactive
presentation is removed from the accessibility tree with `display: none`.

Measured in Chrome 156.0.8078.48 (headless, CDP) on 28 October 2026:

| Width | Result |
|---|---|
| 320px | No page overflow (320/320). List 302/302, 10 cards. Dates one line; longest description 4 lines; tallest card 169px. Amounts right-aligned, tabular and nowrap. |
| 375px | No page overflow (375/375). List 357/357. Dates one line; longest description 3 lines; tallest card 149px. |
| 639px | List is shown (621/621); table is hidden. Dates one line; longest description 2 lines. |
| 640px | Table is shown (606/606); list is hidden. Dates one line; longest description 4 lines; long row 97px. |
| 800px | Table is shown (766/766); no page or wrapper scroll. Dates one line; longest description 3 lines. |

No visible content is clipped at 320px, and no element inside the list has
horizontal overflow.

The accessibility tree at 320px exposes one named list (“Transaction history”),
10 list items and Date/Status/Reference term–definition pairs, with no table
nodes. At 640px and 800px it exposes the table, rows, five column headers and
cells, with no list nodes. Amount text reads `-$2,499.00, Debit`; the separator
is real text, not CSS-generated content.

Keyboard order at 320px is filter → Clear → Apply, with no additional stops.
Filtering, Enter submission, Clear/focus return and the empty state were also
re-run at 320px against the new list: one matching card, zero cards with the
table and list hidden, and ten cards after Clear.

This is Chrome-only evidence. The README does not claim that the PoC is
mobile-accessible or cross-browser verified; Safari, Firefox, screen readers,
200% zoom, forced colours and touch remain untested.

Supported browser baseline for the FinCore components is Chrome/Edge 105+,
Safari 15.4+ and Firefox 121+, because the Input focus overlay requires `:has()`.
No fallback is bundled.

---

## 7. Illustrative data and financial presentation

The ten records are invented for the proof of concept:

- one currency throughout (`USD`, formatted with `Intl.NumberFormat`);
- dates formatted with `Intl.DateTimeFormat` and exposed as `<time datetime>`;
- credit and debit shown with an explicit `+` or `-` sign **and** a visible
  “Credit” or “Debit” word, so direction never depends on colour;
- statuses (`Completed`, `Pending`, `Failed`) are plain neutral text;
- amounts are right-aligned with tabular numerals in both the table and the
  mobile list;
- the mobile list shows Date, Status and Reference with visible labels;
- one description and one reference are deliberately long to exercise wrapping.

The available-balance figure is a static illustrative value. It is not derived
from the transaction list and does not reconcile to it.

---

## 8. Scope boundaries

In scope: one static page, one filter, ten records, a native table at 640px and
above, a semantic transaction list below 640px, a result count and an empty
state.

Out of scope and deliberately absent:

- network calls, APIs, persistence or authentication;
- pagination, sorting, date filters, amount filters or a select control;
- currency or amount inputs, masks or conversion;
- search-specific input behaviour;
- a FinCore Card, Badge, status pill, icon or Transaction Item component; the
  mobile list is plain application HTML and CSS;
- React, Vue, Web Components, a package manifest or a build pipeline;
- Figma, token, contract, component and foundation-document changes.

Those capabilities need their own FinCore contracts and tokens. They are not
approximated here with invented classes or tokens.
