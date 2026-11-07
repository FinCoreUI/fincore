import React from "react";
import type { ContainerProps } from "../types";

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = "md", as: Component = "div", className, children, ...props }, ref) => {
    const classes = [
      "fc-container",
      `fc-container--${size}`,
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

Container.displayName = "Container";

export default Container;

