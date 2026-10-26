# FinCore Color System

## Status

- Version: 0.1.0
- Status: Foundation
- Layer: Design Tokens
- Applies to: Figma, CSS, React, AI tooling

---

## 1. Purpose

The FinCore color system separates raw color values from the meaning those colors represent.

FinCore uses three layers:

Primitive Color
↓
Semantic Color
↓
Component Tokens

Example:

blue.600
↓
color.action.primary
↓
button.primary.background

Consumers may replace primitive values without changing component architecture.

---

## 2. Core Principles

### 2.1 Semantic over visual

Components must consume semantic tokens.

Do not use:

blue.600
red.500
neutral.900

directly inside components.

Instead use:

color.action.primary
color.feedback.error
color.content.primary

---

### 2.2 FinCore has no mandatory brand color

FinCore does not define a permanent primary brand color.

The default palette exists as a reference implementation.

A consumer may map:

color.action.primary → blue.600

or:

color.action.primary → orange.600

or:

color.action.primary → their own custom brand token.

---

### 2.3 Themeable

Semantic tokens must support multiple themes.

Minimum supported themes:

- Light
- Dark

Future consumers may create additional themes.

---

## 3. Primitive Color Tokens

Primitive tokens represent raw color values.

They do not communicate meaning.

### 3.1 Neutral

| Token       | Value   |
| ----------- | ------- |
| neutral.50  | #FAFAFA |
| neutral.100 | #F4F4F5 |
| neutral.200 | #E4E4E7 |
| neutral.300 | #D4D4D8 |
| neutral.400 | #A1A1AA |
| neutral.500 | #71717A |
| neutral.600 | #52525B |
| neutral.700 | #3F3F46 |
| neutral.800 | #27272A |
| neutral.900 | #18181B |
| neutral.950 | #09090B |

### 3.2 Blue

| Token    | Value   |
| -------- | ------- |
| blue.50  | #EFF6FF |
| blue.100 | #DBEAFE |
| blue.200 | #BFDBFE |
| blue.300 | #93C5FD |
| blue.400 | #60A5FA |
| blue.500 | #3B82F6 |
| blue.600 | #2563EB |
| blue.700 | #1D4ED8 |
| blue.800 | #1E40AF |
| blue.900 | #1E3A8A |
| blue.950 | #172554 |

### 3.3 Green

| Token     | Value   |
| --------- | ------- |
| green.50  | #F0FDF4 |
| green.100 | #DCFCE7 |
| green.200 | #BBF7D0 |
| green.300 | #86EFAC |
| green.400 | #4ADE80 |
| green.500 | #22C55E |
| green.600 | #16A34A |
| green.700 | #15803D |
| green.800 | #166534 |
| green.900 | #14532D |
| green.950 | #052E16 |

### 3.4 Amber

| Token     | Value   |
| --------- | ------- |
| amber.50  | #FFFBEB |
| amber.100 | #FEF3C7 |
| amber.200 | #FDE68A |
| amber.300 | #FCD34D |
| amber.400 | #FBBF24 |
| amber.500 | #F59E0B |
| amber.600 | #D97706 |
| amber.700 | #B45309 |
| amber.800 | #92400E |
| amber.900 | #78350F |
| amber.950 | #451A03 |

### 3.5 Red

| Token   | Value   |
| ------- | ------- |
| red.50  | #FEF2F2 |
| red.100 | #FEE2E2 |
| red.200 | #FECACA |
| red.300 | #FCA5A5 |
| red.400 | #F87171 |
| red.500 | #EF4444 |
| red.600 | #DC2626 |
| red.700 | #B91C1C |
| red.800 | #991B1B |
| red.900 | #7F1D1D |
| red.950 | #450A0A |

### 3.6 Purple

| Token      | Value   |
| ---------- | ------- |
| purple.50  | #FAF5FF |
| purple.100 | #F3E8FF |
| purple.200 | #E9D5FF |
| purple.300 | #D8B4FE |
| purple.400 | #C084FC |
| purple.500 | #A855F7 |
| purple.600 | #9333EA |
| purple.700 | #7E22CE |
| purple.800 | #6B21A8 |
| purple.900 | #581C87 |
| purple.950 | #3B0764 |

### 3.7 Orange

| Token      | Value   |
| ---------- | ------- |
| orange.50  | #FFF7ED |
| orange.100 | #FFEDD5 |
| orange.200 | #FED7AA |
| orange.300 | #FDBA74 |
| orange.400 | #FB923C |
| orange.500 | #F97316 |
| orange.600 | #EA580C |
| orange.700 | #C2410C |
| orange.800 | #9A3412 |
| orange.900 | #7C2D12 |
| orange.950 | #431407 |

---

## 4. Semantic Color Tokens

Semantic tokens describe purpose.

### 4.1 Content

