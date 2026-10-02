"use client";

/**
 * Render the logged-in-only announcement banner and toast.
 *
 * @see docs/reference/projects/web/app/src/user-interface/AnnouncementChrome.md
 */
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@clerk/nextjs";
import {
  fetchAnnouncements,
  type AnnouncementPayload,
} from "@indiecrafts/packages-shared-announcement";
import { AnnouncementBar } from "@indiecrafts/packages-web-announcement/AnnouncementBar";
import { AnnouncementToast } from "@indiecrafts/packages-web-announcement/AnnouncementToast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Logged-in-only announcement chrome for the app surface. Mounted (in `[locale]/layout`)
 * only when Clerk is configured, so `useAuth` has its provider. Fetches the shared api
 * Worker's PUBLIC `/v1/announcements` for this surface + locale ONLY when signed in, and
 * renders the shared banner (top strip) + toast. Copy is authored in Sanity; the only
 * chrome strings are the region/dismiss/copy labels (`messages.announcement.*`).
 */
export function AnnouncementChrome() {
  const { isSignedIn } = useAuth();
  const locale = useLocale();
  const t = useTranslations("announcement");
  const [data, setData] = useState<AnnouncementPayload | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;
    let alive = true;
    void fetchAnnouncements(API_URL, { locale, surface: "app" }).then((r) => {
      if (alive) setData(r);
    });
    return () => {
      alive = false;
    };
  }, [isSignedIn, locale]);

  if (!isSignedIn || !data) return null;
  const { banner, toast } = data;
  return (
    <>
      {banner.items.length > 0 ? (
        <AnnouncementBar
          items={banner.items}
          variant={banner.variant}
          dismissible={banner.dismissible}
          version={banner.version}
          regionLabel={t("region")}
          dismissLabel={t("dismiss")}
          copyLabel={t("copy")}
          copiedLabel={t("copied")}
        />
      ) : null}
      <AnnouncementToast toast={toast} dismissLabel={t("dismiss")} />
    </>
  );
}
