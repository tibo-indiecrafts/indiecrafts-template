import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/grid-list-01` — favorite book-collections grid:
 * 3-up cards with a colored initials badge + title + count + actions
 * dropdown. Per-item copy resolves via `t(\`items.${id}.name\`)`.
 */
export type GridListItem = {
  /** Stable identifier — also the namespace key for translations. */
  id: string;
  /** External link target. */
  href: string;
  /** Numeric count rendered next to the suffix. */
  books: number;
};

export type GridListBlock = {
  type: "grid-list-01";
  id: string;
  titleKey?: MessageKey;
  items?: GridListItem[];
};
