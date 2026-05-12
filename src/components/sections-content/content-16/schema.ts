import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `content-5` (named `content-16` locally to continue
 * the zero-padded sequence). Hero-style featured image with a
 * `mask-radial-to-65%` fade, followed by a centered headline and
 * single supporting paragraph. Body supports inline `<strong>`
 * markup via `t.rich(...)`.
 */
export type ContentBlock = {
  type: "content-16";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  image: {
    src: string;
    width: number;
    height: number;
    altKey: MessageKey;
  };
};
