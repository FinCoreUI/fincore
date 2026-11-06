import React, { forwardRef, useEffect, useId, useMemo, useState } from "react";
import type { PhoneInputChangeResult, PhoneInputProps, PhoneInputStatus } from "../types";
import * as libphonenumber from "libphonenumber-js";

const getLib = (): any => {
  try {
    // @ts-ignore
    if (libphonenumber && (libphonenumber.getCountries || libphonenumber.parsePhoneNumberFromString)) {
      return libphonenumber;
    }
    // @ts-ignore
    if (libphonenumber.default) {
      return libphonenumber.default;
    }
  } catch {
    // ignore
  }
  try {
    // @ts-ignore
    if (typeof require !== "undefined") {
      // @ts-ignore
      return require("libphonenumber-js");
    }
  } catch {
    // ignore
  }
  return null;
};

function getCountriesList(): Array<{ code: string; name: string; dialCode: string }> {
  const lib = getLib();
  if (!lib) return [];
  try {
    const codes = lib.getCountries ? lib.getCountries() : [];
    return codes.map((code: string) => {
      try {
        const dialCode = lib.getCountryCallingCode ? lib.getCountryCallingCode(code) : "";
        return { code, name: code, dialCode };
      } catch {
        return { code, name: code, dialCode: "" };
      }
    });
  } catch {
    return [];
  }
}

function inferCountryFromNumber(value: string): string | undefined {
  const lib = getLib();
  if (!lib || !value) return undefined;
  try {
    if (typeof lib.parsePhoneNumberFromString === "function") {
      const parsed = lib.parsePhoneNumberFromString(value);
      if (parsed && parsed.country) return parsed.country;
    }
    if (typeof lib.parsePhoneNumber === "function") {
      const parsed = lib.parsePhoneNumber(value);
      if (parsed && parsed.country) return parsed.country;
    }
  } catch {
    // ignore
  }
  return undefined;
}

