export type ComponentSize = "sm" | "md" | "lg";

import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Size variant. Defaults to "md".
   */
  size?: ComponentSize;
  /**
   * Whether the button is in a loading state. Sets aria-busy="true".
   */
  loading?: boolean;
  /**
   * Visual variant. Defaults to "primary".
   * Maps to fc-button--primary/secondary/ghost classes per contract.
   */
  variant?: ButtonVariant;
}

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /**
   * Size variant. Defaults to "md".
   */
  size?: ComponentSize;
  /**
   * Whether the input is in a loading state. Sets aria-busy="true".
   */
  loading?: boolean;
  /**
   * Label content. Required for accessible name unless hideLabel is true
   * and an accessible name is otherwise provided.
   */
  label: string;
  /**
   * Visually hide the label while keeping it programmatically associated.
   */
  hideLabel?: boolean;
  /**
   * Helper text shown when there is no error.
   */
  helperText?: string;
  /**
   * Error message. When provided, replaces helper text and sets error state.
   */
  errorMessage?: string;
  /**
   * Input type. Constrained to types supported by the contract (text, email, tel, number, url).
   * Password/search/textarea/select/OTP/currency/PIN are out of scope per contract.
   */
  type?: "text" | "email" | "tel" | "number" | "url";
  /**
   * Optional id for label/input/aria association. Generated if omitted.
   */
  id?: string;
  /**
   * Optional aria-describedby override. Combined with auto-generated ids.
   */
  "aria-describedby"?: string;
}

export type PhoneInputStatus = "empty" | "incomplete" | "invalid" | "valid";

export interface PhoneInputChangeResult {
  inputValue: string;
  e164?: string;
  country?: string;
  status: PhoneInputStatus;
  isValid: boolean;
}

export interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  label: string;
  hideLabel?: boolean;
  helperText?: string;
  errorMessage?: string;
  value?: string;
  defaultValue?: string;
  country?: string;
  defaultCountry?: string;
  onCountryChange?: (country: string | undefined) => void;
  countries?: string[];
  international?: boolean;
  onChange?: (result: PhoneInputChangeResult) => void;
  id?: string;
  className?: string;
  "aria-describedby"?: string;
}

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /**
   * Accessible label content.
   */
  label: string;
  /**
   * Visually hide the label while keeping it programmatically associated.
   */
  hideLabel?: boolean;
  /**
   * Helper text shown when there is no error.
   */
  helperText?: string;
  /**
   * Error message. Replaces helper text and sets aria-invalid="true".
   */
  errorMessage?: string;
  /**
   * Accessible label for the toggle button when password is hidden.
   * Defaults to "Show password".
   */
  showPasswordLabel?: string;
  /**
   * Accessible label for the toggle button when password is visible.
   * Defaults to "Hide password".
   */
  hidePasswordLabel?: string;
  /**
   * Whether password visibility is currently showing (controlled).
   */
  visible?: boolean;
  /**
   * Default visibility state on initial render (uncontrolled).
   * Defaults to false.
   */
  defaultVisible?: boolean;
  /**
   * Callback fired when visibility toggle is clicked.
   */
  onVisibleChange?: (visible: boolean) => void;
  /**
   * Optional id for element associations. Generated if omitted.
   */
  id?: string;
  /**
   * Optional aria-describedby override.
   */
  "aria-describedby"?: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /**
   * Size variant. Defaults to "md".
   */
  size?: ComponentSize;
  /**
   * Whether the select is in a loading state. Sets aria-busy="true".
   */
  loading?: boolean;
  /**
   * Label content. Required for accessible name unless hideLabel is true
   * and an accessible name is otherwise provided.
   */
  label: string;
  /**
   * Visually hide the label while keeping it programmatically associated.
   */
  hideLabel?: boolean;
  /**
   * Helper text shown when there is no error.
   */
  helperText?: string;
  /**
   * Error message. When provided, replaces helper text and sets error state.
   */
  errorMessage?: string;
  /**
   * Optional id for label/select/aria association. Generated if omitted.
   */
  id?: string;
  /**
   * Optional aria-describedby override. Combined with auto-generated ids.
   */
  "aria-describedby"?: string;
}

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /**
   * Accessible label content.
   */
  label: string;
  /**
   * Visually hide the label while keeping it programmatically associated.
   */
  hideLabel?: boolean;
  /**
   * Helper text shown when there is no error.
   */
  helperText?: string;
  /**
   * Error message. When provided, replaces helper text and sets error state.
   */
  errorMessage?: string;
  /**
   * Optional id for element associations. Generated if omitted.
   */
  id?: string;
  /**
   * Optional aria-describedby override.
   */
  "aria-describedby"?: string;
}

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
  id?: string;
  helperText?: string;
}

