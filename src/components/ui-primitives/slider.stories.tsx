import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Slider } from "./slider";

const meta: Meta<typeof Slider> = {
  title: "UI Primitives/Slider",
  component: Slider,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: () => <Slider defaultValue={[33]} max={100} step={1} className="w-[280px]" />,
};

export const StepAndRange: Story = {
  render: () => (
    <Slider defaultValue={[150]} min={0} max={500} step={25} className="w-[280px]" />
  ),
};

export const Range: Story = {
  render: () => (
    <Slider defaultValue={[20, 75]} max={100} step={1} className="w-[280px]" />
  ),
};

export const Disabled: Story = {
  render: () => (
    <Slider defaultValue={[40]} max={100} step={1} disabled className="w-[280px]" />
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="h-48">
      <Slider
        defaultValue={[50]}
        max={100}
        step={1}
        orientation="vertical"
        className="h-full"
      />
    </div>
  ),
};
