"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-primitives/avatar";
import { Button } from "@/components/ui-primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui-primitives/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui-primitives/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui-primitives/tooltip";
import {
  BookmarkPlus,
  CircleHelp,
  LogOut,
  Plus,
  PlusCircle,
  Puzzle,
  Settings,
  User,
} from "lucide-react";
import { useScopedT } from "@/components/_lib/scoped-t";
import { navFooterNamespace } from "./config";

export function NavFooter({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const [tSelf] = useScopedT(navFooterNamespace);
  return (
    <SidebarFooter className="p-4">
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-full">
                      {tSelf("fallback")}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="m-2">
                  <DropdownMenuItem>
                    <User size={16} className="opacity-80" aria-hidden="true" />
                    {tSelf("menu.profile")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings size={16} className="opacity-80" aria-hidden="true" />
                    {tSelf("menu.settings")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut size={16} className="opacity-80" aria-hidden="true" />
                    {tSelf("menu.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CircleHelp
                      size={16}
                      aria-hidden="true"
                      className="cursor-pointer opacity-60 hover:opacity-100"
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-popover text-popover-foreground m-2 max-w-[150px] border px-2 py-1"
                  >
                    <div className="space-y-1 text-xs">
                      <p className="font-medium">{tSelf("tooltip.title")}</p>
                      <p className="text-muted-foreground">{tSelf("tooltip.body")}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  aria-label={tSelf("openEditMenu")}
                >
                  <Plus size={16} aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="pb-2">
                <DropdownMenuLabel>{tSelf("menu.addNew")}</DropdownMenuLabel>
                <DropdownMenuItem>
                  <PlusCircle size={16} className="mr-2 opacity-80" aria-hidden="true" />
                  {tSelf("menu.addItem")}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BookmarkPlus
                    size={16}
                    className="mr-2 opacity-80"
                    aria-hidden="true"
                  />
                  {tSelf("menu.addBookmark")}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Puzzle size={16} className="mr-2 opacity-80" aria-hidden="true" />
                  {tSelf("menu.addIntegration")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
