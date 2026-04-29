import type { MessageKey } from "@/types/messages";

/**
 * Tailark `features-11` — 2×2 bento of product previews + keyboard shortcut
 * visual + brand-logo integration tile. All assets (images + headings) are
 * config-driven; the keyboard-shortcut tile and brand-logo grid stay baked
 * in the component (decorative).
 */
export type Features11Block = {
  type: "features-11";
  id: string;
  trackingTitleKey: MessageKey;
  trackingBodyKey: MessageKey;
  /** Top-left card image (light/dark variants). */
  trackingImageLightUrl: string;
  trackingImageDarkUrl: string;
  trackingImageAltKey: MessageKey;
  uxTitleKey: MessageKey;
  /** Top-right card image (light/dark variants). */
  uxImageLightUrl: string;
  uxImageDarkUrl: string;
  uxImageAltKey: MessageKey;
  shortcutTitleKey: MessageKey;
  integrationsTitleKey: MessageKey;
  integrationsBodyKey: MessageKey;
};
