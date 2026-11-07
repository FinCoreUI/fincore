import React, { useId } from "react";
import type { SwitchProps } from "../types";

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      label,
      disabled = false,
      className,
      id: providedId,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);

    const isControlled = controlledChecked !== undefined;
    const isChecked = isControlled ? controlledChecked : uncontrolledChecked;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const next = !isChecked;
      if (!isControlled) {
        setUncontrolledChecked(next);
      }
      onCheckedChange?.(next);
      props.onClick?.(e);
    };

    const switchClasses = [
      "fc-switch",
      isChecked ? "fc-switch--checked" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const button = (
      <button
        ref={ref}
        type="button"
        role="switch"
        id={id}
        aria-checked={isChecked}
        disabled={disabled}
        className={switchClasses}
        onClick={handleClick}
        {...props}
      >
        <span className="fc-switch__thumb" />
      </button>
    );

    if (!label) return button;

    return (
      <label className="fc-switch-wrapper" htmlFor={id}>
        {button}
        <span className="fc-switch__label">{label}</span>
      </label>
    );
  },
);

Switch.displayName = "Switch";

export default Switch;

