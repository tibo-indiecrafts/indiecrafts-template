import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
} from "@/components/ui-primitives/sidebar";
import { NavWorkspaces } from "./NavWorkspaces";

const meta: Meta<typeof NavWorkspaces> = {
  title: "UI Molecules/Dashboard/NavWorkspaces",
  component: NavWorkspaces,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarContent>
            <Story />
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof NavWorkspaces>;

export const Default: Story = {
  args: {
    workspaces: [
      {
        name: "Personal",
        emoji: "🏠",
        pages: [
          { name: "Daily journal", url: "#", emoji: "📔" },
          { name: "Goals", url: "#", emoji: "🌟" },
        ],
      },
      {
        name: "Work",
        emoji: "💼",
        pages: [
          { name: "Roadmap", url: "#", emoji: "🗺️" },
          { name: "Sprint board", url: "#", emoji: "📊" },
        ],
      },
    ],
  },
};

/** Workspaces with empty `pages` arrays — collapsible has no nested rows. */
export const WithoutPages: Story = {
  args: {
    workspaces: [
      { name: "Personal", emoji: "🏠", pages: [] },
      { name: "Work", emoji: "💼", pages: [] },
    ],
  },
};
