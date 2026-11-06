import React, { useId } from "react";
import type { TextareaProps } from "../types";

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
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
      rows = 3,
      resize = "vertical",
      style,
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

    const wrapperClasses = ["fc-textarea", size !== "md" ? `fc-textarea--${size}` : "", loading ? "fc-textarea--loading" : "", className].filter(Boolean).join(" ");
    const labelClasses = [
      "fc-textarea__label",
      hideLabel ? "fc-textarea__label--visually-hidden" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const messageClasses = [
      "fc-textarea__message",
      hasError ? "fc-textarea__message--error" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const textareaStyle: React.CSSProperties = {
      resize: disabled ? "none" : resize,
      ...style,
    };

    return (
      <div className={wrapperClasses}>
        <label className={labelClasses} htmlFor={id}>
          {label}
        </label>
        <div className="fc-textarea__control">
          <textarea
            ref={ref}
            id={id}
            rows={rows}
            style={textareaStyle}
            className="fc-textarea__field"
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

Textarea.displayName = "Textarea";

export default Textarea;

