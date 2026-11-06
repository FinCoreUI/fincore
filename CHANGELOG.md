# Changelog

All notable changes to Sorleed are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
semantic versioning.

## [Unreleased]

### Added

- Documentation website under `website/`.
- AI context layer under `ai/`.
- Figma delivery preparation under `figma/`: token import, component
  specifications and SVG evidence.
- CLI `list` and `--version` commands, plus `list --json` for tooling.
- Component reference pages under `docs/components/`.
- Release, versioning, publishing and deployment guidance under `docs/release/`.
- Consumer installation tests for the packed React and CLI packages.
- `CHANGELOG.md`.

### Changed

- `@sorleed/react` now exports `PhoneInput` from the package root.
- PhoneInput country options use English region names from `Intl.DisplayNames`
  with a two-letter code fallback, plus dial codes.
- CLI accepts flags before the component name.

### Fixed

- Resolved `tsup` and `esbuild` advisories by upgrading to `tsup` 8.4.0 and
  pinning `esbuild` 0.25.12.

## [0.1.0-alpha.2] — 2026-11-06

### Added

- Eight new canonical components: Select, Checkbox, Radio Group, Textarea, OTP, Currency, CVV, and DatePicker.
- Token layer dark theme support with semantic overrides via `[data-theme="dark"]` and `.dark`.
- Size variants (`sm` / `md` / `lg`) and loading state treatment across Button and Input family controls.
- Full CLI template parity and generator registry for all twelve components.
- Zero-dependency test suites for all new components verifying contracts, tokens, and native markup.

### Changed

- Updated PhoneInput dependency architecture to keep `libphonenumber-js` as an optional peer dependency with safe runtime fallback.

## [0.1.0-alpha.1] — 2026-11-04

### Added

- Four canonical components: Button, Input, PasswordInput and PhoneInput.
- Four React adapters with TypeScript declarations.
- 229 `--sl-*` design tokens across primitive, semantic and component layers.
- Source-distribution CLI for the four components.
- Contract, parity and component tests.
- Governance, security and contribution policies.
- MIT licence.

### Security

- Dependabot alerts and weekly update configuration.
- No known vulnerabilities in the React dependency tree after the dependency
  update.

## Earlier internal history

FinCore and Weft were internal development identities. They were never launched
products and there is no customer migration path. Sorleed is the product
identity from the beginning.
