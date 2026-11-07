import React from "react";
import * as RadixPopover from "@radix-ui/react-popover";
import type { PopoverProps } from "../types";

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  open,
  defaultOpen,
  onOpenChange,
  side = "bottom",
  align = "center",
  className,
}) => {
  const contentClasses = ["fc-popover", className].filter(Boolean).join(" ");

  return (
    <RadixPopover.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content side={side} align={align} sideOffset={6} className={contentClasses}>
          {children}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};

Popover.displayName = "Popover";

export default Popover;

