import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarProvider, SidebarInset } from "@/components/ui-primitives/sidebar";
import { SidebarRight } from "./index";
import { sidebarRightData } from "./config";

const meta: Meta<typeof SidebarRight> = {
  title: "Layouts/Dashboard/Sidebars/SidebarRight",
  component: SidebarRight,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <SidebarInset>
          <div className="p-6 text-sm">Sidebar preview area</div>
        </SidebarInset>
        <Story />
      </SidebarProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SidebarRight>;

/** Full demo — user header, date picker, three calendar groups, "New calendar" footer. */
export const Default: Story = {};

/**
 * Minimal — empty `calendars`. Verifies the date picker + footer button still
 * render when no calendar groups are configured.
 */
export const Minimal: Story = {
  args: {
    data: {
      ...sidebarRightData,
      calendars: [],
    },
  },
};
