import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowUpRight, Plus, UserCircle } from "lucide-react";
import { ActionCard } from "./ActionCard";

const meta: Meta<typeof ActionCard> = {
  title: "UI Molecules/ActionCard",
  component: ActionCard,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ActionCard>;

export const Compact: Story = {
  args: {
    icon: Plus,
    title: "Create document",
    description: "Start a new draft from scratch.",
    href: "#",
    variant: "compact",
    tone: "primary",
  },
};

export const Tile: Story = {
  args: {
    icon: UserCircle,
    title: "Manage team",
    description: "Invite teammates, set roles, and configure permissions.",
    href: "#",
    variant: "tile",
    tone: "blue",
    cornerAccent: <ArrowUpRight className="h-6 w-6" />,
  },
};

export const NoLink: Story = {
  args: {
    icon: Plus,
    title: "Static action",
    description: "Renders without click-through.",
    variant: "compact",
    tone: "muted",
  },
};
