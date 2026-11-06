# Tokens

`tokens/dist/tokens.css` is the generated CSS that applications consume. It
defines the `--fc-*` custom properties used by the Button and Input
stylesheets.

## Consuming the generated CSS

1. Serve or copy `tokens/dist/tokens.css`.
2. Load it **before** the component stylesheets:

   ```html
   <link rel="stylesheet" href="tokens/dist/tokens.css">
   <link rel="stylesheet" href="components/button/button.css">
   <link rel="stylesheet" href="components/input/input.css">
   ```

3. Do not edit `tokens/dist/tokens.css` by hand.

The component stylesheets do **not** import token CSS automatically. Loading a
component stylesheet without `tokens/dist/tokens.css` leaves its component
variables undefined.

Consuming the existing generated CSS requires **no build command and no package
manager**. Node is only needed when maintaining the token source or regenerating
the CSS.

## Source and maintenance

- `tokens/tokens.json` is the token source of truth.
- `tokens/check.mjs` is the zero-dependency validator and generator.
- `node tokens/check.mjs` validates the source, contrast pairs and generated CSS.
- `node tokens/check.mjs --write` regenerates `tokens/dist/tokens.css` after an
  intentional token-source change. Consumers should not need this command.

The generated file contains primitive, semantic and component tokens. Component
CSS consumes its own `--fc-button-*` or `--fc-input-*` variables; application
layout should use the documented semantic or primitive variables as needed.
Light theme is the only implemented theme. Do not redefine generated variables
in application CSS; make theme changes at the token source and revalidate
contrast.

See [components/README.md](../components/README.md) for the component quickstart
and [examples/transaction-history](../examples/transaction-history/README.md)
for a runnable page that loads this file before the component CSS.
