import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
} from "@/components/ui-primitives/sidebar";
import { NavFavorites } from "./NavFavorites";

const meta: Meta<typeof NavFavorites> = {
  title: "UI Molecules/Nav/Favorites",
  component: NavFavorites,
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

type Story = StoryObj<typeof NavFavorites>;

export const Default: Story = {
  args: {
    favorites: [
      { name: "Roadmap", url: "#", emoji: "🗺️" },
      { name: "Daily standup notes", url: "#", emoji: "📝" },
      { name: "Onboarding checklist", url: "#", emoji: "✅" },
    ],
  },
};
