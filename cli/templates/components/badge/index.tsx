import React from "react";
import type { BadgeProps, BadgeVariant } from "../types";

const variantClassMap: Record<BadgeVariant, string> = {
  default: "fc-badge--default",
  success: "fc-badge--success",
  warning: "fc-badge--warning",
  error: "fc-badge--error",
  info: "fc-badge--info",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", className, children, ...props }, ref) => {
    const classes = ["fc-badge", variantClassMap[variant], className].filter(Boolean).join(" ");
    return (
      <span ref={ref} className={classes} {...props}>
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export default Badge;

