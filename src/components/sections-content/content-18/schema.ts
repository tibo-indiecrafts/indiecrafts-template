import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

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
