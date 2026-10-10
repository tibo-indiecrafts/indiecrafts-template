"use client";

/**
 * Render one user's consent decisions in a side sheet: current state, then the timeline.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/consent-sheet.md
 */
import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { Badge } from "@indiecrafts/packages-web-ui/web/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@indiecrafts/packages-web-ui/web/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@indiecrafts/packages-web-ui/web/table";
import { useRouter } from "@/i18n/routing";
import type { ConsentDecision, ConsentHistory } from "@/lib/consent-history";

const TYPES = new Set([
  "cookie_analytics",
  "cookie_marketing",
  "marketing_email",
  "legal_reaccept",
  "terms",
  "privacy",
  "content_guidelines",
]);
const SOURCES = new Set([
  "banner",
  "preferences",
  "auto",
  "signup",
  "settings",
  "unsubscribe",
  "account",
  "admin",
]);

/** Opened by `?consent=<userId>` on the users page; closing it drops the query.
 *  `history` is `null` when the api could not be read (shown as an error, never as
 *  "no decisions"). */
export function ConsentSheet({
  email,
  history,
  closeHref,
}: {
  email: string;
  history: ConsentHistory | null;
  closeHref: string;
}) {
  const t = useTranslations("admin.consent");
  const format = useFormatter();
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) router.replace(closeHref);
  };
  const when = (iso: string) =>
    format.dateTime(new Date(iso), { dateStyle: "medium", timeStyle: "short" });
  const typeLabel = (type: string) =>
    TYPES.has(type)
      ? t(`types.${type}`)
      : type.startsWith("email_pref:")
        ? t("types.emailPref", { key: type.slice("email_pref:".length) })
        : type;
  const sourceLabel = (s: string | null) =>
    s === null ? "—" : SOURCES.has(s) ? t(`sources.${s}`) : s;
  const decision = (d: ConsentDecision) => (
    <Badge variant={d.granted ? "default" : "outline"}>
      {d.granted ? t("granted") : t("refused")}
    </Badge>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-3xl">
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description", { email })}</SheetDescription>
        </SheetHeader>
        <div className="space-y-6 px-4 pb-6">
          {history === null ? (
            <p role="alert" className="text-destructive text-sm">
              {t("loadError")}
            </p>
          ) : history.events.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t("empty")}</p>
          ) : (
            <>
              <section aria-labelledby="consent-current" className="space-y-2">
                <h3 id="consent-current" className="text-sm font-semibold">
                  {t("current")}
                </h3>
                <ul className="divide-border divide-y rounded-lg border">
                  {history.current.map((d) => (
                    <li
                      key={d.type}
                      className="flex items-center justify-between gap-4 px-3 py-2 text-sm"
                    >
                      <span>{typeLabel(d.type)}</span>
                      <span className="text-muted-foreground flex items-center gap-3 text-xs">
                        <span className="tabular-nums">{when(d.ts)}</span>
                        {decision(d)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
              <section aria-labelledby="consent-history" className="space-y-2">
                <h3 id="consent-history" className="text-sm font-semibold">
                  {t("history")}
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("when")}</TableHead>
                      <TableHead>{t("type")}</TableHead>
                      <TableHead>{t("decision")}</TableHead>
                      <TableHead>{t("surface")}</TableHead>
                      <TableHead>{t("source")}</TableHead>
                      <TableHead>{t("country")}</TableHead>
                      <TableHead>{t("version")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.events.map((d, i) => (
                      <TableRow key={`${d.ts}-${d.type}-${i}`}>
                        <TableCell className="tabular-nums">{when(d.ts)}</TableCell>
                        <TableCell>{typeLabel(d.type)}</TableCell>
                        <TableCell>{decision(d)}</TableCell>
                        <TableCell>{d.surface}</TableCell>
                        <TableCell>{sourceLabel(d.source)}</TableCell>
                        <TableCell>{d.country ?? "—"}</TableCell>
                        <TableCell className="font-mono text-xs">{d.policyVersion}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </section>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
