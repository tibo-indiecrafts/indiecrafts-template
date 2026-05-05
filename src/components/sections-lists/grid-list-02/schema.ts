import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/grid-list-02` — 2-up team-member cards with
 * avatar + name + role and a card-spanning link.
 *
 * **Data-driven, intentionally sparse en.json.** Only the section's
 * accessible heading (`title`, sr-only) lives in `en.json`. Member
 * `name`, `email`, `role`, and `imageUrl` are PII / runtime data —
 * they belong on the schema as plain strings, NOT in the translations
 * registry. Real consumers pass their own `people` prop with their
 * own (potentially per-locale) translated strings; the demo data in
 * `gridList02People` stands in until then.
 *
 * Compare with `dialog-08/members` which follows the same pattern.
 */
export type GridListPerson = {
  /** Stable identifier — used for React keys + per-member href slot. */
  id: string;
  name: string;
  email: string;
  role: string;
  imageUrl: string;
  /** Per-card link target. Defaults to "#" when undefined. */
  href?: string;
};

export type GridListBlock = {
  type: "grid-list-02";
  id: string;
  titleKey?: MessageKey;
  /**
   * Member list. Defaults to `gridList02People` (demo data) when
   * undefined. Pass your own array to render real team members.
   */
  people?: GridListPerson[];
};
