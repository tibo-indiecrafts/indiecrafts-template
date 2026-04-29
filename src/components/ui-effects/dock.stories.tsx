import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Calendar,
  Camera,
  Cloud,
  Compass,
  Globe,
  Home,
  Mail,
  Music,
  Settings,
  Sparkles,
} from "lucide-react";
import { Dock, DockIcon } from "./dock";

const meta: Meta<typeof Dock> = {
  title: "UI Effects/Dock",
  component: Dock,
  parameters: { layout: "centered" },
  argTypes: {
    iconSize: { control: { type: "range", min: 24, max: 80, step: 2 } },
    iconMagnification: { control: { type: "range", min: 40, max: 120, step: 2 } },
    iconDistance: { control: { type: "range", min: 50, max: 300, step: 10 } },
    direction: { control: "select", options: ["top", "middle", "bottom"] },
    disableMagnification: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Dock>;

const ICONS = [
  { Icon: Home, label: "Home" },
  { Icon: Globe, label: "Browser" },
  { Icon: Mail, label: "Mail" },
  { Icon: Calendar, label: "Calendar" },
  { Icon: Camera, label: "Camera" },
  { Icon: Music, label: "Music" },
  { Icon: Cloud, label: "Cloud" },
  { Icon: Compass, label: "Maps" },
  { Icon: Sparkles, label: "Effects" },
  { Icon: Settings, label: "Settings" },
];

/** Default — macOS-style dock with magnification on hover. */
export const Default: Story = {
  render: () => (
    <Dock>
      {ICONS.map(({ Icon, label }) => (
        <DockIcon key={label} aria-label={label}>
          <Icon className="size-full" />
        </DockIcon>
      ))}
    </Dock>
  ),
};

/** Larger icons + bigger hover magnification. */
export const Large: Story = {
  render: () => (
    <Dock iconSize={56} iconMagnification={88} iconDistance={160}>
      {ICONS.slice(0, 6).map(({ Icon, label }) => (
        <DockIcon key={label} aria-label={label}>
          <Icon className="size-full" />
        </DockIcon>
      ))}
    </Dock>
  ),
};

/** Magnification disabled — flat dock; useful for accessibility / RM. */
export const NoMagnification: Story = {
  render: () => (
    <Dock disableMagnification>
      {ICONS.slice(0, 6).map(({ Icon, label }) => (
        <DockIcon key={label} aria-label={label}>
          <Icon className="size-full" />
        </DockIcon>
      ))}
    </Dock>
  ),
};

/** Top alignment — icons anchor to the top of the dock instead of middle. */
export const TopAligned: Story = {
  render: () => (
    <Dock direction="top">
      {ICONS.slice(0, 6).map(({ Icon, label }) => (
        <DockIcon key={label} aria-label={label}>
          <Icon className="size-full" />
        </DockIcon>
      ))}
    </Dock>
  ),
};

/** Single icon — proves the magnification effect still works alone. */
export const SingleIcon: Story = {
  render: () => (
    <Dock>
      <DockIcon aria-label="Home">
        <Home className="size-full" />
      </DockIcon>
    </Dock>
  ),
};
