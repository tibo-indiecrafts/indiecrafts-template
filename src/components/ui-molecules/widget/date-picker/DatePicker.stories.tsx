import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui-primitives/sidebar";
import { DatePicker } from "./DatePicker";

const meta: Meta<typeof DatePicker> = {
  title: "UI Molecules/Widget/DatePicker",
  component: DatePicker,
  parameters: { layout: "centered" },
  decorators: [
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

export const Default: Story = {};

export const SingleSelect: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return <DatePicker mode="single" selected={date} onSelect={setDate} />;
  },
};

export const RangeSelect: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>();
    return <DatePicker mode="range" selected={range} onSelect={setRange} />;
  },
};
