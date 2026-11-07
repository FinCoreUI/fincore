import React from "react";
import type { StackProps } from "../types";

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ gap = "md", as: Component = "div", className, children, ...props }, ref) => {
    const classes = [
      "fc-stack",
      `fc-stack--gap-${gap}`,
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

Stack.displayName = "Stack";

export default Stack;