export interface RadioGroupProps {
  /**
   * Accessible group label / legend.
   */
  label: string;
  /**
   * Visually hide the group legend while keeping it accessible.
   */
  hideLabel?: boolean;
  /**
   * Shared name attribute for mutual exclusion across the group.
   */
  name: string;
  /**
   * Available choices.
   */
  options: RadioOption[];
  /**
   * Controlled selected value.
   */
  value?: string;
  /**
   * Default selected value for uncontrolled mode.
   */
  defaultValue?: string;
  /**
   * Change callback when an option is selected.
   */
  onChange?: (value: string) => void;
  /**
   * Helper text shown when there is no error.
   */
  helperText?: string;
  /**
   * Error message. Replaces helper text and sets aria-invalid.
   */
  errorMessage?: string;
  /**
   * Whether the whole group is disabled.
   */
  disabled?: boolean;
  /**
   * Custom CSS class name.
   */
  className?: string;
  /**
   * Optional id for the group. Generated if omitted.
   */
  id?: string;
  /**
   * Optional aria-describedby override.
   */
  "aria-describedby"?: string;
}

export type TextareaResize = "none" | "vertical" | "horizontal" | "both";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Size variant. Defaults to "md".
   */
  size?: ComponentSize;
  /**
   * Whether the textarea is in a loading state. Sets aria-busy="true".
   */
  loading?: boolean;
  /**
   * Accessible label content.
   */
  label: string;
  /**
   * Visually hide the label while keeping it programmatically associated.
   */
  hideLabel?: boolean;
  /**
   * Helper text shown when there is no error.
   */
  helperText?: string;
  /**
   * Error message. When provided, replaces helper text and sets error state.
   */
  errorMessage?: string;
  /**
   * Resize behavior: "none" | "vertical" | "horizontal" | "both". Defaults to "vertical".
   */
  resize?: TextareaResize;
  /**
   * Optional id for element associations. Generated if omitted.
   */
  id?: string;
  /**
   * Optional aria-describedby override.
   */
  "aria-describedby"?: string;
}

export interface OTPProps {
  /**
   * Accessible label for the OTP input group.
   */
  label: string;
  /**
   * Visually hide the label while keeping it accessible.
   */
  hideLabel?: boolean;
  /**
   * Number of OTP digit cells. Defaults to 6.
   */
  length?: number;
  /**
   * Controlled code value.
   */
  value?: string;
  /**
   * Default code value for uncontrolled mode.
   */
  defaultValue?: string;
  /**
   * Callback fired on any digit change.
   */
  onChange?: (value: string) => void;
  /**
   * Callback fired when all digit cells have been filled.
   */
  onComplete?: (value: string) => void;
  /**
   * Helper text shown when there is no error.
   */
  helperText?: string;
  /**
   * Error message. Replaces helper text and sets error state.
   */
  errorMessage?: string;
  /**
   * Whether the whole input is disabled.
   */
  disabled?: boolean;
  /**
   * Custom CSS class name.
   */
  className?: string;
  /**
   * Optional group id. Generated if omitted.
   */
  id?: string;
  /**
   * Optional aria-describedby override.
   */
  "aria-describedby"?: string;
}

