import { Play } from "lucide-react";

/**
 * Small "this is a video" marker overlaid on a cover/thumbnail in listings, so
 * a featured-video item reads as playable before you open it. The `label` (the
 * sr-only text) is passed in so the component stays i18n-agnostic — resolve it
 * from the caller's namespace. Render conditionally:
 *
 *   {parseVideoEmbed(item.videoUrl) ? <PlayBadge label={t("hasVideo")} /> : null}
 */
export function PlayBadge({ label, size = "md" }: { label: string; size?: "sm" | "md" }) {
  const box = size === "sm" ? "size-6" : "size-8";
  const icon = size === "sm" ? "size-3" : "size-4";

  return (
    <span className="pointer-events-none absolute bottom-2 left-2 z-10">
      <span
        className={`flex ${box} items-center justify-center rounded-full bg-black/55 text-white ring-1 ring-white/20 backdrop-blur-sm`}
      >
        <Play className={`${icon} translate-x-px fill-current`} aria-hidden="true" />
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
