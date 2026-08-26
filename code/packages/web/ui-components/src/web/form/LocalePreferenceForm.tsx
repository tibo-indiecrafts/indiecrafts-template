"use client";

import { useId, useState } from "react";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { Label } from "@indiecrafts/packages-web-ui/web/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@indiecrafts/packages-web-ui/web/native-select";

export type LocalePreferenceCopy = {
  heading: string;
  description: string;
  label: string;
  save: string;
  pending: string;
  success: string;
  error: string;
};

type Status = "idle" | "pending" | "success" | "error";

/**
 * Language selector for a signed-in user. Clerk-free: the caller passes `getToken`
 * (so this brick keeps no auth dependency) and the api origin. POSTs the choice to
 * the worker's `POST /v1/profile/locale`. Presentational status states only.
 */
export function LocalePreferenceForm({
  apiUrl,
  currentLocale,
  locales,
  copy,
  getToken,
}: {
  apiUrl: string;
  currentLocale: string;
  locales: readonly { code: string; label: string }[];
  copy: LocalePreferenceCopy;
  getToken: () => Promise<string | null>;
}) {
  const [locale, setLocale] = useState(currentLocale);
  const [status, setStatus] = useState<Status>("idle");
  const uid = useId();

  async function save() {
    setStatus("pending");
    try {
      const token = await getToken();
      const res = await fetch(`${apiUrl}/v1/profile/locale`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ locale }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-medium">{copy.heading}</h2>
        <p className="text-muted-foreground text-sm">{copy.description}</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${uid}-locale`}>{copy.label}</Label>
        <NativeSelect
          id={`${uid}-locale`}
          value={locale}
          onChange={(e) => {
            setLocale(e.target.value);
            setStatus("idle");
          }}
        >
          {locales.map((l) => (
            <NativeSelectOption key={l.code} value={l.code}>
              {l.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <div className="flex items-center gap-3">
        <Button type="button" onClick={save} disabled={status === "pending"}>
          {status === "pending" ? copy.pending : copy.save}
        </Button>
        {status === "success" ? (
          <p
            role="status"
            aria-live="polite"
            className="bg-muted text-muted-foreground rounded-lg px-4 py-3 text-sm"
          >
            {copy.success}
          </p>
        ) : null}
        {status === "error" ? (
          <p role="alert" aria-live="assertive" className="text-destructive text-sm">
            {copy.error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
