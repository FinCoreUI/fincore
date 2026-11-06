# FinCore Token Architecture

## Overview

FinCore uses a three-layer token architecture:

Primitive Tokens
↓
Semantic Tokens
↓
Component Tokens

## Relationship to Principles

This architecture supports the principles defined in [FinCore Principles](principles.md).

---

## 1. Primitive Tokens

Raw design values.

Examples:

- neutral.100
- blue.600
- space.4
- radius.md
- elevation.low

Primitive tokens should never be consumed directly by components.

---

## 2. Semantic Tokens

Meaningful aliases that describe purpose rather than appearance.

Examples:

- content.primary
- content.secondary
- surface.default
- border.default
- action.primary
- feedback.success

Semantic tokens reference primitive tokens.

Example:

action.primary → blue.600

---

## 3. Component Tokens

Component-specific references.

Examples:

- button.primary.background
- button.primary.foreground
- input.border.focus
- card.background

Component tokens reference semantic tokens.

Example:

button.primary.background
↓
action.primary
↓
blue.600

---

## Token Flow

Primitive
↓
Semantic
↓
Component
↓
Figma Component
↓
React Component
↓
AI Documentation

This architecture allows FinCore to remain themeable, scalable, and implementation-agnostic.
