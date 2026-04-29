import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui-primitives/sidebar";
import { Calendars } from "./index";

const meta: Meta<typeof Calendars> = {
  title: "Layouts/Dashboard/Widgets/Calendars",
  component: Calendars,
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

type Story = StoryObj<typeof Calendars>;

export const Default: Story = {
  args: {
    calendars: [
      {
        name: "My Calendars",
        items: ["Personal", "Work", "Family"],
        active: ["Personal", "Work"],
      },
      { name: "Favorites", items: ["Holidays", "Birthdays"] },
    ],
  },
};
