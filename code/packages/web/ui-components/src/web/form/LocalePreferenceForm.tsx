"use client";

import { useState } from "react";

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
      <label className="block text-sm font-medium" htmlFor="locale-preference">
        {copy.label}
      </label>
      <select
        id="locale-preference"
        className="border-input bg-background rounded-md border px-3 py-2 text-sm"
        value={locale}
        onChange={(e) => {
          setLocale(e.target.value);
          setStatus("idle");
        }}
      >
        {locales.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={status === "pending"}
          className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {status === "pending" ? copy.pending : copy.save}
        </button>
        {status === "success" ? <span className="text-sm text-green-600">{copy.success}</span> : null}
        {status === "error" ? <span className="text-destructive text-sm">{copy.error}</span> : null}
      </div>
    </section>
  );
}