function validateNumber(value: string): { e164?: string; status: PhoneInputStatus; isValid: boolean } {
  const lib = getLib();
  if (!value || value.trim() === "") {
    return { status: "empty", isValid: false };
  }
  if (!lib) {
    if (value.startsWith("+")) {
      return { status: "incomplete", isValid: false };
    }
    return { status: "incomplete", isValid: false };
  }
  try {
    if (typeof lib.isValidPhoneNumber === "function") {
      const isValid = lib.isValidPhoneNumber(value);
      if (isValid) {
        try {
          if (typeof lib.parsePhoneNumberFromString === "function") {
            const parsed = lib.parsePhoneNumberFromString(value);
            if (parsed && typeof parsed.number === "string") {
              return { e164: parsed.number, status: "valid", isValid: true };
            }
          }
        } catch {}
        return { status: "valid", isValid: true };
      }
    }
    if (typeof lib.parsePhoneNumberFromString === "function") {
      const parsed = lib.parsePhoneNumberFromString(value);
      if (parsed) {
        if (typeof parsed.isPossible === "function") {
          if (parsed.isPossible()) {
            return { status: "incomplete", isValid: false };
          }
        }
        return { status: "invalid", isValid: false };
      }
    }
  } catch {
    // ignore
  }
  if (value.startsWith("+")) {
    return { status: "incomplete", isValid: false };
  }
  return { status: "incomplete", isValid: false };
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label,
      hideLabel = false,
      helperText,
      errorMessage,
      className,
      id: providedId,
      value: controlledValue,
      defaultValue = "",
      country: controlledCountry,
      defaultCountry,
      onCountryChange,
      countries: allowedCountries,
      international = true,
      onChange,
      required,
      disabled,
      readOnly,
      name,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const countrySelectId = `${id}-country`;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;

    const isControlled = controlledValue !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || "");
    const [initialDefault] = useState(defaultValue || "");
    useEffect(() => {
      if (!isControlled && defaultValue !== undefined && uncontrolledValue === initialDefault && defaultValue !== uncontrolledValue) {
        setUncontrolledValue(defaultValue || "");
      }
    }, [defaultValue, isControlled, initialDefault, uncontrolledValue]);
    const inputValue = isControlled ? controlledValue : uncontrolledValue;

    const [uncontrolledCountry, setUncontrolledCountry] = useState<string | undefined>(defaultCountry);
    const [selectedCountry, setSelectedCountry] = useState<string | undefined>(controlledCountry);

    useEffect(() => {
      if (controlledCountry !== undefined) {
        setSelectedCountry(controlledCountry);
      }
    }, [controlledCountry]);

    useEffect(() => {
      if (selectedCountry) return;
      if (controlledCountry) return;
      if (uncontrolledCountry) return;
      if (inputValue && inputValue.startsWith("+")) {
        const inferred = inferCountryFromNumber(inputValue);
        if (inferred) {
          setSelectedCountry(inferred);
        }
      }
    }, [inputValue, selectedCountry, controlledCountry, uncontrolledCountry]);

    const countryList = useMemo(() => {
      const all = getCountriesList();
      if (allowedCountries && allowedCountries.length > 0) {
        return all.filter((c) => allowedCountries.includes(c.code));
      }
      return all;
    }, [allowedCountries]);

    const hasError = Boolean(errorMessage);
    const messageText = hasError ? errorMessage : helperText;
    const showMessage = Boolean(messageText);

    const describedByIds = [
      ariaDescribedBy,
      showMessage ? (hasError ? errorId : helperId) : undefined,
    ]
      .filter(Boolean)
      .join(" ");

    const wrapperClasses = ["fc-phone-input", className].filter(Boolean).join(" ");
    const labelClasses = ["fc-phone-input__label", hideLabel ? "fc-phone-input__label--visually-hidden" : ""]
      .filter(Boolean)
      .join(" ");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      const val = validateNumber(newValue);
      const result: PhoneInputChangeResult = {
        inputValue: newValue,
        e164: val.e164,
        country: selectedCountry || uncontrolledCountry,
        status: val.status,
        isValid: val.isValid,
      };
      if (onChange) {
        onChange(result);
      }
    };

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newCountry = e.target.value || undefined;
      if (controlledCountry === undefined) {
        setUncontrolledCountry(newCountry);
        setSelectedCountry(newCountry);
      } else {
        setSelectedCountry(newCountry);
      }
      if (onCountryChange) {
        onCountryChange(newCountry);
      }
    };

    const currentCountry = controlledCountry !== undefined ? controlledCountry : (selectedCountry || uncontrolledCountry);

    return (
      <div className={wrapperClasses}>
        <label className={labelClasses} htmlFor={id}>
          {label}
        </label>
        <div className="fc-phone-input__row">
          <div className="fc-phone-input__country">
            <label className="fc-phone-input__country-label" htmlFor={countrySelectId}>
              Country
            </label>
            <select
              className="fc-phone-input__country-select"
              id={countrySelectId}
              value={currentCountry || ""}
              onChange={handleCountryChange}
              disabled={disabled}
              aria-label="Country"
            >
              {!currentCountry && <option value="">Select country</option>}
              {countryList.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} {c.dialCode ? `(+${c.dialCode})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="fc-phone-input__control">
            <input
              ref={ref}
              className="fc-phone-input__field"
              id={id}
              name={name}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={inputValue}
              onChange={handleInputChange}
              required={required}
              disabled={disabled}
              readOnly={readOnly}
              aria-invalid={hasError ? "true" : undefined}
              aria-describedby={describedByIds || undefined}
              {...props}
            />
          </div>
        </div>
        {showMessage && (
          <p
            className={hasError ? "fc-phone-input__message fc-phone-input__message--error" : "fc-phone-input__message"}
            id={hasError ? errorId : helperId}
          >
            {messageText}
          </p>
        )}
      </div>
    );
  },
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
