import type { MessageKey } from "@/types/messages";

/**
 * Welcome-banner dashboard section — a personalized greeting card that
 * pairs a salutation with a short status line and a row of quick-action
 * chips. Designed as the first card on admin dashboards.
 *
 * Per-chip copy is keyed by `id` against `chips.<id>.label` in en.json.
 * Icons reference `iconKey` enum values resolved via the component's
 * internal lucide-react map.
 */
export type WelcomeBannerIcon =
  | "Sparkles"
  | "BookOpen"
  | "Cog"
  | "LifeBuoy"
  | "Rocket"
  | "Zap";

export type WelcomeBannerChip = {
  /** Stable identifier — keys translation under `chips.<id>.label`. */
  id: string;
  /** Lucide icon name (from the supported subset). */
  iconKey: WelcomeBannerIcon;
  /** Optional href; when set, the chip becomes a link. */
  href?: string;
};

export type WelcomeBannerBlock = {
  type: "welcome-banner-01";
  id: string;
  /** Banner heading override; defaults to `blocks.welcome-banner-01.title`. */
  titleKey?: MessageKey;
  /** Status line under the heading. Optional. */
  descriptionKey?: MessageKey;
  /** Greeting fallback when `userName` is omitted. Defaults to `blocks.welcome-banner-01.greeting`. */
  greetingKey?: MessageKey;
  /** Per-session display name. When omitted, the translated greeting fallback is used. */
  userName?: string;
  /** Chips to render. Defaults to `welcomeBanner01Chips`. */
  chips?: WelcomeBannerChip[];
};
