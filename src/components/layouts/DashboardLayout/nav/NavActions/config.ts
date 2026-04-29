import type { ComponentType } from "react";
import {
  ArrowDown,
  ArrowUp,
  Bell,
  Copy,
  CornerUpLeft,
  CornerUpRight,
  FileText,
  GalleryVerticalEnd,
  LineChart,
  Link,
  Settings2,
  Trash,
  Trash2,
} from "lucide-react";

/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const navActionsKey = "nav-actions" as const;

/**
 * Translation namespace — `useTranslations(navActionsNamespace)` resolves keys from `en.json`.
 */
export const navActionsNamespace = "blocks.nav-actions" as const;

export type NavActionItem = {
  /** Translation key for the action label, relative to the section namespace. */
  labelKey: string;
  icon: ComponentType<{ className?: string }>;
};

/**
 * Default grouped actions (four groups matching the shadcn sample). Icons stay
 * structural in config; visible labels resolve from `en.json`.
 */
export const navActionsGroups: readonly NavActionItem[][] = [
  [
    { labelKey: "items.customizePage", icon: Settings2 },
    { labelKey: "items.turnIntoWiki", icon: FileText },
  ],
  [
    { labelKey: "items.copyLink", icon: Link },
    { labelKey: "items.duplicate", icon: Copy },
    { labelKey: "items.moveTo", icon: CornerUpRight },
    { labelKey: "items.moveToTrash", icon: Trash2 },
  ],
  [
    { labelKey: "items.undo", icon: CornerUpLeft },
    { labelKey: "items.viewAnalytics", icon: LineChart },
    { labelKey: "items.versionHistory", icon: GalleryVerticalEnd },
    { labelKey: "items.showDeletedPages", icon: Trash },
    { labelKey: "items.notifications", icon: Bell },
  ],
  [
    { labelKey: "items.import", icon: ArrowUp },
    { labelKey: "items.export", icon: ArrowDown },
  ],
] as const;
