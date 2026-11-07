import React from "react";
import type { AlertProps, AlertVariant } from "../types";

const variantClassMap: Record<AlertVariant, string> = {
  info: "fc-alert--info",
  success: "fc-alert--success",
  warning: "fc-alert--warning",
  error: "fc-alert--error",
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "info", title, children, role, className, ...props }, ref) => {
    // Default ARIA role: 'alert' for high-priority warning/error, 'status' for informative/success
    const resolvedRole = role || (variant === "warning" || variant === "error" ? "alert" : "status");

    const classes = ["fc-alert", variantClassMap[variant], className].filter(Boolean).join(" ");

    return (
      <div ref={ref} role={resolvedRole} className={classes} {...props}>
        {title && <p className="fc-alert__title">{title}</p>}
        {children && <div className="fc-alert__message">{children}</div>}
      </div>
    );
  },
);

Alert.displayName = "Alert";

export default Alert;

