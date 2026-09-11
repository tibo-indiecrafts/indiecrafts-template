/**
 * Reads the editor-owned home welcome (`appContent` singleton) from Sanity's PUBLIC
 * CDN, resolved to the active locale. **Never-throws** (fail-open like
 * `lib/announcements.ts`): unset project id or any error → `null`, and the home
 * shows its own message-file subtitle. The web app + this screen read the same
 * singleton from the same Sanity project.
 */
import { sanityProjectId, sanityDataset } from "@/config";

const API_VERSION = "2025-01-01";
const QUERY =
  '*[_id == "appContent"][0]{ "mobile": mobile.welcome, "shared": shared.welcome }';

type LocaleText = Record<string, string> | null | undefined;
type WelcomeData = { mobile?: LocaleText; shared?: LocaleText } | null;

/** Resolve the welcome for a locale: the `mobile` section wins over `shared`. */
export function pickWelcome(data: WelcomeData, locale: string): string | null {
  return data?.mobile?.[locale] ?? data?.shared?.[locale] ?? null;
}

export async function getWelcome(locale: string): Promise<string | null> {
  if (!sanityProjectId || !sanityDataset) return null;
  try {
    const url = `https://${sanityProjectId}.apicdn.sanity.io/v${API_VERSION}/data/query/${sanityDataset}?query=${encodeURIComponent(QUERY)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const json = (await res.json()) as { result?: WelcomeData };
    return pickWelcome(json.result ?? null, locale);
  } catch {
    return null;
  }
}
