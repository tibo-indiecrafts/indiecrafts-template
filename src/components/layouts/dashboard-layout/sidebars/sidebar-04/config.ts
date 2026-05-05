import { Archive, Flag } from "lucide-react";
import { IconCarambola, IconHourglassHigh, IconMailbox } from "@tabler/icons-react";
import type { ComponentType } from "react";

/** Block key — kebab-case folder slug. Used to look up translations under `blocks.<key>.*`. */
export const sidebar04Key = "sidebar-04" as const;

/** Translation namespace — `useScopedT(sidebar04Namespace)` resolves keys from `en.json`. */
export const sidebar04Namespace = "blocks.sidebar-04" as const;

type IconComponent = ComponentType<{ className?: string }>;

export type Sidebar04NavItem = {
  id: string;
  icon: IconComponent;
  isActive: boolean;
};

export type Sidebar04Label = { id: string; color: string };
export type Sidebar04Mail = { id: string; email: string };
export type Sidebar04User = { name: string; email: string; avatar: string };

/**
 * Demo data for sidebar-04. The user block (avatar URL, email), nav rail,
 * label colors, and mail-list email addresses would normally come from app
 * state. Replace when wiring real data — labels resolve via `en.json`, but
 * avatar URLs and email addresses are config-only.
 */
export const sidebar04Data: {
  user: Sidebar04User;
  navMain: Sidebar04NavItem[];
  labels: Sidebar04Label[];
  mails: Sidebar04Mail[];
} = {
  user: {
    name: "ephraim",
    email: "ephraim@blocks.so",
    avatar: "/avatar-01.png",
  },
  navMain: [
    { id: "inbox", icon: IconMailbox, isActive: true },
    { id: "starred", icon: IconCarambola, isActive: false },
    { id: "important", icon: Flag, isActive: false },
    { id: "scheduled", icon: IconHourglassHigh, isActive: false },
    { id: "archive", icon: Archive, isActive: false },
  ],
  labels: [
    { id: "personal", color: "bg-green-400 dark:bg-green-300" },
    { id: "work", color: "bg-blue-400 dark:bg-blue-300" },
    { id: "travel", color: "bg-orange-400 dark:bg-orange-300" },
    { id: "receipts", color: "bg-purple-400 dark:bg-purple-300" },
  ],
  mails: [
    { id: "nora", email: "nora@acme.co" },
    { id: "stripe", email: "no-reply@stripe.com" },
    { id: "github", email: "noreply@github.com" },
    { id: "ava", email: "ava.chen@example.com" },
    { id: "figma", email: "updates@figma.com" },
    { id: "linear", email: "bot@linear.app" },
    { id: "airbnb", email: "booking@airbnb.com" },
    { id: "notion", email: "team@notion.so" },
    { id: "gcal", email: "calendar@google.com" },
    { id: "hn", email: "digest@ycombinator.com" },
  ],
};

/** Sample export — entry component holds demo content inline. */
export const sidebar04Sample = {} as const;
