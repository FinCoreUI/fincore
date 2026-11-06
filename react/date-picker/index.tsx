import React, { useId } from "react";
import type { DatePickerProps } from "../types";

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
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
      min,
      max,
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

    const wrapperClasses = ["fc-date-picker", size !== "md" ? `fc-date-picker--${size}` : "", loading ? "fc-date-picker--loading" : "", className].filter(Boolean).join(" ");
    const labelClasses = [
      "fc-date-picker__label",
      hideLabel ? "fc-date-picker__label--visually-hidden" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const messageClasses = [
      "fc-date-picker__message",
      hasError ? "fc-date-picker__message--error" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={wrapperClasses}>
        <label className={labelClasses} htmlFor={id}>
          {label}
        </label>
        <div className="fc-date-picker__control">
          <input
            ref={ref}
            id={id}
            type="date"
            className="fc-date-picker__field"
            required={required}
            disabled={disabled || loading}
            aria-busy={loading ? "true" : undefined}
            min={min}
            max={max}
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

DatePicker.displayName = "DatePicker";

export default DatePicker;

