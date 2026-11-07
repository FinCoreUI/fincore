import React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import type { DrawerProps } from "../types";

export const Drawer: React.FC<DrawerProps> = ({
  open,
  defaultOpen,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}) => {
  const contentClasses = ["fc-drawer", className].filter(Boolean).join(" ");

  return (
    <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fc-drawer-overlay" />
        <RadixDialog.Content className={contentClasses}>
          {(title || description) && (
            <div className="fc-drawer__header">
              {title && (
                <RadixDialog.Title asChild>
                  <h2 className="fc-drawer__title">{title}</h2>
                </RadixDialog.Title>
              )}
              {description && (
                <RadixDialog.Description asChild>
                  <p style={{ margin: "0.25rem 0 0", color: "#71717a", fontSize: "0.875rem" }}>
                    {description}
                  </p>
                </RadixDialog.Description>
              )}
            </div>
          )}
          {children && <div className="fc-drawer__body">{children}</div>}
          {footer && <div className="fc-drawer__footer">{footer}</div>}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

Drawer.displayName = "Drawer";

export default Drawer;

