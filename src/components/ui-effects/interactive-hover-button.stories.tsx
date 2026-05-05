import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InteractiveHoverButton } from "./interactive-hover-button";

const meta: Meta<typeof InteractiveHoverButton> = {
  title: "UI Effects/Buttons/InteractiveHoverButton",
  component: InteractiveHoverButton,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof InteractiveHoverButton>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[160px] items-center justify-center p-10">
    {children}
  </div>
);

/**
 * Default — hover the button to expand the brand-coloured dot into a full
 * fill while the label slides out and an arrow CTA slides in from the right.
 */
export const Default: Story = {
  render: () => (
    <Stage>
      <InteractiveHoverButton>Get started</InteractiveHoverButton>
    </Stage>
  ),
};

/** Long label — proves the hover transition stays smooth with more text. */
export const LongLabel: Story = {
  render: () => (
    <Stage>
      <InteractiveHoverButton>Read the launch announcement</InteractiveHoverButton>
    </Stage>
  ),
};

/** Larger — extra padding + a bigger font via `className`. */
export const Larger: Story = {
  render: () => (
    <Stage>
      <InteractiveHoverButton className="px-10 py-3 text-lg">
        Try the demo
      </InteractiveHoverButton>
    </Stage>
  ),
};

/** Disabled — passes through native `disabled`; hover stops responding. */
export const Disabled: Story = {
  render: () => (
    <Stage>
      <InteractiveHoverButton disabled className="opacity-50">
        Unavailable
      </InteractiveHoverButton>
    </Stage>
  ),
};

/** Side by side — multiple buttons share the page; each hover is independent. */
export const SideBySide: Story = {
  render: () => (
    <Stage>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <InteractiveHoverButton>Sign up</InteractiveHoverButton>
        <InteractiveHoverButton>Pricing</InteractiveHoverButton>
        <InteractiveHoverButton>Docs</InteractiveHoverButton>
      </div>
    </Stage>
  ),
};
