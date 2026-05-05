import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./stateful-button";

const meta: Meta<typeof Button> = {
  title: "UI Effects/Buttons/StatefulButton",
  component: Button,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Button>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[200px] items-center justify-center p-12">
    {children}
  </div>
);

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Default — clicking shows a spinner; on `onClick` resolution the spinner
 * morphs into a check mark for 2s, then collapses back. The transition uses
 * motion&apos;s `useAnimate` to chain the loader → check sequence.
 */
export const Default: Story = {
  render: () => (
    <Stage>
      <Button onClick={() => sleep(1500)}>Save changes</Button>
    </Stage>
  ),
};

/** Slow handler — 3-second async work; spinner stays visible while pending. */
export const SlowHandler: Story = {
  render: () => (
    <Stage>
      <Button onClick={() => sleep(3000)}>Process payment</Button>
    </Stage>
  ),
};

/** Wider — Tailwind utilities for a hero-scale CTA. */
export const Wider: Story = {
  render: () => (
    <Stage>
      <Button onClick={() => sleep(1200)} className="min-w-[200px] px-8 py-3">
        Submit application
      </Button>
    </Stage>
  ),
};

/** Brand colour — `className` overrides the default green. */
export const BrandColor: Story = {
  render: () => (
    <Stage>
      <Button
        onClick={() => sleep(1500)}
        className="bg-primary hover:ring-primary text-primary-foreground"
      >
        Get started
      </Button>
    </Stage>
  ),
};
