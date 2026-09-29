/**
 * Compose the production page chrome — header, footer, announcements, and locale suggestion.
 *
 * @see docs/reference/projects/web/website/src/user-interface/shared/layout/DefaultLayout.md
 */
import type { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { resolveConsentMode } from "@indiecrafts/packages-shared-compliance/shared";
import { consent, features, localeCodes, localeMap, site, type Locale } from "@/config";
import { ShareButtons } from "@indiecrafts/packages-web-ui-components/web/layout/ShareButtons";
import { DEFAULT_SITE_NAME, getSiteSeo, getSiteSettings } from "@/lib/seo/site-seo";
import { resolveThemeConfig, showThemeToggle, themeModes } from "@/lib/theme";
import { getNavigation } from "@/lib/navigation";
import { AnnouncementBar } from "@indiecrafts/packages-web-announcement/AnnouncementBar";
import { AnnouncementToast } from "@indiecrafts/packages-web-announcement/AnnouncementToast";
import {
  getAnnouncement,
  getAnnouncementToast,
} from "@indiecrafts/packages-web-announcement/sanity/announcement";
import {
  ANNOUNCEMENT_COOKIE,
  ANNOUNCEMENT_TOAST_COOKIE,
} from "@indiecrafts/packages-web-announcement/announcement-store";
import { LocaleSuggest } from "@indiecrafts/packages-web-locale-suggest/LocaleSuggest";
import { getLocaleSuggest } from "@indiecrafts/packages-web-locale-suggest/sanity/reader";
import { detectPreferredLocale } from "@indiecrafts/packages-web-locale-suggest/detect";
import { LOCALE_SUGGEST_COOKIE } from "@indiecrafts/packages-web-locale-suggest/locale-suggest-store";
import { SkipLink } from "./SkipLink";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { OfflineBanner } from "@indiecrafts/packages-web-system-pages/web";

/**
 * Production default layout, colocated in `@/user-interface/layout` so the app owns
 * its chrome without depending on the sibling component library.
 *
 * `<main>` gets `pt-14 lg:pt-20` to clear the fixed Header height (h-14
 * mobile / h-20 desktop). `flex-1` pushes Footer to viewport bottom when
 * page content is short (the [locale]/layout.tsx <body> is `flex
 * min-h-screen flex-col`).
 */

type Props = {
  children: ReactNode;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
  /** Optional bar rendered directly under the header chrome (e.g. the blog
   *  category nav) and above the page content. */
  subnav?: ReactNode;
};

export async function DefaultLayout({
  children,
  header = true,
  footer = true,
  subnav,
}: Props) {
  // Brand logo comes from Sanity (`siteSettings`). Fetched once here (React
  // `cache()` dedupes with the layout's own `getSiteSettings` call) and passed
  // into the default Header/Footer so `Logo` stays a presentational component
  // renderable inside the client Header.
  const locale = (await getLocale()) as Locale;
  // Layout data + top-of-main chrome (announcement bar + language suggestion) in one
  // batch — all keyed on `locale`, none feeds another. The chrome bits are decided
  // server-side (cookie + Accept-Language) so they never flash.
  const [settings, nav, siteSeo, announcement, toast, suggestCopy] = await Promise.all([
    getSiteSettings(),
    getNavigation(locale),
    getSiteSeo(locale),
    getAnnouncement(locale, "website"),
    getAnnouncementToast(locale, "website"),
    getLocaleSuggest(locale),
  ]);
  const { brand, social, business } = settings;
  const name = settings.siteName || DEFAULT_SITE_NAME;
  // Theme + display toggles: Sanity (`themeModes`/`showLocaleSwitcher`) over the code
  // default/master, resolved server-side and prop-fed (Header/ThemeToggle are client).
  const cfg = resolveThemeConfig(settings.themeModes);
  const showLocaleSwitcher =
    features.localeSwitcher && settings.showLocaleSwitcher !== false;

  const jar = await cookies();
  // Geo-resolve the consent mode the same way `[locale]/layout.tsx` does, so the
  // footer's CCPA "Do Not Sell" link is gated to opt-out (US/CCPA) visitors with no
  // client-side flash — cheap to recompute here (pure function, `headers()` already read).
  const consentMode = resolveConsentMode((await headers()).get("cf-ipcountry"), consent);
  const t = await getTranslations("common");
  const tOffline = await getTranslations("offline");
  const showAnnouncement =
    announcement.items.length > 0 &&
    jar.get(ANNOUNCEMENT_COOKIE)?.value !== announcement.version;
  // Toast dismissal decided server-side too (no flash), same as the bar.
  const showToast = toast && jar.get(ANNOUNCEMENT_TOAST_COOKIE)?.value !== toast.version;
  const suggested =
    jar.get(LOCALE_SUGGEST_COOKIE) || !suggestCopy.message
      ? null
      : detectPreferredLocale(
          (await headers()).get("accept-language"),
          locale,
          localeCodes,
        );

  // Site-wide "share this page" in the footer — enabled + the visible networks are
  // editor-controlled (`siteSettings.share`, Sanity). The URL comes from the request
  // path (`x-pathname`, set in proxy.ts), so no page threads it through.
  const sharePathname = (await headers()).get("x-pathname") ?? "/";
  const shareNode = settings.share.enabled ? (
    <ShareButtons
      url={`${site.url}${sharePathname}`}
      title={name}
      networks={settings.share.networks}
      labels={{
        label: t("share.label"),
        x: t("share.x"),
        linkedin: t("share.linkedin"),
        facebook: t("share.facebook"),
        copy: t("share.copy"),
        copied: t("share.copied"),
      }}
    />
  ) : undefined;

  return (
    <>
      <SkipLink />
      {resolveSlot(
        header,
        <Header
          name={name}
          logo={brand.logo}
          logoDark={brand.logoDark}
          items={nav.header}
          showThemeToggle={showThemeToggle(cfg)}
          themeModes={themeModes(cfg)}
          showLocaleSwitcher={showLocaleSwitcher}
        />,
      )}
      <main id="main" tabIndex={-1} className="flex-1 pt-14 outline-none lg:pt-20">
        <OfflineBanner message={tOffline("banner")} />
        {showAnnouncement ? (
          <AnnouncementBar
            items={announcement.items}
            variant={announcement.variant}
            dismissible={announcement.dismissible}
            version={announcement.version}
            dismissLabel={t("dismiss")}
            copyLabel={t("copy")}
            copiedLabel={t("copied")}
          />
        ) : null}
        <AnnouncementToast toast={showToast ? toast : null} dismissLabel={t("dismiss")} />
        {suggested &&
        suggestCopy.message &&
        suggestCopy.switchLabel &&
        suggestCopy.dismissLabel ? (
          <LocaleSuggest
            suggested={suggested}
            suggestedLabel={localeMap[suggested as Locale]?.label ?? suggested}
            message={suggestCopy.message}
            switchLabel={suggestCopy.switchLabel}
            dismissLabel={suggestCopy.dismissLabel}
          />
        ) : null}
        {subnav}
        {children}
      </main>
      {resolveSlot(
        footer,
        <Footer
          name={name}
          tagline={siteSeo.tagline}
          company={business.company}
          logo={brand.logo}
          logoDark={brand.logoDark}
          social={social}
          columns={nav.footerColumns}
          madeBy={settings.madeBy}
          showDoNotSell={consentMode === "opt-out"}
          share={shareNode}
        />,
      )}
    </>
  );
}

function resolveSlot(value: boolean | ReactNode, fallback: ReactNode): ReactNode {
  if (value === false) return null;
  if (value === true) return fallback;
  return value;
}
