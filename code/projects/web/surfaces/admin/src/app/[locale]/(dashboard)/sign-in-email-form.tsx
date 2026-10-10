"use client";

/**
 * Change an account's sign-in email for a person who lost access — typed twice, with a reason.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/sign-in-email-form.md
 */
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { Input } from "@indiecrafts/packages-web-ui/web/input";
import { Label } from "@indiecrafts/packages-web-ui/web/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@indiecrafts/packages-web-ui/web/native-select";
import { useRouter } from "@/i18n/routing";
import { OVERRIDE_REASONS, type OverrideReason } from "@/lib/override-reasons";
import { changeSignInEmail } from "./email-actions";

export function SignInEmailForm({
  userId,
  current,
}: {
  userId: string;
  current: string;
}) {
  const t = useTranslations("admin.emails");
  const router = useRouter();
  const [busy, start] = useTransition();
  const [email, setEmail] = useState("");
  const [again, setAgain] = useState("");
  const [reason, setReason] = useState<OverrideReason>("request_email");

  const submit = () =>
    start(async () => {
      const r = await changeSignInEmail({ userId, email, confirm: again, reason });
      if (!r.ok) {
        toast.error(t(`signIn.errors.${r.error}`));
        return;
      }
      if (r.resend === "failed" || r.resend === "unreachable")
        toast.warning(t("signIn.resendNotMoved"));
      else toast.success(t("signIn.done"));
      setEmail("");
      setAgain("");
      router.refresh();
    });

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <p className="text-muted-foreground text-sm">
        {t("signIn.description")} {t("signIn.current", { email: current })}
      </p>
      <Label htmlFor="sign-in-email-new">{t("signIn.new")}</Label>
      <Input
        id="sign-in-email-new"
        type="email"
        required
        autoComplete="off"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Label htmlFor="sign-in-email-again">{t("signIn.again")}</Label>
      <Input
        id="sign-in-email-again"
        type="email"
        required
        autoComplete="off"
        value={again}
        onChange={(e) => setAgain(e.target.value)}
      />
      <Label htmlFor="sign-in-email-reason">{t("reason")}</Label>
      <NativeSelect
        id="sign-in-email-reason"
        value={reason}
        onChange={(e) => setReason(e.target.value as OverrideReason)}
      >
        {OVERRIDE_REASONS.map((r) => (
          <NativeSelectOption key={r} value={r}>
            {t(`reasons.${r}`)}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <Button type="submit" variant="destructive" disabled={busy || !email || !again}>
        {t("signIn.submit")}
      </Button>
    </form>
  );
}
