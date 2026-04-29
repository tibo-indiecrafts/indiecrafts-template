import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarProvider } from "@/components/ui-primitives/sidebar";
import { NavActions } from "./index";

const meta: Meta<typeof NavActions> = {
  title: "Layouts/Dashboard/Nav/NavActions",
  component: NavActions,
  parameters: { layout: "fullscreen" },
  decorators: [
    // The popover content nests a `Sidebar`, which uses `useSidebar()` and
    // therefore needs a `SidebarProvider` on the page.
    (Story) => (
      <SidebarProvider>
        <div className="flex min-h-svh w-full justify-end p-6">
          <Story />
        </div>
      </SidebarProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof NavActions>;

/** Popover closed — the resting state in real use (top-right of a page). */
export const Default: Story = {
  args: { defaultOpen: false },
};

/** Popover open — shows the four action groups inside the popover. */
export const Open: Story = {
  args: { defaultOpen: true },
};
