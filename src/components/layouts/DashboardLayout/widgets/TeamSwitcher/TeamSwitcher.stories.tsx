import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  AudioWaveform,
  Building2,
  Command,
  Flame,
  GalleryVerticalEnd,
  Rocket,
  Sprout,
} from "lucide-react";
import { SidebarProvider, Sidebar, SidebarHeader } from "@/components/ui-primitives/sidebar";
import { TeamSwitcher } from "./index";

const meta: Meta<typeof TeamSwitcher> = {
  title: "Layouts/Dashboard/Widgets/TeamSwitcher",
  component: TeamSwitcher,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarHeader>
            <Story />
          </SidebarHeader>
        </Sidebar>
      </SidebarProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TeamSwitcher>;

export const Default: Story = {
  args: {
    teams: [
      { name: "Acme Inc", logo: Command, plan: "Enterprise" },
      { name: "Acme Corp.", logo: AudioWaveform, plan: "Startup" },
      { name: "Evil Corp.", logo: GalleryVerticalEnd, plan: "Free" },
    ],
  },
};

/** Single team — dropdown still renders, "Add team" remains the only alt action. */
export const SingleTeam: Story = {
  args: {
    teams: [{ name: "Solo Inc", logo: Rocket, plan: "Free" }],
  },
};

/** Six teams — exercises the dropdown's vertical list and shortcut numbering. */
export const ManyTeams: Story = {
  args: {
    teams: [
      { name: "Acme Inc", logo: Command, plan: "Enterprise" },
      { name: "Acme Corp.", logo: AudioWaveform, plan: "Startup" },
      { name: "Evil Corp.", logo: GalleryVerticalEnd, plan: "Free" },
      { name: "Phoenix Labs", logo: Flame, plan: "Pro" },
      { name: "Cedar Studio", logo: Sprout, plan: "Team" },
      { name: "Fortress Group", logo: Building2, plan: "Enterprise" },
    ],
  },
};
