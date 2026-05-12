import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `bento-07` — fixed-shape 5-card composition in a
 * 3-col / 2-col layout. The hero card spans 2 cols × 2 rows
 * (`@xl:col-span-2 @2xl:row-span-2`) with a wide map illustration
 * inside; below it sits a sub-row of two narrow side-by-side cards
 * (Documents + Fingerprint). The right column has a Memory card
 * stacked over an AI prompt card.
 *
 * ┌──────────── map (2x2) ────────────┬── memory ──┐
 * │                                   ├── uptime ──┤
 * ├ documents ─┬─ fingerprint ────────┘
 * └────────────┴──────────────────────┘
 *
 * Each card carries a tiny lucide icon above its title. The
 * Documents card animates its DocumentsStackIllustration upward on
 * hover via `*:group-hover:-translate-y-[225%]`.
 */
export type BentoBlock = {
  type: "bento-07";
  id: string;
  mapCell: { titleKey: MessageKey; bodyKey: MessageKey };
  documentsCell: { titleKey: MessageKey; bodyKey: MessageKey };
  fingerprintCell: { titleKey: MessageKey; bodyKey: MessageKey };
  memoryCell: { titleKey: MessageKey; bodyKey: MessageKey };
  uptimeCell: { titleKey: MessageKey; bodyKey: MessageKey };
};
