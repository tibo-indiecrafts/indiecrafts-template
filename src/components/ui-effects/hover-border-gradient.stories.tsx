/* eslint-disable @typescript-eslint/ban-ts-comment -- ts-nocheck below */
// @ts-nocheck -- Aceternity / MagicUI upstream; type quirks (React 19 ref-null types, missing JSX namespace, etc.) accepted as-is.
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowRight, Sparkles } from "lucide-react";
import { HoverBorderGradient } from "./hover-border-gradient";

const meta: Meta<typeof HoverBorderGradient> = {
  title: "UI Effects/Hover & Interactions/HoverBorderGradient",
  component: HoverBorderGradient,
  parameters: { layout: "centered" },
  argTypes: {
    duration: { control: { type: "range", min: 0.25, max: 4, step: 0.25 } },
    clockwise: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof HoverBorderGradient>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-[200px] items-center justify-center bg-neutral-950 p-10">
    {children}
  </div>
);

export const Default: Story = {
  args: { duration: 1, clockwise: true },
  render: (args) => (
    <Stage>
      <HoverBorderGradient {...args}>Get started</HoverBorderGradient>
    </Stage>
  ),
};

export const CounterClockwise: Story = {
  args: { duration: 1, clockwise: false },
  render: (args) => (
    <Stage>
      <HoverBorderGradient {...args}>Counter-clockwise</HoverBorderGradient>
    </Stage>
  ),
};

export const Slow: Story = {
  args: { duration: 3, clockwise: true },
  render: (args) => (
    <Stage>
      <HoverBorderGradient {...args}>Slow rotation</HoverBorderGradient>
    </Stage>
  ),
};

export const AsLink: Story = {
  args: { duration: 1 },
  render: (args) => (
    <Stage>
      <HoverBorderGradient {...args} as="a" href="#hello">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4" aria-hidden /> Read the launch post
        </span>
      </HoverBorderGradient>
    </Stage>
  ),
};

export const RichContent: Story = {
  args: { duration: 1.5 },
  render: (args) => (
    <Stage>
      <HoverBorderGradient {...args}>
        <span className="inline-flex items-center gap-3">
          <span>
            <span className="block text-xs font-normal text-white/60">Indiecrafts</span>
            <span className="block text-base font-semibold">Try the template</span>
          </span>
          <ArrowRight className="h-4 w-4" aria-hidden />
        </span>
      </HoverBorderGradient>
    </Stage>
  ),
};
