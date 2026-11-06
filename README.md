# FinCore

An open-source AI-native design infrastructure for financial products.

FinCore provides designers, developers, and AI agents with a shared language for building modern financial experiences.

By combining design systems, code, documentation, and AI context files, FinCore helps teams build consistent, accessible, and scalable fintech products faster.

---

## Why FinCore?

Financial products repeatedly solve the same interface challenges:

* Authentication
* Wallets
* Transfers
* Payments
* KYC Verification
* Transaction Histories
* Account Management

Designers redesign them.

Developers rebuild them.

AI generates them differently every time.

FinCore exists to create a shared foundation that improves consistency across the entire product development lifecycle.

---

## Core Principles

FinCore is governed by eight principles. The authoritative definitions and supporting
commitments are maintained in [`docs/foundation/principles.md`](docs/foundation/principles.md).

* Accessible by Default
* Semantic Over Visual
* Themeable by Design
* Source Owned
* Consistent Yet Flexible
* AI Friendly
* Fintech First
* Component Driven

Supporting commitments, including Mobile First, are recorded there rather than as
additional principles.

---

## v0.1 Release Scope

FinCore v0.1 is a framework-agnostic, native HTML/CSS **Button and Input
component-system release**.

### Delivered

- Native HTML/CSS Button and Input components.
- Generated design-token CSS and machine-readable component contracts.
- Existing token, contract and implementation checks.
- Component catalogue, contract-first usage guide and native reference pages.
- Color System, Design Principles and Token Architecture documentation.
- Runnable transaction-history and payment-form examples.

### Not part of this release

- Card and other planned components.
- Remaining foundation guides: Typography, Spacing, Radius, Sizing, Border,
  Elevation and Motion. Color System, Design Principles and Token Architecture
  are available.
- The AI Context Layer.
- Package, distribution and framework-adapter support.
- Verified cross-browser and assistive-technology support. Only the checks
  recorded in the repository are claimed; unrun environments are not marked as
  passing.

---

## Use FinCore

Start with the [component consumption guide](components/README.md) and the
[runnable transaction-history example](examples/transaction-history/README.md).

FinCore components are framework-agnostic CSS with native HTML. There is no
package manager, build step or JavaScript runtime to install.

---

## Repository Structure

```text
fincore/

├── docs/
├── figma/
├── ai/
├── tokens/
├── components/
├── website/

├── README.md
├── ROADMAP.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── LICENSE
```

---

## Current Roadmap

### Version 0.1

Delivered as the Button/Input component-system release. See the v0.1 Release
Scope above. Card, the remaining foundation guides, the AI Context Layer,
package/distribution and verified cross-browser/assistive-technology support are
deferred.

### Version 0.2

* Core Components Expansion

### Version 0.3

* Fintech Components

See ROADMAP.md for details.

---

## Contributing

We welcome designers, developers, technical writers, and product thinkers.

Please read CONTRIBUTING.md before submitting contributions.

---

## License

MIT License.

---

## Status

FinCore v0.1 is the Button/Input component-system release. Broader roadmap
items—Card, remaining foundation guides, the AI Context Layer,
package/distribution and verified cross-browser/assistive-technology
support—are deferred.
