import React from "react";
import type { AmountDisplayProps } from "../types";

export const AmountDisplay = React.forwardRef<HTMLSpanElement, AmountDisplayProps>(
  ({ value, currency, size = "md", variant = "default", className, ...props }, ref) => {
    const classes = [
      "fc-amount-display",
      `fc-amount-display--${size}`,
      `fc-amount-display--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={classes} {...props}>
        {currency && (
          <span className="fc-amount-display__currency fc-amount-display-currency">
            {currency}
          </span>
        )}
        <span className="fc-amount-display__value fc-amount-display-value">
          {value}
        </span>
      </span>
    );
  }
);

AmountDisplay.displayName = "AmountDisplay";

export default AmountDisplay;

