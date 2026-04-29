import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarProvider, SidebarInset } from "@/components/ui-primitives/sidebar";
import { AppSidebar } from "./index";
import { appSidebarData } from "./config";

const meta: Meta<typeof AppSidebar> = {
  title: "Layouts/Dashboard/Sidebars/AppSidebar",
  component: AppSidebar,
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

type Story = StoryObj<typeof AppSidebar>;

/** Full demo data — main nav, secondary nav, documents section, user footer. */
export const Default: Story = {};

/**
 * Minimal — empty `documents` and a trimmed `navMain`/`navSecondary`. Verifies
 * the sidebar renders without dividers/headers when collections are empty.
 */
export const Minimal: Story = {
  args: {
    data: {
      ...appSidebarData,
      navMain: [appSidebarData.navMain[0]],
      navSecondary: [],
      documents: [],
    },
  },
};
