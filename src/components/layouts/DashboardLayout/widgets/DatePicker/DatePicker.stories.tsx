import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Sidebar, SidebarContent, SidebarProvider } from "@/components/ui-primitives/sidebar";
import { DatePicker } from "./index";

const meta: Meta<typeof DatePicker> = {
  title: "Layouts/Dashboard/Widgets/DatePicker",
  component: DatePicker,
  parameters: { layout: "centered" },
  decorators: [
    // The DatePicker is built for sidebar use — the calendar grid `w-full`s
    // to its container. Wrap in a fixed-width sidebar so cells render at
    // the same size they will in the real SidebarRight.
    (Story) => (
      <SidebarProvider>
        <Sidebar collapsible="none" className="w-(--sidebar-width)">
          <SidebarContent>
            <Story />
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof DatePicker>;

/** Stateless — today is highlighted, no day is selectable. */
export const Default: Story = {};

/** Single-date picking — caller drives `selected` + `onSelect`. */
export const SingleSelect: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return <DatePicker mode="single" selected={date} onSelect={setDate} />;
  },
};

/** Range picking — same primitive, different `mode`. */
export const RangeSelect: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>();
    return <DatePicker mode="range" selected={range} onSelect={setRange} />;
  },
};
