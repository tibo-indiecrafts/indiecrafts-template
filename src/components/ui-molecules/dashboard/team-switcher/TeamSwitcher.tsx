"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui-primitives/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui-primitives/sidebar";
import { dashboardTeamSwitcherNamespace, type DashboardTeamSwitcherTeam } from "./config";

export type TeamSwitcherProps = {
  teams: DashboardTeamSwitcherTeam[];
};

export function TeamSwitcher({ teams }: TeamSwitcherProps) {
  const t = useTranslations(dashboardTeamSwitcherNamespace);
  const [activeTeam, setActiveTeam] = useState(teams[0]);

  if (!activeTeam) return null;
  // Local capital-letter aliases — JSX requires component identifiers to
  // start with an uppercase letter; `<activeTeam.logo />` would be parsed
  // as an HTML element, so we re-bind to satisfy the type system.
  // The cast narrows React's broader `ElementType` (which can be a string
  // tag name) to a concrete component type with the className prop we pass.
  const ActiveLogo = activeTeam.logo as React.ComponentType<{ className?: string }>;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-fit px-1.5">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-5 items-center justify-center rounded-md">
                <ActiveLogo className="size-3" />
              </div>
              <span className="truncate font-medium">{activeTeam.name}</span>
              <ChevronDown className="opacity-50" aria-hidden="true" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              {t("dropdownLabel")}
            </DropdownMenuLabel>
            {teams.map((team, index) => {
              const TeamLogo = team.logo as React.ComponentType<{
                className?: string;
              }>;
              return (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => setActiveTeam(team)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-xs border">
                    <TeamLogo className="size-4 shrink-0" />
                  </div>
                  {team.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-4" aria-hidden="true" />
              </div>
              <div className="text-muted-foreground font-medium">{t("addTeam")}</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
