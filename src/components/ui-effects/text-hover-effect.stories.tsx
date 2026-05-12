import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextHoverEffect } from "./text-hover-effect";

const meta: Meta<typeof TextHoverEffect> = {
  title: "UI Effects/Text/TextHoverEffect",
  component: TextHoverEffect,
  parameters: { layout: "fullscreen" },
  argTypes: {
    text: { control: "text" },
    duration: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
  },
};
export default meta;

type Story = StoryObj<typeof TextHoverEffect>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex h-[460px] w-full items-center justify-center p-4">
    <div className="h-72 w-full max-w-3xl">{children}</div>
  </div>
);

export const Default: Story = {
  args: { text: "INDIECRAFTS" },
  render: (args) => (
    <Stage>
      <TextHoverEffect {...args} />
    </Stage>
  ),
};

export const ShortWord: Story = {
  args: { text: "BUILD" },
  render: (args) => (
    <Stage>
      <TextHoverEffect {...args} />
    </Stage>
  ),
};

export const SmoothFollow: Story = {
  args: { text: "SHIP", duration: 0.5 },
  render: (args) => (
    <Stage>
      <TextHoverEffect {...args} />
    </Stage>
  ),
};

export const Year: Story = {
  args: { text: "2026" },
  render: (args) => (
    <Stage>
      <TextHoverEffect {...args} />
    </Stage>
  ),
};
