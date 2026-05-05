import {
  IconArrowRight,
  IconAt,
  IconCopy,
  IconDeviceDesktop,
  IconDownload,
  IconFile,
  IconFileSearch,
  IconKeyboard,
  IconLink,
  IconLogout,
  IconMessage,
  IconPencil,
  IconPlus,
  IconSend,
  IconSettings,
  IconTemplate,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import type { CommandMenuBlock, CommandMenuItem } from "./schema";

export const commandMenu02Key = "command-menu-02" as const;
export const commandMenu02Namespace = "blocks.command-menu-02" as const;

export type CommandMenuGroup = {
  /** Stable identifier for the group's translation key. */
  id: string;
  /** When false, the group has no visible heading. */
  hasHeading: boolean;
  items: readonly CommandMenuItem[];
};

export const commandMenu02Groups: readonly CommandMenuGroup[] = [
  {
    id: "account",
    hasHeading: false,
    items: [
      { id: "account-settings", icon: IconSettings, shortcut: ["⌘", ","] },
      { id: "switch-workspace", icon: IconUser },
      { id: "log-out", icon: IconLogout, shortcut: ["⌘", "Q"] },
    ],
  },
  {
    id: "documents",
    hasHeading: true,
    items: [
      { id: "search-documents", icon: IconFile, shortcut: ["⌘", "F"] },
      { id: "create-new-document", icon: IconPlus, shortcut: ["⌘", "N"] },
      { id: "upload-document", icon: IconFile, shortcut: ["⌘", "U"] },
    ],
  },
  {
    id: "signing",
    hasHeading: true,
    items: [
      { id: "request-signature", icon: IconSend },
      { id: "sign-document", icon: IconPencil },
      { id: "bulk-send", icon: IconUsers },
    ],
  },
  {
    id: "templates",
    hasHeading: true,
    items: [
      { id: "search-templates", icon: IconTemplate },
      { id: "create-new-template", icon: IconPlus },
    ],
  },
  {
    id: "general",
    hasHeading: true,
    items: [
      { id: "change-theme", icon: IconDeviceDesktop, shortcut: ["⌘", "T"] },
      { id: "copy-current-url", icon: IconCopy, shortcut: ["⌘", "⇧", "C"] },
    ],
  },
  {
    id: "navigation",
    hasHeading: true,
    items: [
      { id: "go-inbox", icon: IconArrowRight },
      { id: "go-action-required", icon: IconArrowRight },
      { id: "go-waiting-for-others", icon: IconArrowRight },
      { id: "go-completed", icon: IconArrowRight },
      { id: "go-drafts", icon: IconArrowRight },
      { id: "go-templates", icon: IconArrowRight },
      { id: "go-archive", icon: IconArrowRight },
      { id: "go-trash", icon: IconArrowRight },
      { id: "go-settings", icon: IconArrowRight },
    ],
  },
  {
    id: "quick-actions",
    hasHeading: true,
    items: [
      { id: "copy-signing-link", icon: IconLink },
      { id: "download-document", icon: IconDownload },
    ],
  },
  {
    id: "help",
    hasHeading: true,
    items: [
      { id: "search-help-center", icon: IconFileSearch },
      { id: "send-feedback", icon: IconMessage },
      { id: "contact-support", icon: IconAt },
    ],
  },
  {
    id: "keyboard-shortcuts",
    hasHeading: true,
    items: [{ id: "view-keyboard-shortcuts", icon: IconKeyboard, shortcut: ["⌘", "/"] }],
  },
];

export const commandMenu02Sample: Omit<CommandMenuBlock, "id"> = {
  type: "command-menu-02",
  defaultOpen: true,
};
