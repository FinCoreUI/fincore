import React, { useId } from "react";
import type { SelectProps } from "../types";

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
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
      required,
      disabled,
      children,
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

    const wrapperClasses = ["fc-select", size !== "md" ? `fc-select--${size}` : "", loading ? "fc-select--loading" : "", className].filter(Boolean).join(" ");
    const labelClasses = ["fc-select__label", hideLabel ? "fc-select__label--visually-hidden" : ""]
      .filter(Boolean)
      .join(" ");
    const messageClasses = ["fc-select__message", hasError ? "fc-select__message--error" : ""]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={wrapperClasses}>
        <label className={labelClasses} htmlFor={id}>
          {label}
        </label>
        <div className="fc-select__control">
          <select
            ref={ref}
            id={id}
            className="fc-select__field"
            required={required}
            disabled={disabled || loading}
            aria-busy={loading ? "true" : undefined}
            aria-invalid={hasError ? true : undefined}
            aria-describedby={describedByIds || undefined}
            {...props}
          >
            {children}
          </select>
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

Select.displayName = "Select";

export default Select;

