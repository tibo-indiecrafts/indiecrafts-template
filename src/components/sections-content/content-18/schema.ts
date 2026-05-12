import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `content-7` (named `content-18` locally to continue
 * the zero-padded sequence). Headline above a 1/2/3-up grid of
 * "Read more" cards. Each card is a square image + small heading
 * + paragraph + chevron link, aligned to a shared subgrid for
 * vertical rhythm.
 *
 * Per-card `variant` picks the image-card visual: `"padded"` =
 * white-bg with inner padding, image floats; `"filled"` = card-bg
 * with the image filling the rounded frame edge-to-edge.
 *
 * The "Read more" label is shared across all cards via a single
 * `readMoreLabelKey` to avoid translation duplication.
 */
export type ContentCardVariant = "padded" | "filled";

export type ContentCard = {
  variant: ContentCardVariant;
  image: {
    src: string;
    width: number;
    height: number;
    altKey: MessageKey;
  };
  headingKey: MessageKey;
  bodyKey: MessageKey;
  href: StaticAppPathname | `http${string}` | `#${string}`;
};

export type ContentBlock = {
  type: "content-18";
  id: string;
  titleKey: MessageKey;
  readMoreLabelKey: MessageKey;
  cards: ReadonlyArray<ContentCard>;
};
