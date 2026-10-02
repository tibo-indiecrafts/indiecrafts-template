"use client";

/**
 * Renders the transport-agnostic email preference centre.
 *
 * @see docs/reference/packages/shared/compliance/src/web/EmailPreferences.md
 */

import { useCallback, useEffect, useState } from "react";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { Switch } from "@indiecrafts/packages-web-ui/web/switch";

export interface EmailPreferenceCategory {
  key: string;
  /** Already locale-resolved by the api — render as-is. */
  name: string;
  /** Already locale-resolved by the api — render as-is. */
  description: string;
  includeAtSignup: boolean;
  granted: boolean;
}

/** A display-only notice (e.g. transactional/security email) — no toggle. */
export interface EmailPreferenceNotice {
  name: string;
  description: string;
}

export interface EmailPreferencesData {
  categories: EmailPreferenceCategory[];
  notices: EmailPreferenceNotice[];
  marketing_email: boolean | null;
}

export interface EmailPreferencesUpdate {
  key: string;
  granted: boolean;
}

/** Chrome strings from `messages/` — everything else (category/notice copy) comes from the api. */
export interface EmailPreferencesCopy {
  noticesHeading: string;
  loading: string;
  error: string;
  retry: string;
}

export interface EmailPreferencesProps {
  read: () => Promise<EmailPreferencesData>;
  write: (updates: EmailPreferencesUpdate[]) => Promise<void>;
  chrome: EmailPreferencesCopy;
}

/** The signed-in transport: `GET/POST /v1/consent/email-preferences` with the user's
 *  Clerk JWT. The read asks for the page's `locale`, so the category copy matches the UI.
 *  Throws on a missing token or a non-2xx, so the UI shows its error state instead of a
 *  falsely empty list. `f` is injectable for tests. */
export function emailPreferencesIo(
  apiUrl: string,
  getToken: () => Promise<string | null>,
  surface: string,
  locale: string,
  f: typeof fetch = (...a) => fetch(...a),
): Pick<EmailPreferencesProps, "read" | "write"> {
  const url = `${apiUrl}/v1/consent/email-preferences`;
  const auth = async () => {
    const token = await getToken();
    if (!token) throw new Error("no token");
    return `Bearer ${token}`;
  };
  return {
    read: async () => {
      const res = await f(`${url}?locale=${encodeURIComponent(locale)}`, {
        headers: { authorization: await auth() },
      });
      if (!res.ok) throw new Error(`email-preferences ${res.status}`);
      return (await res.json()) as EmailPreferencesData;
    },
    write: async (updates) => {
      const res = await f(url, {
        method: "POST",
        headers: {
          authorization: await auth(),
          "content-type": "application/json",
        },
        body: JSON.stringify({ updates, surface }),
      });
      if (!res.ok) throw new Error(`email-preferences ${res.status}`);
    },
  };
}

/**
 * The email preference centre — a switch per category (optimistic, rolls back on a
 * failed write) plus a read-only "Account & security" notices list. Transport-agnostic:
 * `read`/`write` are injected, so the same UI serves the JWT account mount and the
 * public token page. Category/notice copy comes from the api already locale-resolved.
 */
export function EmailPreferences({
  read,
  write,
  chrome,
}: EmailPreferencesProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [categories, setCategories] = useState<EmailPreferenceCategory[]>([]);
  const [notices, setNotices] = useState<EmailPreferenceNotice[]>([]);
  const [saveError, setSaveError] = useState(false);
  const [savingKeys, setSavingKeys] = useState<Set<string>>(new Set());
  // Bumped by the retry button to re-run the load effect below.
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const data = await read();
        if (!alive) return;
        setCategories(data.categories);
        setNotices(data.notices);
        setStatus("ready");
      } catch (error) {
        console.error("email preferences load failed", error);
        if (alive) setStatus("error");
      }
    })();
    return () => {
      alive = false;
    };
  }, [read, reloadToken]);

  const toggle = useCallback(
    async (key: string, granted: boolean) => {
      setSaveError(false);
      setCategories((cs) =>
        cs.map((c) => (c.key === key ? { ...c, granted } : c)),
      );
      setSavingKeys((s) => new Set(s).add(key));
      try {
        await write([{ key, granted }]);
      } catch (error) {
        console.error("email preference save failed", key, error);
        setCategories((cs) =>
          cs.map((c) => (c.key === key ? { ...c, granted: !granted } : c)),
        );
        setSaveError(true);
      }
      // After try/catch, not in `finally`: the React Compiler can't lower a `finally`
      // clause, and the catch never rethrows, so this always runs.
      setSavingKeys((s) => {
        const next = new Set(s);
        next.delete(key);
        return next;
      });
    },
    [write],
  );

  if (status === "loading") {
    return (
      <p role="status" className="text-muted-foreground text-sm">
        {chrome.loading}
      </p>
    );
  }

  if (status === "error") {
    return (
      <div role="alert" className="space-y-3">
        <p className="text-destructive text-sm">{chrome.error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setStatus("loading");
            setReloadToken((n) => n + 1);
          }}
        >
          {chrome.retry}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ul className="flex flex-col gap-3">
        {categories.map((category) => {
          const id = `email-preference-${category.key}`;
          return (
            <li
              key={category.key}
              className="flex items-start justify-between gap-4"
            >
              <label htmlFor={id} className="flex-1 cursor-pointer">
                <span className="text-foreground block text-sm font-medium">
                  {category.name}
                </span>
                <span className="text-muted-foreground mt-0.5 block text-xs">
                  {category.description}
                </span>
              </label>
              <Switch
                id={id}
                checked={category.granted}
                disabled={savingKeys.has(category.key)}
                onCheckedChange={(checked) =>
                  void toggle(category.key, checked)
                }
              />
            </li>
          );
        })}
      </ul>

      {saveError ? (
        <p role="alert" className="text-destructive text-sm">
          {chrome.error}
        </p>
      ) : null}

      {notices.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-foreground text-sm font-semibold">
            {chrome.noticesHeading}
          </h3>
          <ul className="flex flex-col gap-3">
            {notices.map((notice) => (
              <li key={notice.name} className="flex flex-col gap-0.5">
                <span className="text-foreground text-sm font-medium">
                  {notice.name}
                </span>
                <span className="text-muted-foreground text-xs">
                  {notice.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
