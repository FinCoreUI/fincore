# Transaction history example

A small, runnable financial interface built with FinCore's existing **Button** and
**Input** components. The page layout, table/list, filtering and formatting are
application code; the component styles are not copied or recreated.

The ten records are illustrative demo data. They are not a real account or
transaction history.

## Run it

From the repository root:

```sh
python3 -m http.server 8765
```

Open:

```text
http://127.0.0.1:8765/examples/transaction-history/
```

Serving the root keeps the token and component stylesheet paths valid.

## What it demonstrates

- The actual `.fc-button` and `.fc-input` markup, loaded from the component CSS.
- Token CSS loaded before the component stylesheets.
- One underlying dataset and one filter used by both the desktop table and the
  narrow-screen list.
- A description-only filter, Enter submission, Clear/focus return, a polite
  status message and an empty state.
- A semantic table with caption and scoped headers at 640px and above; a compact
  list with every field visible below 640px, including 320px.
- Explicit `+`/`-` signs with **Credit**/**Debit** words, neutral statuses, and
  tabular right-aligned amounts.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure and the native Button/Input markup. |
| `example.css` | Page layout only. It defines no `.fc-*` selectors, no `--fc-*` tokens and no colour literals. |
| `example.js` | Demo data, filtering, rendering, status text and focus return. |
| `README.md` | This guide. |

## Copy it into an application

1. Keep `tokens/dist/tokens.css` loaded before `button.css` and `input.css`.
   The component stylesheets do not import tokens.
2. Set a page font. The components use `font-family: inherit` and FinCore ships
   no font file or font-family token.
3. Use the native `.fc-button` and `.fc-input` markup. The application owns
   filtering, validation, error copy, submission and focus.
4. Replace the demo dataset and page-specific `.example-*` CSS with your own
   application code. Do not copy the component CSS into this file.

There is no package manager, build step or FinCore JavaScript runtime.

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
- [Button documentation](../../components/button/README.md) and
  [native reference](../../components/button/button.html)
- [Input documentation](../../components/input/README.md) and
  [native reference](../../components/input/input.html)
