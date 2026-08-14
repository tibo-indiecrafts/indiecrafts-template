import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Slider } from "./slider";
import docs from "./slider.md?raw";

const meta = {
  title: "UI/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
  args: { defaultValue: [50], max: 100, step: 1 },
  argTypes: { disabled: { control: "boolean" } },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-64">
      <Slider {...args} />
    </div>
  ),
};

export const Range: Story = {
  args: { defaultValue: [25, 75] },
  render: Default.render,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: Default.render,
};