| Token                    | Light       |
| ------------------------ | ----------- |
| color.content.primary    | neutral.900 |
| color.content.secondary  | neutral.700 |
| color.content.tertiary   | neutral.500 |
| color.content.disabled   | neutral.400 |
| color.content.inverse    | neutral.50  |
| color.content.link       | blue.600    |
| color.content.link-hover | blue.700    |

---

### 4.2 Surface

| Token                 | Light       |
| --------------------- | ----------- |
| color.surface.canvas  | neutral.50  |
| color.surface.default | #FFFFFF     |
| color.surface.subtle  | neutral.100 |
| color.surface.muted   | neutral.200 |
| color.surface.raised  | #FFFFFF     |
| color.surface.inverse | neutral.900 |

---

### 4.3 Border

| Token                 | Light       |
| --------------------- | ----------- |
| color.border.subtle   | neutral.200 |
| color.border.default  | neutral.300 |
| color.border.strong   | neutral.400 |
| color.border.disabled | neutral.200 |
| color.border.focus    | blue.600    |

---

### 4.4 Actions

| Token                             | Light       |
| --------------------------------- | ----------- |
| color.action.primary              | blue.600    |
| color.action.primary-hover        | blue.700    |
| color.action.primary-active       | blue.800    |
| color.action.primary-foreground   | #FFFFFF     |
| color.action.secondary            | neutral.100 |
| color.action.secondary-hover      | neutral.200 |
| color.action.secondary-active     | neutral.300 |
| color.action.secondary-foreground | neutral.900 |
| color.action.ghost-hover          | neutral.100 |
| color.action.ghost-active         | neutral.200 |
| color.action.disabled             | neutral.200 |
| color.action.disabled-foreground  | neutral.400 |

---

### 4.5 Feedback

#### Success

| Token                             | Light     |
| --------------------------------- | --------- |
| color.feedback.success            | green.600 |
| color.feedback.success-background | green.50  |
| color.feedback.success-border     | green.200 |
| color.feedback.success-foreground | green.800 |

#### Warning

| Token                             | Light     |
| --------------------------------- | --------- |
| color.feedback.warning            | amber.600 |
| color.feedback.warning-background | amber.50  |
| color.feedback.warning-border     | amber.200 |
| color.feedback.warning-foreground | amber.800 |

#### Error

| Token                           | Light   |
| ------------------------------- | ------- |
| color.feedback.error            | red.600 |
| color.feedback.error-background | red.50  |
| color.feedback.error-border     | red.200 |
| color.feedback.error-foreground | red.800 |

#### Information

| Token                          | Light    |
| ------------------------------ | -------- |
| color.feedback.info            | blue.600 |
| color.feedback.info-background | blue.50  |
| color.feedback.info-border     | blue.200 |
| color.feedback.info-foreground | blue.800 |

---

## 5. Dark Theme

Semantic tokens must be remapped for dark mode.

The primitive palette does not need to change.

Example:

| Token                   | Dark        |
| ----------------------- | ----------- |
| color.content.primary   | neutral.50  |
| color.content.secondary | neutral.300 |
| color.content.tertiary  | neutral.400 |
| color.content.disabled  | neutral.600 |
| color.content.inverse   | neutral.900 |
| color.surface.canvas    | neutral.950 |
| color.surface.default   | neutral.900 |
| color.surface.subtle    | neutral.800 |
| color.surface.muted     | neutral.700 |
| color.surface.raised    | neutral.800 |
| color.surface.inverse   | neutral.50  |
| color.border.subtle     | neutral.800 |
| color.border.default    | neutral.700 |
| color.border.strong     | neutral.600 |

Interactive and feedback colors must be validated for sufficient contrast in dark mode rather than simply inverted.

---

## 6. Component Consumption Rule

Components must not consume primitive tokens directly.

Correct:

button.primary.background
→ color.action.primary
→ blue.600

Incorrect:

button.primary.background
→ blue.600

This preserves themeability.

---

## 7. Customization

Consumers may override primitive values and semantic mappings.

Example:

Default:

color.action.primary
→ blue.600

Consumer:

color.action.primary
→ orange.600

The Button component does not change.

---

## 8. Accessibility

All semantic color combinations must be evaluated for WCAG contrast requirements.

Color must not be the only mechanism used to communicate:

- Error
- Success
- Warning
- Information
- Selection
- Focus

Components must provide appropriate supporting indicators such as text, icons, borders, or state changes.

---

## 9. Naming Convention

Tokens use:

category.role.variant

Examples:

color.content.primary
color.surface.default
color.action.primary
color.feedback.success

Component tokens use:

component.variant.property

Examples:

button.primary.background
button.md.height
input.error.border

Names describe meaning, not visual appearance.

---

## 10. Source of Truth

The canonical token definitions will eventually live in:

tokens/

The design implementation will be represented in:

figma/

The documentation lives in:

docs/

The generated CSS/TypeScript representation will be consumed by:

components/

AI-specific context will be maintained in:

ai/

Changes to token architecture must be documented before implementation changes are merged.
