import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `content-4` (named `content-15` locally to continue
 * the zero-padded sequence). Two-column intro section: a large
 * muted heading on the left (with inline `<strong>` accent), two
 * paragraphs + outline CTA on the right. Both heading and the
 * second paragraph support rich markup via `t.rich(...)`.
 */
export type ContentBlock = {
  type: "content-15";
  id: string;
  titleKey: MessageKey;
  bodyKeys: ReadonlyArray<MessageKey>;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
};
