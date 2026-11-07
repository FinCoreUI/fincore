import React from "react";
import type { BalanceCardProps } from "../types";

export const BalanceCard = React.forwardRef<HTMLDivElement, BalanceCardProps>(
  ({ title, account, amount, footer, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={["fc-balance-card", className].filter(Boolean).join(" ")}
        {...props}
      >
        <div className="fc-balance-card__header fc-balance-card-header">
          <span className="fc-balance-card__title fc-balance-card-title">{title}</span>
          {account && (
            <span className="fc-balance-card__account fc-balance-card-account">
              {account}
            </span>
          )}
        </div>
        <div className="fc-balance-card__amount fc-balance-card-amount">
          {amount}
        </div>
        {footer && (
          <div className="fc-balance-card__footer fc-balance-card-footer">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

BalanceCard.displayName = "BalanceCard";

export default BalanceCard;

