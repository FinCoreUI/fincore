import React from "react";
import type { TransactionItemProps } from "../types";

export const TransactionItem = React.forwardRef<HTMLDivElement, TransactionItemProps>(
  ({ title, subtitle, amount, icon, trail, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={["fc-transaction-item", className].filter(Boolean).join(" ")}
        {...props}
      >
        <div className="fc-transaction-item__lead fc-transaction-item-lead">
          {icon && (
            <div className="fc-transaction-item__icon fc-transaction-item-icon">
              {icon}
            </div>
          )}
          <div className="fc-transaction-item__content fc-transaction-item-content">
            <span className="fc-transaction-item__title fc-transaction-item-title">
              {title}
            </span>
            {subtitle && (
              <span className="fc-transaction-item__subtitle fc-transaction-item-subtitle">
                {subtitle}
              </span>
            )}
          </div>
        </div>
        {(amount || trail) && (
          <div className="fc-transaction-item__trail fc-transaction-item-trail">
            {amount}
            {trail}
          </div>
        )}
      </div>
    );
  }
);

TransactionItem.displayName = "TransactionItem";

export default TransactionItem;

