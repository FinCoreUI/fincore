import React from "react";
import type { ButtonProps } from "../types";

const variantClassMap = {
  primary: "fc-button--primary",
  secondary: "fc-button--secondary",
  ghost: "fc-button--ghost",
} as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading = false, className, type = "button", children, disabled, ...props }, ref) => {
    const classes = [
      "fc-button",
      variantClassMap[variant],
      size !== "md" ? `fc-button--${size}` : "",
      loading ? "fc-button--loading" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} type={type} className={classes} disabled={disabled || loading} aria-busy={loading ? "true" : undefined} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
