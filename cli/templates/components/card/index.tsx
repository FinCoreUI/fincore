import React from "react";
import type { CardProps } from "../types";

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ title, description, footer, children, className, ...props }, ref) => {
    const hasHeader = Boolean(title || description);

    const classes = ["fc-card", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...props}>
        {hasHeader && (
          <div className="fc-card__header">
            {title && <h3 className="fc-card__title">{title}</h3>}
            {description && <p className="fc-card__description">{description}</p>}
          </div>
        )}
        {children && <div className="fc-card__body">{children}</div>}
        {footer && <div className="fc-card__footer">{footer}</div>}
      </div>
    );
  },
);

Card.displayName = "Card";

export default Card;

