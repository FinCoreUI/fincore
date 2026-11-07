import React from "react";
import type { StatusIndicatorProps } from "../types";

export const StatusIndicator = React.forwardRef<HTMLSpanElement, StatusIndicatorProps>(
  ({ status = "neutral", size = "md", label, className, ...props }, ref) => {
    const classes = [
      "fc-status-indicator",
      `fc-status-indicator--${status}`,
      `fc-status-indicator--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={classes} {...props}>
        <span className="fc-status-indicator__dot fc-status-indicator-dot" aria-hidden="true" />
        {label && (
          <span className="fc-status-indicator__label fc-status-indicator-label">
            {label}
          </span>
        )}
      </span>
    );
  }
);

StatusIndicator.displayName = "StatusIndicator";

export default StatusIndicator;