export interface CurrencyProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange" | "prefix" | "size"> {
  /**
   * Size variant. Defaults to "md".
   */
  size?: ComponentSize;
  /**
   * Whether the input is in a loading state. Sets aria-busy="true".
   */
  loading?: boolean;
  /**
   * Label content. Required for accessible name unless hideLabel is true.
   */
  label: string;
  /**
   * Visually hide the label while keeping it programmatically associated.
   */
  hideLabel?: boolean;
  /**
   * Currency symbol or prefix (e.g. "$", "€", "£").
   * Defaults to "$". Pass null or empty string to hide.
   */
  prefix?: string | null;
  /**
   * Currency code or suffix (e.g. "USD", "EUR").
   */
  suffix?: string | null;
  /**
   * Controlled value.
   */
  value?: string | number;
  /**
   * Default value for uncontrolled mode.
   */
  defaultValue?: string | number;
  /**
   * Change handler receiving the updated string value.
   */
  onChange?: (value: string) => void;
  /**
   * Helper text shown when there is no error.
   */
  helperText?: string;
  /**
   * Error message. Replaces helper text and sets error state.
   */
  errorMessage?: string;
  /**
   * Optional aria-describedby override.
   */
  "aria-describedby"?: string;
}

export interface CVVProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange" | "size"> {
  /**
   * Size variant. Defaults to "md".
   */
  size?: ComponentSize;
  /**
   * Whether the input is in a loading state. Sets aria-busy="true".
   */
  loading?: boolean;
  /**
   * Accessible label for the CVV input.
   */
  label: string;
  /**
   * Visually hide the label while keeping it programmatically associated.
   */
  hideLabel?: boolean;
  /**
   * Expected length of the CVV code (e.g. 3 or 4). Defaults to 4.
   */
  maxLength?: number;
  /**
   * Controlled value.
   */
  value?: string;
  /**
   * Default value for uncontrolled mode.
   */
  defaultValue?: string;
  /**
   * Change handler receiving the updated string value.
   */
  onChange?: (value: string) => void;
  /**
   * Whether to display an interactive visibility toggle button.
   * Defaults to false.
   */
  showToggle?: boolean;
  /**
   * Controlled visibility of the security code.
   */
  visible?: boolean;
  /**
   * Default visibility state on initial render (uncontrolled).
   * Defaults to false.
   */
  defaultVisible?: boolean;
  /**
   * Callback fired when visibility toggle is clicked.
   */
  onVisibleChange?: (visible: boolean) => void;
  /**
   * Accessible label for toggle button when code is masked. Defaults to "Show CVV".
   */
  showCVVLabel?: string;
  /**
   * Accessible label for toggle button when code is visible. Defaults to "Hide CVV".
   */
  hideCVVLabel?: string;
  /**
   * Helper text shown when there is no error.
   */
  helperText?: string;
  /**
   * Error message. Replaces helper text and sets error state.
   */
  errorMessage?: string;
  /**
   * Optional aria-describedby override.
   */
  "aria-describedby"?: string;
}

export interface DatePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /**
   * Size variant. Defaults to "md".
   */
  size?: ComponentSize;
  /**
   * Whether the date-picker is in a loading state. Sets aria-busy="true".
   */
  loading?: boolean;
  /**
   * Accessible label for the date input.
   */
  label: string;
  /**
   * Visually hide the label while keeping it programmatically associated.
   */
  hideLabel?: boolean;
  /**
   * Helper text shown when there is no error.
   */
  helperText?: string;
  /**
   * Error message. Replaces helper text and sets error state.
   */
  errorMessage?: string;
  /**
   * Earliest acceptable date string (YYYY-MM-DD).
   */
  min?: string;
  /**
   * Latest acceptable date string (YYYY-MM-DD).
   */
  max?: string;
  /**
   * Optional id for label/input association. Generated if omitted.
   */
  id?: string;
  /**
   * Optional aria-describedby override.
   */
  "aria-describedby"?: string;
}

