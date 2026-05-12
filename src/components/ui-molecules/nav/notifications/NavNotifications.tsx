"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-primitives/avatar";
import { Button } from "@/components/ui-primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui-primitives/dropdown-menu";
import { BellIcon } from "lucide-react";
import { useScopedT } from "@/i18n/scoped-t";
import { navNotificationsNamespace } from "./config";

type SidebarMoleculeNamespace = Parameters<typeof useScopedT>[0];

type Notification = {
  id: string;
  avatar: string;
  fallback: string;
};

export function NavNotifications({
  notifications,
  namespace,
}: {
  notifications: Notification[];
  namespace: SidebarMoleculeNamespace;
}) {
  const [t] = useScopedT(namespace);
  const [tSelf] = useScopedT(navNotificationsNamespace);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label={tSelf("openLabel")}
        >
          <BellIcon className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" className="my-6 w-80">
        <DropdownMenuLabel>{tSelf("title")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map(({ id, avatar, fallback }) => (
          <DropdownMenuItem key={id} className="flex items-start gap-3">
            <Avatar className="size-8">
              <AvatarImage src={avatar} alt="" />
              <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {t(`notifications.items.${id}.text`)}
              </span>
              <span className="text-muted-foreground text-xs">
                {t(`notifications.items.${id}.time`)}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-muted-foreground hover:text-primary justify-center text-sm">
          {tSelf("viewAll")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
