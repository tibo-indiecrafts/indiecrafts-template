import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar } from "./calendar";

const meta: Meta<typeof Calendar> = {
  title: "UI Primitives/Calendar",
  component: Calendar,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: () => <Calendar mode="single" defaultMonth={new Date(2026, 3, 1)} />,
};

export const Multiple: Story = {
  render: () => (
    <Calendar
      mode="multiple"
      defaultMonth={new Date(2026, 3, 1)}
      selected={[new Date(2026, 3, 4), new Date(2026, 3, 8), new Date(2026, 3, 12)]}
    />
  ),
};

export const Range: Story = {
  render: () => (
    <Calendar
      mode="range"
      defaultMonth={new Date(2026, 3, 1)}
      selected={{ from: new Date(2026, 3, 6), to: new Date(2026, 3, 14) }}
    />
  ),
};

export const DropdownCaption: Story = {
  render: () => (
    <Calendar
      mode="single"
      captionLayout="dropdown"
      defaultMonth={new Date(2026, 3, 1)}
      fromYear={2020}
      toYear={2030}
    />
  ),
};

export const NumberOfMonths: Story = {
  render: () => (
    <Calendar mode="range" numberOfMonths={2} defaultMonth={new Date(2026, 3, 1)} />
  ),
};
