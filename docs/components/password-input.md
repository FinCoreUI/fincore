# PasswordInput

Password input with a visibility toggle. Canonical sources:
[`components/password-input`](../../components/password-input/README.md) and
[`contract.json`](../../components/password-input/contract.json).

## Import

```tsx
import { PasswordInput } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/input.css";
import "@sorleed/react/styles/password-input.css";
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — | Required. |
| `hideLabel` | `boolean` | `false` | Visually hidden label. |
| `helperText` | `string` | — | Shown when there is no error. |
| `errorMessage` | `string` | — | Sets `aria-invalid="true"`. |
| `visible` | `boolean` | — | Controlled visibility. |
| `defaultVisible` | `boolean` | `false` | Uncontrolled initial visibility. |
| `onVisibleChange` | `(visible: boolean) => void` | — | Toggle callback. |
| `showPasswordLabel` | `string` | `"Show password"` | Accessible toggle name. |
| `hidePasswordLabel` | `string` | `"Hide password"` | Accessible toggle name. |

## Behaviour

- The toggle is a real `<button type="button">` with `aria-pressed`.
- Clicking the toggle changes the input type between `password` and `text`.
- Disabled disables both the field and the toggle.

## Accessibility

- Toggle has an accessible name that changes with its state.
- Focus ring is visible on both the field and the toggle.
- Error message is connected with `aria-describedby`.

## Tokens

Composes `--sl-input-*` and `--sl-button-*`. There is no separate
`password-input.*` token family.
