"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { Switch } from "@indiecrafts/packages-web-ui/web/switch";
import { logger } from "@indiecrafts/packages-shared-logger";

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

/**
 * The email preference centre — a switch per category (optimistic, rolls back on a
 * failed write) plus a read-only "Account & security" notices list. Transport-agnostic:
 * `read`/`write` are injected, so the same UI serves the JWT account mount and the
 * public token page. Category/notice copy comes from the api already locale-resolved.
 */
export function EmailPreferences({ read, write, chrome }: EmailPreferencesProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
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
        logger.error("email preferences load failed", error);
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
      setCategories((cs) => cs.map((c) => (c.key === key ? { ...c, granted } : c)));
      setSavingKeys((s) => new Set(s).add(key));
      try {
        await write([{ key, granted }]);
      } catch (error) {
        logger.error("email preference save failed", error, { key });
        setCategories((cs) =>
          cs.map((c) => (c.key === key ? { ...c, granted: !granted } : c)),
        );
        setSaveError(true);
      } finally {
        setSavingKeys((s) => {
          const next = new Set(s);
          next.delete(key);
          return next;
        });
      }
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
            <li key={category.key} className="flex items-start justify-between gap-4">
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
                onCheckedChange={(checked) => void toggle(category.key, checked)}
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
                <span className="text-foreground text-sm font-medium">{notice.name}</span>
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
