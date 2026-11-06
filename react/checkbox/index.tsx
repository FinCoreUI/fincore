import React, { useId } from "react";
import type { CheckboxProps } from "../types";

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
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
      checked,
      defaultChecked,
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

    const wrapperClasses = ["fc-checkbox", className].filter(Boolean).join(" ");
    const bodyClasses = [
      "fc-checkbox__body",
      disabled ? "fc-checkbox__body--disabled" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const labelClasses = [
      "fc-checkbox__label",
      disabled ? "fc-checkbox__label--disabled" : "",
      hideLabel ? "fc-checkbox__label--visually-hidden" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const messageClasses = [
      "fc-checkbox__message",
      hasError ? "fc-checkbox__message--error" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={wrapperClasses}>
        <label className={bodyClasses} htmlFor={id}>
          <span className="fc-checkbox__control">
            <input
              ref={ref}
              id={id}
              type="checkbox"
              className="fc-checkbox__field"
              required={required}
              disabled={disabled}
              checked={checked}
              defaultChecked={defaultChecked}
              aria-invalid={hasError ? true : undefined}
              aria-describedby={describedByIds || undefined}
              {...props}
            />
            <span className="fc-checkbox__box" aria-hidden="true">
              <svg className="fc-checkbox__icon" viewBox="0 0 12 12">
                <polyline points="2 6 5 9 10 3" />
              </svg>
            </span>
          </span>
          <span className={labelClasses}>{label}</span>
        </label>
        {showMessage && (
          <p id={hasError ? errorId : helperId} className={messageClasses}>
            {messageText}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;

