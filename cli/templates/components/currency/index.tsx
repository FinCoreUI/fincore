import React, { useId } from "react";
import type { CurrencyProps } from "../types";

export const Currency = React.forwardRef<HTMLInputElement, CurrencyProps>(
  (
    {
      label,
      hideLabel = false,
      size = "md",
      loading = false,
      prefix = "$",
      suffix,
      value,
      defaultValue,
      onChange,
      helperText,
      errorMessage,
      className,
      id: providedId,
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

    const wrapperClasses = ["fc-currency", size !== "md" ? `fc-currency--${size}` : "", loading ? "fc-currency--loading" : "", className].filter(Boolean).join(" ");
    const labelClasses = [
      "fc-currency__label",
      hideLabel ? "fc-currency__label--visually-hidden" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const messageClasses = [
      "fc-currency__message",
      hasError ? "fc-currency__message--error" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <div className={wrapperClasses}>
        <label className={labelClasses} htmlFor={id}>
          {label}
        </label>
        <div className="fc-currency__control">
          {prefix && (
            <span className="fc-currency__prefix" aria-hidden="true">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            type="text"
            inputMode="decimal"
            className="fc-currency__field"
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            required={required}
            disabled={disabled || loading}
            aria-busy={loading ? "true" : undefined}
            aria-invalid={hasError ? true : undefined}
            aria-describedby={describedByIds || undefined}
            {...props}
          />
          {suffix && (
            <span className="fc-currency__suffix" aria-hidden="true">
              {suffix}
            </span>
          )}
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

Currency.displayName = "Currency";

export default Currency;

