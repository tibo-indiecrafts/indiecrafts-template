import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar } from "./calendar";
import docs from "./calendar.md?raw";

const meta = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Calendar mode="single" className="rounded-md border" />,
};

export const Range: Story = {
  render: () => <Calendar mode="range" numberOfMonths={2} className="rounded-md border" />,
};
