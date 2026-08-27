"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@indiecrafts/packages-web-ui/web/table";
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

// Column count of the table below — the expanded detail row spans all of them.
const COLUMN_COUNT = 5;

/** The sign-in activity feed (from the EU D1) with per-user LIVE session management:
 *  expand a row to load the user's active Clerk sessions and revoke one — or all. */
export function SessionsTable({ rows }: { rows: SessionRow[] }) {
  const t = useTranslations("admin.sessions");
  return (
    <div className="mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("when")}</TableHead>
            <TableHead>{t("surface")}</TableHead>
            <TableHead>{t("user")}</TableHead>
            <TableHead>{t("country")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <Row key={i} row={row} />
          ))}
        </TableBody>
      </Table>
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
      <TableRow>
        <TableCell className="tabular-nums">{row.ts}</TableCell>
        <TableCell>{row.surface}</TableCell>
        <TableCell className="font-mono text-xs">{row.user_id}</TableCell>
        <TableCell>{row.country ?? "—"}</TableCell>
        <TableCell className="flex gap-2">
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
        </TableCell>
      </TableRow>
      {open ? (
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          <TableCell colSpan={COLUMN_COUNT} className="whitespace-normal px-4 py-3">
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
          </TableCell>
        </TableRow>
      ) : null}
    </>
  );
}
