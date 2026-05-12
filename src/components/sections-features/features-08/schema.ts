import type { MessageKey } from "@/types/messages";

export type FeaturesBlock = {
  type: "features-08";
  id: string;
  /** Top-left stat card ("100% Customizable"). */
  customizableKey?: MessageKey;
  /** Secure-by-default card heading + body. */
  secureTitleKey?: MessageKey;
  secureBodyKey?: MessageKey;
  /** Faster-than-light card heading + body. */
  fastTitleKey?: MessageKey;
  fastBodyKey?: MessageKey;
  /** Larger bottom-left card heading + body (with chart visual). */
  chartTitleKey?: MessageKey;
  chartBodyKey?: MessageKey;
  /** Larger bottom-right card heading + body (with avatar stack). */
  safetyTitleKey?: MessageKey;
  safetyBodyKey?: MessageKey;
  /**
   * Three avatars rendered in the safety card. Each entry: `{ src, name }`.
   * `name` is the short label shown next to the avatar; `src` is an absolute
   * URL or `/public` path.
   */
  safetyAvatars: readonly [
    { src: string; name: MessageKey },
    { src: string; name: MessageKey },
    { src: string; name: MessageKey },
  ];
};
