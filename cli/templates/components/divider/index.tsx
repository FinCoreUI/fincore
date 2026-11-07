import React from "react";
import type { DividerProps } from "../types";

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ orientation = "horizontal", className, ...props }, ref) => {
    const classes = [
      "fc-divider",
      `fc-divider--${orientation}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <hr
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={classes}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";

export default Divider;

