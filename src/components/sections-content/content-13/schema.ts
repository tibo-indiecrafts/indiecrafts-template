import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `content-2` (named `content-13` locally to continue
 * the zero-padded sequence). Long-form essay block with a stylized
 * cursive signature glyph and an author byline (avatar + name +
 * role) — non-collapsible counterpart to `content-12`.
 *
 * `paragraphKeys` is open-ended; each MessageKey supports inline
 * `<strong>` markup via `t.rich(...)`. Author avatar is decoupled
 * from i18n (URL only); name + role are translatable.
 */
export type ContentBlock = {
  type: "content-13";
  id: string;
  paragraphKeys: ReadonlyArray<MessageKey>;
  author: {
    avatarUrl: string;
    nameKey: MessageKey;
    roleKey: MessageKey;
  };
};
