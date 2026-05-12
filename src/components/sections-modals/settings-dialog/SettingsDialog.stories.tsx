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

export const Default: Story = {};

export const Closed: Story = {
  args: { defaultOpen: false },
};

export const ActiveAccessibility: Story = {
  args: { activeId: "accessibility" },
};

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
