import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bell, Lock, Settings, Shield, User } from "lucide-react";
import { SettingsDialog } from "./index";
import type { SettingsDialogNavItem } from "./config";

const meta: Meta<typeof SettingsDialog> = {
  title: "Sections/Settings/SettingsDialog",
  component: SettingsDialog,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof SettingsDialog>;

/** Dialog opens on mount — full 12-item nav, default `messages` section active. */
export const Default: Story = {};

/** Dialog rendered closed — only the trigger button is visible. */
export const Closed: Story = {
  args: { defaultOpen: false },
};

/** A different sidebar entry highlighted to show the `isActive` state. */
export const ActiveAccessibility: Story = {
  args: { activeId: "accessibility" },
};

/**
 * Slimmed-down nav passed via the `nav` override — proves the prop replaces
 * the default 12-item list and that translation keys still resolve. The keys
 * referenced here are not in the bundled `en.json`; next-intl will emit a
 * runtime warning and fall back to the key string, which is acceptable for a
 * documentation-only story.
 */
export const CustomNav: Story = {
  args: {
    nav: [
      { id: "profile", nameKey: "nav.profile", icon: User },
      { id: "notifications", nameKey: "nav.notifications", icon: Bell },
      { id: "privacy", nameKey: "nav.privacy", icon: Lock },
      { id: "security", nameKey: "nav.security", icon: Shield },
      { id: "advanced", nameKey: "nav.advanced", icon: Settings },
    ] satisfies SettingsDialogNavItem[],
    activeId: "privacy",
  },
};
