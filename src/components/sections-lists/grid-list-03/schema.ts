import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/grid-list-03` — quick-actions tile grid:
 * 3-up cards (6-up on mobile collapse) each with a colored icon + title
 * + description + arrow. Icons are string-keyed against an internal
 * lookup; per-tile copy resolves via `t(\`items.${id}.title\`)` etc.
 */
export type GridListIconName =
  | "ArrowRight"
  | "UserCircle"
  | "Server"
  | "CheckCircle"
  | "ContactRound"
  | "Hand";

export type GridListTone = "green" | "red" | "blue" | "sky" | "pink" | "orange";

export type GridListItem = {
  /** Stable identifier — keys translations under `items.${id}.*`. */
  id: string;
  icon: GridListIconName;
  tone: GridListTone;
  /** Internal/external link target. */
  href: string;
};

export type GridListBlock = {
  type: "grid-list-03";
  id: string;
  titleKey?: MessageKey;
  items?: GridListItem[];
};
