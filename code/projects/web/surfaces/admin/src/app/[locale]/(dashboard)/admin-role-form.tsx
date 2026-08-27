"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { Input } from "@indiecrafts/packages-web-ui/web/input";
import { Label } from "@indiecrafts/packages-web-ui/web/label";
import { grantAdmin, revokeAdmin } from "./actions";

/** The one UI for the crown-jewel action — grant/revoke the `admin` role by Clerk user
 *  id. Every call is re-authorized + audited on the server; this form just drives it. */
export function AdminRoleForm() {
  const t = useTranslations("admin.roles");
  const [userId, setUserId] = useState("");
  const [pending, start] = useTransition();

  const run = (
    action: (id: string) => Promise<{ ok: boolean }>,
    okKey: "granted" | "revoked",
  ) =>
    start(async () => {
      const result = await action(userId.trim());
      if (result.ok) toast.success(t(okKey));
      else toast.error(t("error"));
    });

  const disabled = pending || userId.trim().length === 0;

  return (
    <section aria-labelledby="roles-heading" className="flex flex-col gap-3">
      <h2 id="roles-heading" className="text-lg font-medium text-foreground">
        {t("title")}
      </h2>
      <Label htmlFor="uid">{t("label")}</Label>
      <Input
        id="uid"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="user_..."
      />
      <div className="flex gap-2">
        <Button disabled={disabled} onClick={() => run(grantAdmin, "granted")}>
          {t("grant")}
        </Button>
        <Button
          variant="outline"
          disabled={disabled}
          onClick={() => run(revokeAdmin, "revoked")}
        >
          {t("revoke")}
        </Button>
      </div>
    </section>
  );
}
