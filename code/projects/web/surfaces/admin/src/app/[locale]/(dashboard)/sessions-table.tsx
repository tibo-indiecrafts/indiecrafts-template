"use client";

/**
 * Render the sign-in feed with per-user live Clerk session management.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/sessions-table.md
 */
import { useState, useTransition } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { toast } from "sonner";
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
export function SessionsTable({
  rows,
  emails = {},
}: {
  rows: SessionRow[];
  /** user id → email, resolved live from Clerk by the page (never stored). */
  emails?: Record<string, string>;
}) {
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
            <Row key={i} row={row} email={emails[row.user_id]} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// One date-time style for the feed and the live sessions; the zone (UTC) comes from
// the next-intl config, so the server and browser renders match.
const WHEN = { dateStyle: "medium", timeStyle: "short" } as const;

function Row({ row, email }: { row: SessionRow; email?: string }) {
  const t = useTranslations("admin.sessions");
  const format = useFormatter();
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);
  const [live, setLive] = useState<LiveSession[] | null>(null);
  // A toast, not an inline line: "sign out everywhere" also runs with the row collapsed.
  const notify = (ok: boolean) => (ok ? toast.success(t("revoked")) : toast.error(t("error")));

  const toggle = () => {
    if (!open && live === null) {
      start(async () => setLive(await listUserSessions(row.user_id)));
    }
    setOpen((v) => !v);
  };

  const revokeOne = (id: string) =>
    start(async () => {
      const res = await revokeSession(id);
      notify(res.ok);
      if (res.ok) setLive((l) => l?.filter((s) => s.id !== id) ?? null);
    });

  const revokeAll = () =>
    start(async () => {
      const res = await revokeUserSessions(row.user_id);
      notify(res.ok);
      if (res.ok) setLive([]);
    });

  return (
    <>
      <TableRow>
        <TableCell className="tabular-nums">
          {format.dateTime(new Date(row.ts), WHEN)}
        </TableCell>
        <TableCell>{row.surface}</TableCell>
        <TableCell>
          {email ? <div>{email}</div> : null}
          <div className="font-mono text-xs text-muted-foreground">{row.user_id}</div>
        </TableCell>
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
                        {format.dateTime(new Date(s.lastActiveAt), WHEN)}
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
          </TableCell>
        </TableRow>
      ) : null}
    </>
  );
}
