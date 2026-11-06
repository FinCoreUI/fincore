# Weft CLI (Alpha)

Source-distribution CLI for Weft components. Instead of installing compiled packages, the CLI copies canonical source files from this repository into your consumer project.

## Prerequisites

- Node.js (ESM support)
- A React + TypeScript consumer project (bundler recommended for CSS imports)
- For TypeScript consumers using CSS side-effect imports, you may need ambient type declarations for `*.css` (e.g., `declare module "*.css"`)

## Supported components

- `button` - Weft Button (React + TypeScript)
- `input` - Weft Input (React + TypeScript)
- `password-input` - Weft PasswordInput (React + TypeScript)
- `phone-input` - Weft PhoneInput (React + TypeScript)

## Usage

Using `npx` (from installed package):

```bash
npx weft add button --dir /path/to/consumer
```

Or from the repository:

### Preview only (dry-run)
Add `--dry-run` to inspect what would be copied without writing any files:

```bash
node cli/bin/weft.mjs add button --dir /path/to/consumer --dry-run
```

### Installation
Omit `--dry-run` to actually copy files into your consumer project:

```bash
node cli/bin/weft.mjs add button --dir /path/to/consumer
node cli/bin/weft.mjs add input --dir /path/to/consumer
node cli/bin/weft.mjs add password-input --dir /path/to/consumer
node cli/bin/weft.mjs add phone-input --dir /path/to/consumer
```

## Installing into a chosen directory

Use `--dir` to specify the consumer project root. Paths are resolved and must stay within the consumer directory.

## What gets copied

Each component copies:
- Component wrapper: `components/fincore/<component>/index.tsx` (e.g., `password-input/index.tsx`)
- Shared types: `components/fincore/types/index.ts` (shared across Button, Input, PasswordInput, PhoneInput)
- Component CSS: `styles/fincore/<component>.css` (e.g., `password-input.css`)
- Tokens CSS: `styles/fincore/tokens.css` (shared)

## Required CSS imports (order matters)

Import tokens first, then component styles in your app entry point:

```tsx
import "./styles/fincore/tokens.css";
import "./styles/fincore/button.css";
// or ./styles/fincore/input.css
// or ./styles/fincore/phone-input.css
```

CSS imports require a bundler that supports CSS imports. Tokens must be loaded before component CSS.

## Dependencies

- **Button and Input**: No extra runtime dependencies (peer deps: `react >=18.0.0`, `react-dom >=18.0.0`)
- **PhoneInput**: Requires `libphonenumber-js` at runtime for phone-number parsing and validation. Install it in your consumer project:
  ```bash
  npm install libphonenumber-js
  ```
  Button and Input do not require this dependency.
  - Note: `@types/node` is **not** a requirement of PhoneInput or Weft. If a consumer project encounters TypeScript errors for `node:*` imports (such as `node:path`), this typically originates from the consumer's own build tooling or Node-based configuration (e.g. `vite.config.ts`); diagnose the consumer's configuration rather than treating it as a PhoneInput requirement.

## Minimal usage examples

### Button
```tsx
import { Button } from "./components/fincore/button";

<Button variant="primary">Click me</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button disabled>Disabled</Button>
```

### Input
```tsx
import { Input } from "./components/fincore/input";

<Input label="Email" type="email" placeholder="you@example.com" />
<Input label="Name" helperText="Enter your full name" />
<Input label="Account Number" errorMessage="This field is required" />
```

> **Note on Input types:** Weft `Input` strictly supports the following `type` attributes per its component contract: `"text"`, `"email"`, `"tel"`, `"number"`, and `"url"`. Other input types (such as `password`, `search`, `textarea`, `select`, `checkbox`, `otp`, `currency`, or `pin`) are outside the current Input contract. A future Password Input would be a separate component proposal.

### PhoneInput
```tsx
import { PhoneInput } from "./components/fincore/phone-input";

<PhoneInput label="Phone" defaultCountry="US" onChange={(result) => {
  console.log(result.inputValue, result.e164, result.isValid);
}} />
```

## Conflict behaviour and shared-file reuse

- **Shared files** (`components/fincore/types/index.ts`, `styles/fincore/tokens.css`) are reused only if their contents are byte-identical to the canonical sources.
- **If identical**: The file is reused (not copied) and reported as `REUSE`.
- **If different**: A conflict is reported and installation is aborted before copying any files. Existing files are never overwritten.
- **Component files**: If any destination exists, installation aborts before copying anything (no partial installs).
- **Repeated installs**: Conflicts are detected and no files are changed.
- **Rollback**: On copy errors, only files created by this operation are removed.

## Conflict resolution

There is currently **no `--force` or `--skip`** option. To resolve conflicts safely:
1. Remove or rename the conflicting files in your consumer project
2. Re-run the CLI installation
3. Or ensure shared files match the canonical sources byte-for-byte

## TypeScript CSS module declarations

If TypeScript reports errors for CSS side-effect imports (e.g., `Cannot find module or type declarations for side-effect import of '*.css'`), add a declaration file in your consumer project:

```ts
// css.d.ts
declare module "*.css" {
  const content: string;
  export default content;
}
```

## Current alpha limitations

- No `--force` or `--skip` flags.
- Only Button, Input, and PhoneInput are supported.
- No browser rendering verification is performed by the CLI.
- Path traversal is rejected; some edge cases may be reported.
- The tool copies files from the repository; it does **not** publish components or overwrite existing files.

## Notes

- Copies from existing canonical sources in the repository (no duplicated templates)
- The shared `react/types/index.ts` file includes Button, Input, and PhoneInput types
- CSS imports require a bundler that supports CSS imports
- Tokens must be loaded before component CSS
