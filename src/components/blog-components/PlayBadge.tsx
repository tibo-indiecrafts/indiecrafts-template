import { getTranslations } from "next-intl/server";
import { Play } from "lucide-react";

/**
 * Small "this post is a video" marker overlaid on a cover/thumbnail in the
 * listings, so a featured-video post reads as playable before you open it.
 * Async server component — resolves its own label, so cards don't thread a
 * `videoLabel` prop through every call site. Render conditionally:
 *
 *   {parseVideoEmbed(post.metadata?.videoUrl) ? <PlayBadge /> : null}
 */
export async function PlayBadge({ size = "md" }: { size?: "sm" | "md" }) {
  const t = await getTranslations("pages.blog");
  const box = size === "sm" ? "size-6" : "size-8";
  const icon = size === "sm" ? "size-3" : "size-4";

  return (
    <span className="pointer-events-none absolute bottom-2 left-2 z-10">
      <span
        className={`flex ${box} items-center justify-center rounded-full bg-black/55 text-white ring-1 ring-white/20 backdrop-blur-sm`}
      >
        <Play className={`${icon} translate-x-px fill-current`} aria-hidden="true" />
      </span>
      <span className="sr-only">{t("hasVideo")}</span>
    </span>
  );
}
