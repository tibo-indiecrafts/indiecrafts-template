import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarProvider, SidebarInset } from "@/components/ui-primitives/sidebar";
import { SidebarLeft } from "./index";
import { sidebarLeftData } from "./config";

const meta: Meta<typeof SidebarLeft> = {
  title: "Layouts/Dashboard/Sidebars/SidebarLeft",
  component: SidebarLeft,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
        <SidebarInset>
          <div className="p-6 text-sm">Sidebar preview area</div>
        </SidebarInset>
      </SidebarProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SidebarLeft>;

/** Full demo data — teams, primary nav, favorites, workspaces, secondary nav. */
export const Default: Story = {};

/**
 * Minimal — empty `favorites` and `workspaces`, single team, two nav items.
 * Verifies the sidebar collapses gracefully when those collections are empty.
 */
export const Minimal: Story = {
  args: {
    data: {
      ...sidebarLeftData,
      teams: [sidebarLeftData.teams[0]],
      navMain: sidebarLeftData.navMain.slice(0, 2),
      navSecondary: [],
      favorites: [],
      workspaces: [],
    },
  },
};
