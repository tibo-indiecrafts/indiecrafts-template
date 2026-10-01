"use client";

/**
 * Render the operator's moves on one data request: start it, or close it with a reply.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/data-request-actions.md
 */

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { Checkbox } from "@indiecrafts/packages-web-ui/web/checkbox";
import { Label } from "@indiecrafts/packages-web-ui/web/label";
import { Textarea } from "@indiecrafts/packages-web-ui/web/textarea";
import { useRouter } from "@/i18n/routing";
import { setDataRequestStatus } from "./monitoring-actions";

type Closing = "done" | "rejected";

// A prefilled reply marks what the operator must write in [brackets] (e.g. the reason of a
// refusal — GDPR Art. 12(4)); it cannot be sent until every bracket is replaced.
const UNFINISHED = /\[[^\]\n]+\]/;

/** Only the moves the status allows (`new`: start, done, reject · `in-progress`: done,
 *  reject · closed: none). Done / Reject open a reply prefilled in the requester's language;
 *  "Email the requester" is on by default and then needs a reply. */
export function DataRequestActions({
  id,
  status,
  prefill,
}: {
  id: number;
  status: string;
  prefill: Record<Closing, string>;
}) {
  const t = useTranslations("admin.dataRequests");
  const router = useRouter();
  const [pending, start] = useTransition();
  const [mode, setMode] = useState<Closing | null>(null);
  const [note, setNote] = useState("");
  const [notify, setNotify] = useState(true);

  if (status !== "new" && status !== "in-progress")
    return <p className="text-muted-foreground text-sm">{t("sheet.closed")}</p>;

  const run = (to: string, text: string, email: boolean) =>
    start(async () => {
      const r = await setDataRequestStatus(id, status, to, text, email);
      if (!r.ok) {
        toast.error(t(`actions.errors.${r.error}`));
        // Someone else moved it: reload, so the sheet shows the real status and moves.
        if (r.error === "changed" || r.error === "not_allowed") router.refresh();
        return;
      }
      if (email && !r.notified) toast.warning(t("actions.savedNoEmail"));
      else toast.success(t("actions.saved"));
      setMode(null);
      router.refresh();
    });

  const unfinished = UNFINISHED.test(note);
  const choose = (m: Closing) => {
    setMode(m);
    setNote(prefill[m]);
    setNotify(true);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {status === "new" ? (
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => run("in-progress", "", false)}
          >
            {t("actions.start")}
          </Button>
        ) : null}
        <Button size="sm" disabled={pending} onClick={() => choose("done")}>
          {t("actions.done")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => choose("rejected")}
        >
          {t("actions.reject")}
        </Button>
      </div>

      {mode ? (
        <div className="flex flex-col gap-3 rounded-md border p-3">
          <Label htmlFor={`dr-reply-${id}`}>{t("actions.reply")}</Label>
          <Textarea
            id={`dr-reply-${id}`}
            value={note}
            maxLength={4000}
            rows={10}
            aria-describedby={unfinished ? `dr-reply-hint-${id}` : undefined}
            onChange={(e) => setNote(e.target.value)}
          />
          {unfinished ? (
            <p id={`dr-reply-hint-${id}`} className="text-muted-foreground text-xs">
              {t("actions.unfinished")}
            </p>
          ) : null}
          <div className="flex items-center gap-2">
            <Checkbox
              id={`dr-notify-${id}`}
              checked={notify}
              onCheckedChange={(v) => setNotify(v === true)}
            />
            <Label htmlFor={`dr-notify-${id}`} className="font-normal">
              {t("actions.notify")}
            </Label>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={mode === "rejected" ? "destructive" : "default"}
              disabled={pending || unfinished || (notify && !note.trim())}
              onClick={() => run(mode, note, notify)}
            >
              {t(mode === "done" ? "actions.confirmDone" : "actions.confirmRejected")}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={pending}
              onClick={() => setMode(null)}
            >
              {t("actions.cancel")}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
