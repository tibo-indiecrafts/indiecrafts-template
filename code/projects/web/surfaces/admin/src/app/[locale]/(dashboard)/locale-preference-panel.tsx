"use client";

import { useAuth } from "@clerk/nextjs";
import {
  LocalePreferenceForm,
  type LocalePreferenceCopy,
} from "@indiecrafts/packages-web-ui-components/web/form/LocalePreferenceForm";

/**
 * Client wrapper around the shared LocalePreferenceForm — supplies Clerk's getToken.
 * Copy + current locale are resolved server-side by the settings page. Mirrors the
 * website/app AccountDeletePanel; placed beside `settings-form.tsx` (this route
 * group's existing client components, kebab-case, no `src/user-interface/` here).
 */
export function LocalePreferencePanel({
  copy,
  currentLocale,
  locales,
}: {
  copy: LocalePreferenceCopy;
  currentLocale: string;
  locales: readonly { code: string; label: string }[];
}) {
  const { getToken } = useAuth();
  return (
    <LocalePreferenceForm
      apiUrl={process.env.NEXT_PUBLIC_API_URL ?? ""}
      currentLocale={currentLocale}
      locales={locales}
      copy={copy}
      getToken={async () => {
        const t = await getToken();
        return t;
      }}
    />
  );
}
