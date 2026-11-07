import React from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
} from "../types";

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, children, ...props }, ref) => {
    const classes = ["fc-tabs", className].filter(Boolean).join(" ");
    return (
      <RadixTabs.Root ref={ref} className={classes} {...props}>
        {children}
      </RadixTabs.Root>
    );
  },
);
Tabs.displayName = "Tabs";

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => {
    const classes = ["fc-tabs__list", className].filter(Boolean).join(" ");
    return (
      <RadixTabs.List ref={ref} className={classes} {...props}>
        {children}
      </RadixTabs.List>
    );
  },
);
TabsList.displayName = "TabsList";

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const classes = ["fc-tabs__trigger", className].filter(Boolean).join(" ");
    return (
      <RadixTabs.Trigger ref={ref} className={classes} {...props}>
        {children}
      </RadixTabs.Trigger>
    );
  },
);
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, children, ...props }, ref) => {
    const classes = ["fc-tabs__content", className].filter(Boolean).join(" ");
    return (
      <RadixTabs.Content ref={ref} className={classes} {...props}>
        {children}
      </RadixTabs.Content>
    );
  },
);
TabsContent.displayName = "TabsContent";

export default Tabs;

