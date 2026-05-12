import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Cover } from "./cover";

const meta: Meta<typeof Cover> = {
  title: "UI Effects/Text/Cover",
  component: Cover,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Cover>;

export const Default: Story = {
  render: () => (
    <h1 className="text-foreground text-3xl font-semibold md:text-5xl">
      Build at the speed of <Cover>thought</Cover>
    </h1>
  ),
};

export const MultiWord: Story = {
  render: () => (
    <h1 className="text-foreground text-3xl font-semibold md:text-5xl">
      Ship to <Cover>production today</Cover>
    </h1>
  ),
};

export const Standalone: Story = {
  render: () => <Cover className="text-2xl font-semibold">Hover me</Cover>,
};

export const InProse: Story = {
  render: () => (
    <p className="text-foreground max-w-md text-center text-base leading-relaxed">
      The fastest way to ship a client website is to <Cover>fork this template</Cover> and
      edit `src/config`. Three keystrokes, a few thousand lines of work avoided.
    </p>
  ),
};
