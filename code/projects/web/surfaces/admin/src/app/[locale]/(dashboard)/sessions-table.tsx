"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import {
  listUserSessions,
  revokeSession,
  revokeUserSessions,
  type LiveSession,
} from "./actions";

export type SessionRow = {
  ts: string;
  surface: string;
  user_id: string;
  session_id: string | null;
  country: string | null;
};

/** The sign-in activity feed (from the EU D1) with per-user LIVE session management:
 *  expand a row to load the user's active Clerk sessions and revoke one — or all. */
export function SessionsTable({ rows }: { rows: SessionRow[] }) {
  const t = useTranslations("admin.sessions");
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-muted-foreground">
          <tr>
            <th className="py-2 pr-4 font-medium">{t("when")}</th>
            <th className="py-2 pr-4 font-medium">{t("surface")}</th>
            <th className="py-2 pr-4 font-medium">{t("user")}</th>
            <th className="py-2 pr-4 font-medium">{t("country")}</th>
            <th className="py-2 font-medium">{t("actions")}</th>
          </tr>
        </thead>
        <tbody className="text-foreground">
          {rows.map((row, i) => (
            <Row key={i} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ row }: { row: SessionRow }) {
  const t = useTranslations("admin.sessions");
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);
  const [live, setLive] = useState<LiveSession[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const toggle = () => {
    if (!open && live === null) {
      start(async () => setLive(await listUserSessions(row.user_id)));
    }
    setOpen((v) => !v);
  };

  const revokeOne = (id: string) =>
    start(async () => {
      const res = await revokeSession(id);
      setMessage(res.ok ? t("revoked") : t("error"));
      if (res.ok) setLive((l) => l?.filter((s) => s.id !== id) ?? null);
    });

  const revokeAll = () =>
    start(async () => {
      const res = await revokeUserSessions(row.user_id);
      setMessage(res.ok ? t("revoked") : t("error"));
      if (res.ok) setLive([]);
    });

  return (
    <>
      <tr className="border-t border-border">
        <td className="py-2 pr-4 tabular-nums">{row.ts}</td>
        <td className="py-2 pr-4">{row.surface}</td>
        <td className="py-2 pr-4 font-mono text-xs">{row.user_id}</td>
        <td className="py-2 pr-4">{row.country ?? "—"}</td>
        <td className="flex gap-2 py-2">
          <Button variant="outline" size="sm" disabled={pending} onClick={toggle}>
            {open ? t("hide") : t("manage")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={revokeAll}
          >
            {t("signOutUser")}
          </Button>
        </td>
      </tr>
      {open ? (
        <tr className="border-t border-border/50 bg-muted/30">
          <td colSpan={5} className="px-4 py-3">
            {live === null ? (
              <p className="text-muted-foreground">{t("loading")}</p>
            ) : live.length === 0 ? (
              <p className="text-muted-foreground">{t("noLive")}</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {live.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-4">
                    <span className="text-sm">
                      {[s.device, s.browser, s.location]
                        .filter(Boolean)
                        .join(" · ") || s.id}
                      <span className="ml-2 text-xs text-muted-foreground tabular-nums">
                        {new Date(s.lastActiveAt).toLocaleString()}
                      </span>
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pending}
                      onClick={() => revokeOne(s.id)}
                    >
                      {t("revoke")}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            {message ? (
              <p role="status" className="mt-2 text-sm text-muted-foreground">
                {message}
              </p>
            ) : null}
          </td>
        </tr>
      ) : null}
    </>
  );
}
