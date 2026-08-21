"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { grantAdmin, revokeAdmin } from "./actions";

/** The one UI for the crown-jewel action — grant/revoke the `admin` role by Clerk user
 *  id. Every call is re-authorized + audited on the server; this form just drives it. */
export function AdminRoleForm() {
  const t = useTranslations("admin.roles");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const run = (
    action: (id: string) => Promise<{ ok: boolean }>,
    okKey: "granted" | "revoked",
  ) =>
    start(async () => {
      setMessage(null);
      const result = await action(userId.trim());
      setMessage(result.ok ? t(okKey) : t("error"));
    });

  const disabled = pending || userId.trim().length === 0;

  return (
    <section aria-labelledby="roles-heading" className="mt-8 flex flex-col gap-3">
      <h2 id="roles-heading" className="text-lg font-medium text-foreground">
        {t("title")}
      </h2>
      <label htmlFor="uid" className="text-sm text-muted-foreground">
        {t("label")}
      </label>
      <input
        id="uid"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="user_..."
        className="h-10 rounded-md border border-input bg-background px-3 text-foreground"
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
      {message ? (
        <p role="status" className="text-sm text-muted-foreground">
          {message}
        </p>
      ) : null}
    </section>
  );
}
