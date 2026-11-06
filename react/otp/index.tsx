import React, { useId, useRef, useState, useEffect } from "react";
import type { OTPProps } from "../types";

export const OTP = React.forwardRef<HTMLDivElement, OTPProps>(
  (
    {
      label,
      hideLabel = false,
      length = 6,
      value,
      defaultValue = "",
      onChange,
      onComplete,
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
    const labelId = `${id}-label`;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;

    const hasError = Boolean(errorMessage);
    const messageText = hasError ? errorMessage : helperText;
    const showMessage = Boolean(messageText);

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<string>(defaultValue);
    const code = isControlled ? value : internalValue;

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
      inputRefs.current = inputRefs.current.slice(0, length);
    }, [length]);

    const digits = Array.from({ length }, (_, i) => code[i] || "");

    const describedByIds = [
      ariaDescribedBy,
      showMessage ? (hasError ? errorId : helperId) : undefined,
    ]
      .filter(Boolean)
      .join(" ");

    const wrapperClasses = ["fc-otp", className].filter(Boolean).join(" ");
    const labelClasses = [
      "fc-otp__label",
      hideLabel ? "fc-otp__label--visually-hidden" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const messageClasses = [
      "fc-otp__message",
      hasError ? "fc-otp__message--error" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const updateCode = (newCode: string) => {
      if (!isControlled) {
        setInternalValue(newCode);
      }
      onChange?.(newCode);
      if (newCode.length === length) {
        onComplete?.(newCode);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const char = e.target.value.slice(-1);
      const chars = Array.from({ length }, (_, i) => code[i] || "");
      chars[index] = char;
      const nextCode = chars.join("").trimEnd();
      updateCode(nextCode);

      if (char && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === "Backspace") {
        if (!digits[index] && index > 0) {
          e.preventDefault();
          const chars = Array.from({ length }, (_, i) => code[i] || "");
          chars[index - 1] = "";
          updateCode(chars.join("").trimEnd());
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < length - 1) {
        e.preventDefault();
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").trim();
      if (!pasted) return;

      const pastedSlice = pasted.slice(0, length);
      updateCode(pastedSlice);

      const nextFocusIndex = Math.min(pastedSlice.length, length - 1);
      inputRefs.current[nextFocusIndex]?.focus();
    };

    return (
      <div
        ref={ref}
        id={id}
        role="group"
        aria-labelledby={labelId}
        aria-describedby={describedByIds || undefined}
        className={wrapperClasses}
      >
        <span id={labelId} className={labelClasses}>
          {label}
        </span>
        <div className="fc-otp__cells">
          {Array.from({ length }, (_, index) => {
            const cellId = `${id}-cell-${index}`;
            return (
              <div key={index} className="fc-otp__cell-wrapper">
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  id={cellId}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digits[index]}
                  disabled={disabled}
                  aria-invalid={hasError ? true : undefined}
                  aria-label={`Digit ${index + 1} of ${length}`}
                  autoComplete={index === 0 ? "one-time-code" : undefined}
                  className="fc-otp__cell"
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                />
              </div>
            );
          })}
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

OTP.displayName = "OTP";

export default OTP;

