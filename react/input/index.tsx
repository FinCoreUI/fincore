import React, { useId } from "react";
import type { InputProps } from "../types";

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hideLabel = false,
      size = "md",
      loading = false,
      helperText,
      errorMessage,
      className,
      id: providedId,
      type = "text",
      required,
      disabled,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;

    const hasError = Boolean(errorMessage);
    const messageText = hasError ? errorMessage : helperText;
    const showMessage = Boolean(messageText);

    const describedByIds = [
      ariaDescribedBy,
      showMessage ? (hasError ? errorId : helperId) : undefined,
    ]
      .filter(Boolean)
      .join(" ");

    const wrapperClasses = ["fc-input", size !== "md" ? `fc-input--${size}` : "", loading ? "fc-input--loading" : "", className].filter(Boolean).join(" ");
    const labelClasses = ["fc-input__label", hideLabel ? "fc-input__label--visually-hidden" : ""]
      .filter(Boolean)
      .join(" ");
    const messageClasses = ["fc-input__message", hasError ? "fc-input__message--error" : ""]
      .filter(Boolean)
      .join(" ");

    // Ensure required FinCore classes are always present
    if (!wrapperClasses.includes("fc-input")) {
      // defensive - className should not remove required classes
    }

    return (
      <div className={wrapperClasses}>
        <label className={labelClasses} htmlFor={id}>
          {label}
        </label>
        <div className="fc-input__control">
          <input
            ref={ref}
            id={id}
            type={type}
            className="fc-input__field"
            required={required}
            disabled={disabled || loading}
            aria-busy={loading ? "true" : undefined}
            aria-invalid={hasError ? true : undefined}
            aria-describedby={describedByIds || undefined}
            {...props}
          />
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

Input.displayName = "Input";

export default Input;
