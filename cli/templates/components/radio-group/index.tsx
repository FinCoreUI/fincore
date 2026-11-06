import React, { useId } from "react";
import type { RadioGroupProps } from "../types";

export const RadioGroup = React.forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    {
      label,
      hideLabel = false,
      name,
      options,
      value,
      defaultValue,
      onChange,
      helperText,
      errorMessage,
      disabled = false,
      className,
      id: providedId,
      "aria-describedby": ariaDescribedBy,
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

    const [uncontrolledValue, setUncontrolledValue] = React.useState<string | undefined>(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : uncontrolledValue;

    const describedByIds = [
      ariaDescribedBy,
      showMessage ? (hasError ? errorId : helperId) : undefined,
    ]
      .filter(Boolean)
      .join(" ");

    const wrapperClasses = ["fc-radio-group", className].filter(Boolean).join(" ");
    const legendClasses = [
      "fc-radio-group__label",
      hideLabel ? "fc-radio-group__label--visually-hidden" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const messageClasses = [
      "fc-radio-group__message",
      hasError ? "fc-radio-group__message--error" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const handleChange = (optionValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(optionValue);
      }
      onChange?.(optionValue);
    };

    return (
      <fieldset
        ref={ref}
        id={id}
        className={wrapperClasses}
        aria-describedby={describedByIds || undefined}
        disabled={disabled}
      >
        <legend className={legendClasses}>{label}</legend>
        <div className="fc-radio-group__items">
          {options.map((option, index) => {
            const optionId = option.id || `${id}-opt-${index}`;
            const isOptionDisabled = disabled || option.disabled;
            const isChecked = currentValue === option.value;

            const itemClasses = [
              "fc-radio-group__item",
              isOptionDisabled ? "fc-radio-group__item--disabled" : "",
            ]
              .filter(Boolean)
              .join(" ");

            const itemLabelClasses = [
              "fc-radio-group__item-label",
              isOptionDisabled ? "fc-radio-group__item-label--disabled" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <label key={option.value} className={itemClasses} htmlFor={optionId}>
                <span className="fc-radio-group__control">
                  <input
                    type="radio"
                    id={optionId}
                    name={name}
                    value={option.value}
                    checked={isChecked}
                    disabled={isOptionDisabled}
                    className="fc-radio-group__field"
                    aria-invalid={hasError ? true : undefined}
                    onChange={() => handleChange(option.value)}
                  />
                  <span className="fc-radio-group__circle" aria-hidden="true">
                    <span className="fc-radio-group__dot" />
                  </span>
                </span>
                <span className={itemLabelClasses}>{option.label}</span>
              </label>
            );
          })}
        </div>
        {showMessage && (
          <p id={hasError ? errorId : helperId} className={messageClasses}>
            {messageText}
          </p>
        )}
      </fieldset>
    );
  },
);

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;

