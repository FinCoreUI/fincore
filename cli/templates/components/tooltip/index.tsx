import React from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import type { TooltipProps } from "../types";

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 200,
  className,
}) => {
  const contentClasses = ["fc-tooltip", className].filter(Boolean).join(" ");

  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            align={align}
            sideOffset={4}
            className={contentClasses}
          >
            {content}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};

Tooltip.displayName = "Tooltip";

export default Tooltip;

