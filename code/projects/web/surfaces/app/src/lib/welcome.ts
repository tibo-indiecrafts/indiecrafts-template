/**
 * Read the editor-owned home welcome message from Sanity.
 *
 * @see docs/reference/projects/web/app/src/lib/welcome.md
 */
import { liveQuery } from "./sanity-live";

/**
 * The editor-owned home welcome message (`appContent` singleton), read live and
 * fail-open (`liveQuery`): no welcome → the home falls back to its own message-file
 * subtitle. Mirrors `website/src/lib/maintenance.ts`.
 */
type LocaleText = Record<string, string> | null | undefined;
export type WelcomeData = { web?: LocaleText; shared?: LocaleText } | null;

const readWelcome = liveQuery<WelcomeData>(
  '*[_id == "appContent"][0]{ "web": web.welcome, "shared": shared.welcome }',
  "app welcome",
);

/** Resolve the welcome for a locale: the `web` section wins over `shared`; `null`
 *  when neither has a line for that locale. Pure — the unit-tested seam. */
export function pickWelcome(data: WelcomeData, locale: string): string | null {
  return data?.web?.[locale] ?? data?.shared?.[locale] ?? null;
}

export async function getAppWelcome(locale: string): Promise<string | null> {
  return pickWelcome(await readWelcome(), locale);
}
