"use client";

/**
 * Show one person's email preferences and turn them off on request — never on.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/email-prefs-panel.md
 */
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Badge } from "@indiecrafts/packages-web-ui/web/badge";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { Label } from "@indiecrafts/packages-web-ui/web/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@indiecrafts/packages-web-ui/web/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@indiecrafts/packages-web-ui/web/table";
import { useRouter } from "@/i18n/routing";
import type { EmailPrefState } from "@/lib/email-preferences";
import { OVERRIDE_REASONS, type OverrideReason } from "@/lib/override-reasons";
import { turnOffEmails } from "./email-actions";

/** What the admin is about to do: one category off, or every email. */
type Pending = { key: string; name: string } | "all";

export function EmailPrefsPanel({ state }: { state: EmailPrefState }) {
  const t = useTranslations("admin.emails");
  const router = useRouter();
  const [busy, start] = useTransition();
  const [pending, setPending] = useState<Pending | null>(null);
  const subject = state.subject.userId
    ? { userId: state.subject.userId }
    : { email: state.subject.email ?? "" };

  const contact = t(`contact.${contactState(state.resend)}`);
  const isOn = (c: EmailPrefState["categories"][number]) =>
    c.granted === true || c.topic === "opt_in";
  const anyOn =
    state.categories.some(isOn) ||
    (state.resend?.exists === true && !state.resend.unsubscribed);

  const confirm = (reason: OverrideReason) =>
    start(async () => {
      if (!pending) return;
      const r = await turnOffEmails({
        ...subject,
        off: pending === "all" ? [] : [pending.key],
        stopAll: pending === "all",
        reason,
      });
      if (!r.ok) {
        toast.error(t(`errors.${r.error}`));
        return;
      }
      if (r.resend === "failed") toast.warning(t("resendFailed"));
      else toast.success(t("done"));
      setPending(null);
      router.refresh();
    });

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        {state.subject.userId ? null : `${t("noAccount")} `}
        {contact}
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("category")}</TableHead>
            {state.subject.userId ? <TableHead>{t("choice")}</TableHead> : null}
            <TableHead>{t("topic")}</TableHead>
            <TableHead>{t("action")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.categories.map((c) => (
            <TableRow key={c.key}>
              <TableCell>{c.name}</TableCell>
              {state.subject.userId ? (
                <TableCell>
                  <Badge variant={c.granted ? "default" : "outline"}>
                    {c.granted ? t("on") : t("off")}
                  </Badge>
                </TableCell>
              ) : null}
              <TableCell>
                {c.topic === "opt_in"
                  ? t("subscribed")
                  : c.topic === "opt_out"
                    ? t("unsubscribed")
                    : t("unknown")}
              </TableCell>
              <TableCell>
                {isOn(c) ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={() => setPending({ key: c.key, name: c.name })}
                  >
                    {t("turnOff")}
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="destructive"
          disabled={busy || !anyOn}
          onClick={() => setPending("all")}
        >
          {t("stopAll")}
        </Button>
        <p className="text-muted-foreground text-xs">{t("onlyOff")}</p>
      </div>

      {pending ? (
        <OverrideConfirm
          question={
            pending === "all" ? t("confirmStop") : t("confirmOff", { name: pending.name })
          }
          busy={busy}
          onConfirm={confirm}
          onCancel={() => setPending(null)}
        />
      ) : null}
    </div>
  );
}

/** The Resend contact's global state, as a `contact.*` message key. */
function contactState(resend: EmailPrefState["resend"]) {
  if (!resend) return "unknown";
  if (!resend.exists) return "none";
  return resend.unsubscribed ? "stopped" : "active";
}

/** The inline confirm: the question, a required reason (a fixed list), Confirm / Cancel. */
function OverrideConfirm({
  question,
  busy,
  onConfirm,
  onCancel,
}: {
  question: string;
  busy: boolean;
  onConfirm: (reason: OverrideReason) => void;
  onCancel: () => void;
}) {
  const t = useTranslations("admin.emails");
  const [reason, setReason] = useState<OverrideReason>("request_email");
  return (
    <div className="flex flex-col gap-3 rounded-md border p-3" role="group">
      <p className="text-sm font-medium">{question}</p>
      <Label htmlFor="email-override-reason">{t("reason")}</Label>
      <NativeSelect
        id="email-override-reason"
        value={reason}
        onChange={(e) => setReason(e.target.value as OverrideReason)}
      >
        {OVERRIDE_REASONS.map((r) => (
          <NativeSelectOption key={r} value={r}>
            {t(`reasons.${r}`)}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <div className="flex gap-2">
        <Button size="sm" disabled={busy} onClick={() => onConfirm(reason)}>
          {t("confirm")}
        </Button>
        <Button size="sm" variant="ghost" disabled={busy} onClick={onCancel}>
          {t("cancel")}
        </Button>
      </div>
    </div>
  );
}
