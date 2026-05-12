import * as React from "react";
import { Check, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui-primitives/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui-primitives/sidebar";

export type CalendarsGroup = {
  name: string;
  items: string[];

  active?: ReadonlySet<string> | readonly string[];
};

export type CalendarsProps = {
  calendars: CalendarsGroup[];

  defaultOpenIndex?: number;
};

export function Calendars({ calendars, defaultOpenIndex = 0 }: CalendarsProps) {
  return (
    <>
      {calendars.map((calendar, index) => {
        const active =
          calendar.active instanceof Set
            ? calendar.active
            : new Set(calendar.active ?? []);
        return (
          <React.Fragment key={calendar.name}>
            <SidebarGroup className="py-0">
              <Collapsible
                defaultOpen={index === defaultOpenIndex}
                className="group/collapsible"
              >
                <SidebarGroupLabel
                  asChild
                  className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full text-sm"
                >
                  <CollapsibleTrigger>
                    {calendar.name}{" "}
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {calendar.items.map((item) => (
                        <SidebarMenuItem key={item}>
                          <SidebarMenuButton>
                            <div
                              data-active={active.has(item)}
                              className="group/calendar-item border-sidebar-border text-sidebar-primary-foreground data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-primary flex aspect-square size-4 shrink-0 items-center justify-center rounded-xs border"
                            >
                              <Check className="hidden size-3 group-data-[active=true]/calendar-item:block" />
                            </div>
                            {item}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroup>
            <SidebarSeparator className="mx-0" />
          </React.Fragment>
        );
      })}
    </>
  );
}
