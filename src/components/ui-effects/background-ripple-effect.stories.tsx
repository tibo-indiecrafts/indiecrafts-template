import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BackgroundRippleEffect } from "./background-ripple-effect";

const meta: Meta<typeof BackgroundRippleEffect> = {
  title: "UI Effects/Backgrounds/BackgroundRippleEffect",
  component: BackgroundRippleEffect,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof BackgroundRippleEffect>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background relative flex min-h-svh items-center justify-center overflow-hidden">
    {children}
  </div>
);

/**
 * Default — 8 rows × 27 cols at 56px cell size. Click any cell to send a
 * ripple through the grid. The text overlay is `pointer-events-none` so
 * clicks pass through to the cells below.
 */
export const Default: Story = {
  render: () => (
    <Stage>
      <BackgroundRippleEffect />
      <div className="pointer-events-none relative z-10 px-6 text-center">
        <h2 className="text-4xl font-semibold">Click anywhere</h2>
        <p className="text-muted-foreground mt-2 max-w-md text-sm">
          Each click triggers a ripple that propagates through the grid before settling
          back to the resting fill colour.
        </p>
      </div>
    </Stage>
  ),
};

/** Smaller cells — denser grid (`cellSize={32}`). */
export const SmallCells: Story = {
  render: () => (
    <Stage>
      <BackgroundRippleEffect rows={14} cols={48} cellSize={32} />
      <div className="pointer-events-none relative z-10 px-6 text-center">
        <h3 className="text-3xl font-semibold">32px cells</h3>
      </div>
    </Stage>
  ),
};

/** Larger cells — looser grid (`cellSize={96}`). */
export const LargeCells: Story = {
  render: () => (
    <Stage>
      <BackgroundRippleEffect rows={5} cols={16} cellSize={96} />
      <div className="pointer-events-none relative z-10 px-6 text-center">
        <h3 className="text-3xl font-semibold">96px cells</h3>
      </div>
    </Stage>
  ),
};

/** Empty stage — no foreground. Pure ripple backdrop demo. */
export const EmptyStage: Story = {
  render: () => (
    <Stage>
      <BackgroundRippleEffect />
    </Stage>
  ),
};
