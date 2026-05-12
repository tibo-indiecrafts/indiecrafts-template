import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type ContentBlock = {
  type: "content-15";
  id: string;
  titleKey: MessageKey;
  bodyKeys: ReadonlyArray<MessageKey>;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
};
