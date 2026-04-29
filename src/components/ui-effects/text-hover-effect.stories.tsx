import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextHoverEffect } from "./text-hover-effect";

const meta: Meta<typeof TextHoverEffect> = {
  title: "UI Effects/TextHoverEffect",
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

/**
 * Default — large outlined SVG text where a rainbow gradient fills only the
 * area near the cursor. The stroke draws on mount via stroke-dashoffset.
 */
export const Default: Story = {
  args: { text: "INDIECRAFTS" },
  render: (args) => (
    <Stage>
      <TextHoverEffect {...args} />
    </Stage>
  ),
};

/** Short text — single word fits the SVG viewBox better. */
export const ShortWord: Story = {
  args: { text: "BUILD" },
  render: (args) => (
    <Stage>
      <TextHoverEffect {...args} />
    </Stage>
  ),
};

/** Smooth — `duration={0.5}` for a more gradual gradient follow. */
export const SmoothFollow: Story = {
  args: { text: "SHIP", duration: 0.5 },
  render: (args) => (
    <Stage>
      <TextHoverEffect {...args} />
    </Stage>
  ),
};

/** Year — works for any short string, including digits. */
export const Year: Story = {
  args: { text: "2026" },
  render: (args) => (
    <Stage>
      <TextHoverEffect {...args} />
    </Stage>
  ),
};
