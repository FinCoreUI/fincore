# FinCore browser smoke testing

This runbook covers the dependency-free browser fixture at
[`browser-smoke.html`](./browser-smoke.html). It uses the existing generated
tokens and component CSS; no package, bundler or test framework is required.

The fixture is a development aid, not a production page. It does not replace
screen-reader, forced-colours, zoom, RTL or cross-browser certification.

## 1. Serve the repository root

From the repository root:

```sh
python3 -m http.server 8765
```

Then open:

```text
http://127.0.0.1:8765/components/test/browser-smoke.html
```

Serving the repository root keeps these relative paths valid:

- `../../tokens/dist/tokens.css`
- `../button/button.css`
- `../input/input.css`

## 2. Browser-executed assertions

When the page loads, the fixture runs native DOM and `getComputedStyle`
assertions and writes a summary to the `#results` element. A successful run
ends with:

```text
PASS  ...
```

and `0 failed`; the results element also exposes `data-status="pass"`. The fixture checks:

- Button variant colours and 40px / 6px geometry.
- Disabled Primary, Secondary and Ghost treatment.
- Default Input geometry, border and text colours.
- Disabled Input semantics and colours.
- Error border, error message colour, `aria-invalid`, and `aria-describedby`.
- Helper `aria-describedby` references.
- The visually hidden label remains associated through `input.labels`.
- Enabled controls are keyboard-focusable.

These assertions only execute when the file is opened in a browser. The Node
test suite checks the fixture's structure and required cases; it does **not**
execute the browser assertions.

## 3. Manual checks

Perform these manually in each browser under test:

1. Tab through the enabled buttons and Inputs. Confirm the focus ring is visible.
2. Confirm disabled buttons and the disabled Input are skipped.
3. Confirm the Ghost focus label is dark (`button.ghost.foreground`), not blue.
4. Confirm the Error Input keeps its red border and red message while focused.
5. Confirm the hidden label is not visible, but the field still has an
   accessible name in the browser accessibility tree.
6. Confirm the Ghost Disabled label is transparent-background text and remains
   legible as an inactive control; do not treat it as a contrast pass.
7. Confirm no static error message is announced on first paint.

Use the existing [`input.html`](../input/input.html) and
[`button.html`](../button/button.html) reference pages for form/Enter behaviour
and the broader state examples.

## 4. Browser baseline

The approved baseline is:

| Browser | Minimum version | Status |
|---|---|---|
| Chrome / Edge | 105+ | **UNVERIFIED** — run this fixture and record the result |
| Safari | 15.4+ | **UNVERIFIED** — run this fixture and record the result |
| Firefox | 121+ | **UNVERIFIED** — run this fixture and record the result |

Do not mark a browser as passing until the fixture and manual checks have
actually run in that browser. Record the date, browser version, fixture result
and any manual observations in the table below.

| Browser | Version | Fixture | Manual checks | Date / notes |
|---|---|---|---|---|
| Chrome / Edge |  |  |  |  |
| Safari |  |  |  |  |
| Firefox |  |  |  |  |

## 5. Scope boundaries

- The historical Chromium smoke check in
  [`../IMPLEMENTATION.md`](../IMPLEMENTATION.md) is not a substitute for this
  runbook.
- `:has()` support is required for the Input focus overlay and disabled
  suppression. Older browsers are outside the approved baseline.
- Forced-colours, text zoom, RTL, mobile/touch and screen-reader behaviour need
  separate checks and remain outside this fixture.
