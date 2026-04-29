import type { ComponentType } from "react";
import {
  Bell,
  Check,
  Globe,
  Home,
  Keyboard,
  Link as LinkIcon,
  Lock,
  Menu,
  MessageCircle,
  Paintbrush,
  Settings,
  Video,
} from "lucide-react";

/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const settingsDialogKey = "settings-dialog" as const;

/**
 * Translation namespace — `useTranslations(settingsDialogNamespace)` resolves keys from `en.json`.
 */
export const settingsDialogNamespace = "blocks.settings-dialog" as const;

export type SettingsDialogNavItem = {
  /** Stable id used for active-section comparison and keys. */
  id: string;
  /** Translation key for the visible name, relative to the section namespace. */
  nameKey: string;
  icon: ComponentType<{ className?: string }>;
};

export const settingsDialogNav: readonly SettingsDialogNavItem[] = [
  { id: "notifications", nameKey: "nav.notifications", icon: Bell },
  { id: "navigation", nameKey: "nav.navigation", icon: Menu },
  { id: "home", nameKey: "nav.home", icon: Home },
  { id: "appearance", nameKey: "nav.appearance", icon: Paintbrush },
  { id: "messages", nameKey: "nav.messages", icon: MessageCircle },
  { id: "language", nameKey: "nav.language", icon: Globe },
  { id: "accessibility", nameKey: "nav.accessibility", icon: Keyboard },
  { id: "markRead", nameKey: "nav.markRead", icon: Check },
  { id: "audioVideo", nameKey: "nav.audioVideo", icon: Video },
  { id: "connectedAccounts", nameKey: "nav.connectedAccounts", icon: LinkIcon },
  { id: "privacy", nameKey: "nav.privacy", icon: Lock },
  { id: "advanced", nameKey: "nav.advanced", icon: Settings },
] as const;

export const settingsDialogDefaultActiveId = "messages" as const;
