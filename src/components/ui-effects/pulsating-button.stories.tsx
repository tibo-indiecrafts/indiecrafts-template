import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PulsatingButton } from "./pulsating-button";

const meta: Meta<typeof PulsatingButton> = {
  title: "UI Effects/Buttons/PulsatingButton",
  component: PulsatingButton,
  parameters: { layout: "centered" },
  argTypes: {
    duration: { control: "text" },
    distance: { control: "text" },
    pulseColor: { control: "color" },
    variant: { control: "inline-radio", options: ["pulse", "ripple"] },
  },
};
export default meta;

type Story = StoryObj<typeof PulsatingButton>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[200px] items-center justify-center p-12">
    {children}
  </div>
);

export const Default: Story = {
  args: { duration: "1.5s", distance: "8px", variant: "pulse" },
  render: (args) => (
    <Stage>
      <PulsatingButton {...args}>Get started</PulsatingButton>
    </Stage>
  ),
};

export const Ripple: Story = {
  args: { variant: "ripple", duration: "1.5s", distance: "10px" },
  render: (args) => (
    <Stage>
      <PulsatingButton {...args}>Subscribe</PulsatingButton>
    </Stage>
  ),
};

export const CustomColor: Story = {
  args: { pulseColor: "#ec4899", duration: "2s" },
  render: (args) => (
    <Stage>
      <PulsatingButton {...args} className="bg-pink-600 text-white hover:bg-pink-500">
        Try free
      </PulsatingButton>
    </Stage>
  ),
};

export const Slow: Story = {
  args: { duration: "3s", distance: "12px" },
  render: (args) => (
    <Stage>
      <PulsatingButton {...args}>Calm pulse</PulsatingButton>
    </Stage>
  ),
};

export const Larger: Story = {
  render: () => (
    <Stage>
      <PulsatingButton className="px-8 py-3 text-lg">Try the demo</PulsatingButton>
    </Stage>
  ),
};
