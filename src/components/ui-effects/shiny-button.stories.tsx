/* eslint-disable @typescript-eslint/ban-ts-comment -- ts-nocheck below */
// @ts-nocheck -- Aceternity / MagicUI upstream; type quirks (React 19 ref-null types, missing JSX namespace, etc.) accepted as-is.
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ShinyButton } from "./shiny-button";

const meta: Meta<typeof ShinyButton> = {
  title: "UI Effects/Buttons/ShinyButton",
  component: ShinyButton,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ShinyButton>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[200px] items-center justify-center p-12">
    {children}
  </div>
);

/**
 * Default — soft border-pulse with a brand-coloured shine sliding across the
 * label every 1s. Spring-based scale on tap (0.95).
 */
export const Default: Story = {
  render: () => (
    <Stage>
      <ShinyButton>Get started</ShinyButton>
    </Stage>
  ),
};

/** Larger — hero-scale CTA via Tailwind utilities. */
export const Larger: Story = {
  render: () => (
    <Stage>
      <ShinyButton className="px-10 py-3 text-lg uppercase">Try the demo</ShinyButton>
    </Stage>
  ),
};

/** Disabled — passes native `disabled` through; the spring still animates. */
export const Disabled: Story = {
  render: () => (
    <Stage>
      <ShinyButton disabled className="opacity-50">
        Unavailable
      </ShinyButton>
    </Stage>
  ),
};

/** Side by side — two buttons each animating independently. */
export const SideBySide: Story = {
  render: () => (
    <Stage>
      <div className="flex gap-3">
        <ShinyButton>Sign up</ShinyButton>
        <ShinyButton>Pricing</ShinyButton>
        <ShinyButton>Docs</ShinyButton>
      </div>
    </Stage>
  ),
};
