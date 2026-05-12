import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CapacityRing } from "./CapacityRing";

const meta: Meta<typeof CapacityRing> = {
  title: "UI Molecules/Widget/CapacityRing",
  component: CapacityRing,
};
export default meta;

type Story = StoryObj<typeof CapacityRing>;

export const Default: Story = {
  args: { value: 75, label: "75%" },
};

export const Empty: Story = {
  args: { value: 0, label: "0%" },
};

export const Full: Story = {
  args: { value: 100, label: "100%" },
};

export const NoLabel: Story = {
  args: { value: 42 },
};
