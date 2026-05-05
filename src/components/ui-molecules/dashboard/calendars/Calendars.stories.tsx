import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
} from "@/components/ui-primitives/sidebar";
import { Calendars } from "./Calendars";

const meta: Meta<typeof Calendars> = {
  title: "UI Molecules/Dashboard/Calendars",
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

/** `defaultOpenIndex={1}` — second group is the one rendered open. */
export const SecondGroupOpen: Story = {
  args: {
    defaultOpenIndex: 1,
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
