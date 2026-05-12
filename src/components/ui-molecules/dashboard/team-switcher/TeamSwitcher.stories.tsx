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
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
} from "@/components/ui-primitives/sidebar";
import { TeamSwitcher } from "./TeamSwitcher";

const meta: Meta<typeof TeamSwitcher> = {
  title: "UI Molecules/Dashboard/TeamSwitcher",
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

export const SingleTeam: Story = {
  args: {
    teams: [{ name: "Solo Inc", logo: Rocket, plan: "Free" }],
  },
};

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
