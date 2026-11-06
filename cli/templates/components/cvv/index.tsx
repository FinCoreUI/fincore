import React, { useId, useState } from "react";
import type { CVVProps } from "../types";

export const CVV = React.forwardRef<HTMLInputElement, CVVProps>(
  (
    {
      label,
      hideLabel = false,
      size = "md",
      loading = false,
      maxLength = 4,
      value,
      defaultValue,
      onChange,
      showToggle = false,
      visible: controlledVisible,
      defaultVisible = false,
      onVisibleChange,
      showCVVLabel = "Show CVV",
      hideCVVLabel = "Hide CVV",
      helperText,
      errorMessage,
      className,
      id: providedId,
      required,
      disabled,
      autoComplete = "cc-csc",
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

    const wrapperClasses = ["fc-cvv", size !== "md" ? `fc-cvv--${size}` : "", loading ? "fc-cvv--loading" : "", className].filter(Boolean).join(" ");
    const labelClasses = [
      "fc-cvv__label",
      hideLabel ? "fc-cvv__label--visually-hidden" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const fieldClasses = [
      "fc-cvv__field",
      showToggle ? "fc-cvv__field--with-toggle" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const messageClasses = [
      "fc-cvv__message",
      hasError ? "fc-cvv__message--error" : "",
    ]
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    };

    const toggleLabel = isVisible ? hideCVVLabel : showCVVLabel;

    return (
      <div className={wrapperClasses}>
        <label className={labelClasses} htmlFor={id}>
          {label}
        </label>
        <div className="fc-cvv__control">
          <input
            ref={ref}
            id={id}
            type={isVisible ? "text" : "password"}
            inputMode="numeric"
            maxLength={maxLength}
            className={fieldClasses}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            required={required}
            disabled={disabled || loading}
            aria-busy={loading ? "true" : undefined}
            autoComplete={autoComplete}
            aria-invalid={hasError ? true : undefined}
            aria-describedby={describedByIds || undefined}
            {...props}
          />
          {showToggle && (
            <button
              type="button"
              className="fc-cvv__toggle"
              onClick={handleToggle}
              disabled={disabled}
              aria-label={toggleLabel}
              aria-pressed={isVisible}
              tabIndex={disabled ? -1 : 0}
            >
              {isVisible ? "Hide" : "Show"}
            </button>
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

CVV.displayName = "CVV";

export default CVV;

