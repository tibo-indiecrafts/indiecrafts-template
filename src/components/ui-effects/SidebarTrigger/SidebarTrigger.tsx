"use client";

import { PanelLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui-primitives/button";
import { useSidebar } from "@/components/ui-primitives/sidebar";
import { cn } from "@/lib/utils";
import { sidebarTriggerNamespace } from "./config";

export type SidebarTriggerProps = React.ComponentProps<typeof Button>;

/**
 * The upstream `SidebarTrigger` from `@/components/ui-primitives/sidebar` hardcodes the
 * "Toggle Sidebar" string in three places (sr-only span, aria-label, title).
 * Re-implements the same DOM with the label sourced from the block's
 * translation namespace so it can be localized.
 */
export function SidebarTrigger({ className, onClick, ...props }: SidebarTriggerProps) {
  const t = useTranslations(sidebarTriggerNamespace);
  const { toggleSidebar } = useSidebar();
  const toggleLabel = t("toggle");

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      aria-label={toggleLabel}
      title={toggleLabel}
      {...props}
    >
      <PanelLeftIcon aria-hidden="true" />
      <span className="sr-only">{toggleLabel}</span>
    </Button>
  );
}
