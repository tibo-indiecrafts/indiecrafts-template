"use client";

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
  useSidebar,
} from "@/components/ui-primitives/sidebar";
import { ChevronsUpDown, Plus } from "lucide-react";
import * as React from "react";
import { useScopedT } from "@/components/_lib/scoped-t";
import { teamSwitcherGroupedNamespace } from "./config";

type SidebarMoleculeNamespace = Parameters<typeof useScopedT>[0];

type Team = {
  id: string;
  logo: React.ElementType;
  planKey: string;
};

export function TeamSwitcherGrouped({
  teams,
  namespace,
}: {
  teams: Team[];
  namespace: SidebarMoleculeNamespace;
}) {
  const [t] = useScopedT(namespace);
  const [tSelf] = useScopedT(teamSwitcherGroupedNamespace);
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  if (!activeTeam) return null;

  const Logo = activeTeam.logo as React.ComponentType<{ className?: string }>;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-background text-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {t(`teams.${activeTeam.id}`)}
                </span>
                <span className="truncate text-xs">
                  {t(`plans.${activeTeam.planKey}`)}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="mb-4 w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              {tSelf("label")}
            </DropdownMenuLabel>
            {teams.map((team, index) => {
              const TeamLogo = team.logo as React.ComponentType<{
                className?: string;
              }>;
              return (
                <DropdownMenuItem
                  key={team.id}
                  onClick={() => setActiveTeam(team)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <TeamLogo className="size-4 shrink-0" />
                  </div>
                  {t(`teams.${team.id}`)}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">{tSelf("addTeam")}</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
