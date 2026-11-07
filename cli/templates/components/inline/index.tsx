import React from "react";
import type { InlineProps } from "../types";

export const Inline = React.forwardRef<HTMLDivElement, InlineProps>(
  ({ gap = "md", as: Component = "div", className, children, ...props }, ref) => {
    const classes = [
      "fc-inline",
      `fc-inline--gap-${gap}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Component ref={ref} className={classes} {...props}>
        {children}
      </Component>
    );
  }
);

Inline.displayName = "Inline";

export default Inline;

