"use client";

import { useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@indiecrafts/packages-web-ui/web/badge";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { Input } from "@indiecrafts/packages-web-ui/web/input";
import { Label } from "@indiecrafts/packages-web-ui/web/label";
import { saveSetting } from "./actions";

/** One row of `GET /v1/settings` — mirrors the api's response shape (see
 *  `code/shared/api/src/index.ts` `/v1/settings`). */
export type SettingRow = {
  key: string;
  value: number;
  def: number;
  min: number;
  max: number;
  unit: "days" | "hours";
  updatedAt: string | null;
  updatedBy: string | null;
};

/** Keys whose retention window is also disclosed in the privacy policy — changing
 *  one needs a matching policy update, flagged inline so it isn't missed. */
const DRIFT_KEYS = new Set([
  "retention.audit_days",
  "retention.consent_days",
  "retention.erasure_request_days",
]);

/** Group rows by their key's dot-prefix ("retention"/"ops"/"ttl"), preserving
 *  arrival order — the api already emits them grouped, so this is a single pass. */
export function groupSettings(
  rows: SettingRow[],
): { group: string; rows: SettingRow[] }[] {
  const groups: { group: string; rows: SettingRow[] }[] = [];
  for (const row of rows) {
    const group = row.key.split(".")[0] ?? row.key;
    const last = groups.at(-1);
    if (last && last.group === group) last.rows.push(row);
    else groups.push({ group, rows: [row] });
  }
  return groups;
}

type Status = "idle" | "saved" | "error";

/** Grouped number-input editor for the operational settings. One Save calls
 *  `saveSetting` per changed field; the `<main>` landmark lives in the page. */
export function SettingsForm({ settings }: { settings: SettingRow[] }) {
  const t = useTranslations("admin.settings");
  const original = useRef(
    Object.fromEntries(settings.map((s) => [s.key, s.value])),
  ).current;
  const [values, setValues] = useState<Record<string, number>>(original);
  const [overriddenAt, setOverriddenAt] = useState<Record<string, string | null>>(
    () => Object.fromEntries(settings.map((s) => [s.key, s.updatedAt])),
  );
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [pending, startTransition] = useTransition();

  const changedKeys = settings
    .map((s) => s.key)
    .filter((key) => values[key] !== original[key]);

  const handleSave = () => {
    startTransition(async () => {
      const results = await Promise.all(
        changedKeys.map(async (key) => ({
          key,
          result: await saveSetting(key, values[key]),
        })),
      );
      setStatus((prev) => {
        const next = { ...prev };
        for (const { key, result } of results) next[key] = result.ok ? "saved" : "error";
        return next;
      });
      setOverriddenAt((prev) => {
        const next = { ...prev };
        for (const { key, result } of results) {
          if (result.ok) next[key] = new Date().toISOString();
        }
        return next;
      });
    });
  };

  return (
    <div className="mt-8 flex flex-col gap-8">
      {groupSettings(settings).map(({ group, rows }) => (
        <section key={group} aria-labelledby={`settings-group-${group}`}>
          <h2
            id={`settings-group-${group}`}
            className="text-lg font-medium text-foreground"
          >
            {t(`groups.${group}`)}
          </h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {rows.map((row) => {
              const id = `setting-${row.key}`;
              const rowStatus = status[row.key] ?? "idle";
              return (
                <div key={row.key} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={id}>{t(`keys.${row.key}`)}</Label>
                    {overriddenAt[row.key] ? (
                      <Badge variant="secondary">{t("overridden")}</Badge>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      id={id}
                      type="number"
                      min={row.min}
                      max={row.max}
                      value={values[row.key]}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [row.key]: Number(e.target.value),
                        }))
                      }
                      className="max-w-32"
                    />
                    <span className="text-sm text-muted-foreground">
                      {t(`unit.${row.unit}`)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("default", { value: row.def })}
                  </p>
                  {DRIFT_KEYS.has(row.key) ? (
                    <p className="text-xs text-muted-foreground">{t("driftReminder")}</p>
                  ) : null}
                  {rowStatus === "saved" && (
                    <p role="status" className="text-xs text-foreground">
                      {t("saved")}
                    </p>
                  )}
                  {rowStatus === "error" && (
                    <p role="alert" className="text-xs text-destructive">
                      {t("error")}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
      <Button
        onClick={handleSave}
        disabled={pending || changedKeys.length === 0}
        className="w-fit"
      >
        {pending ? t("saving") : t("save")}
      </Button>
    </div>
  );
}
