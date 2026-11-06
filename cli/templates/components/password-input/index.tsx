import React, { useId, useState } from "react";
import type { PasswordInputProps } from "../types";

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      hideLabel = false,
      helperText,
      errorMessage,
      className,
      id: providedId,
      required,
      disabled,
      visible: controlledVisible,
      defaultVisible = false,
      onVisibleChange,
      showPasswordLabel = "Show password",
      hidePasswordLabel = "Hide password",
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;

    const isControlled = controlledVisible !== undefined;
    const [uncontrolledVisible, setUncontrolledVisible] = useState(defaultVisible);
    const isVisible = isControlled ? controlledVisible : uncontrolledVisible;

    const hasError = Boolean(errorMessage);
    const messageText = hasError ? errorMessage : helperText;
    const showMessage = Boolean(messageText);

    const describedByIds = [
      ariaDescribedBy,
      showMessage ? (hasError ? errorId : helperId) : undefined,
    ]
      .filter(Boolean)
      .join(" ");

    const wrapperClasses = ["fc-password-input", className].filter(Boolean).join(" ");
    const labelClasses = ["fc-password-input__label", hideLabel ? "fc-password-input__label--visually-hidden" : ""]
      .filter(Boolean)
      .join(" ");
    const messageClasses = ["fc-password-input__message", hasError ? "fc-password-input__message--error" : ""]
      .filter(Boolean)
      .join(" ");

    const handleToggle = () => {
      if (disabled) return;
      const nextVisible = !isVisible;
      if (!isControlled) {
        setUncontrolledVisible(nextVisible);
      }
      onVisibleChange?.(nextVisible);
    };

    const toggleLabel = isVisible ? hidePasswordLabel : showPasswordLabel;

    return (
      <div className={wrapperClasses}>
        <label className={labelClasses} htmlFor={id}>
          {label}
        </label>
        <div className="fc-password-input__control">
          <input
            ref={ref}
            id={id}
            type={isVisible ? "text" : "password"}
            className="fc-password-input__field"
            required={required}
            disabled={disabled}
            aria-invalid={hasError ? true : undefined}
            aria-describedby={describedByIds || undefined}
            autoComplete="current-password"
            {...props}
          />
          <button
            type="button"
            className="fc-password-input__toggle"
            onClick={handleToggle}
            disabled={disabled}
            aria-label={toggleLabel}
            aria-pressed={isVisible}
            tabIndex={disabled ? -1 : 0}
          >
            {toggleLabel}
          </button>
        </div>
        {showMessage && (
          <p id={hasError ? errorId : helperId} className={messageClasses}>
            {messageText}
          </p>
        )}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
