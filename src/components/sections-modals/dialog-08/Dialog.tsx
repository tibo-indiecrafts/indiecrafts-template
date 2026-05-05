"use client";

import { UserPlus } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-primitives/avatar";
import { Badge } from "@/components/ui-primitives/badge";
import { Button } from "@/components/ui-primitives/button";
import {
  Dialog as UIDialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui-primitives/dialog";
import { Input } from "@/components/ui-primitives/input";
import { useScopedT } from "@/i18n/scoped-t";
import { dialog08Members, dialog08Namespace } from "./config";
import type { DialogBlock, DialogStatus } from "./schema";

/**
 * Invite-members modal — email-invite row + list of existing members
 * with avatars + status badges. Sourced from `@blocks-so/dialog-08`.
 */
export default function Dialog(props: Readonly<DialogBlock>) {
  const [t, tr] = useScopedT(dialog08Namespace);
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  const inviteId = `${props.id}-invite-email`;
  const members = props.members ?? dialog08Members;

  return (
    <UIDialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{tr(props.triggerKey, "trigger")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground font-semibold text-balance">
            {tr(props.titleKey, "title")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm leading-6 text-pretty">
            {tr(props.descriptionKey, "description")}
          </DialogDescription>
        </DialogHeader>
        <form>
          <div className="flex w-full items-center space-x-2">
            <div className="relative flex-1">
              <UserPlus
                className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                aria-hidden="true"
              />
              <Input
                id={inviteId}
                name="invite-email"
                type="email"
                autoComplete="email"
                className="h-10 pl-9"
                placeholder={tr(
                  props.inviteEmailPlaceholderKey,
                  "inviteEmailPlaceholder",
                )}
              />
            </div>
            <Button type="submit" className="h-10">
              {tr(props.inviteSubmitKey, "inviteSubmit")}
            </Button>
          </div>
        </form>
        <h4 className="text-foreground mt-4 text-sm font-medium text-balance">
          {tr(props.membersHeadingKey, "membersHeading")}
        </h4>
        <ul className="divide-y">
          {members.map((member) => (
            <li key={member.email} className="flex items-center justify-between py-2.5">
              <div className="flex items-center space-x-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={member.avatarUrl} alt={member.name} />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <span className="text-foreground font-medium">{member.name}</span>
              </div>
              <Badge variant="outline" className="bg-background text-xs font-medium">
                {t(`status.${member.status as DialogStatus}`)}
              </Badge>
            </li>
          ))}
        </ul>
      </DialogContent>
    </UIDialog>
  );
}
