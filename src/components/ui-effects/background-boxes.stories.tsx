import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Boxes } from "./background-boxes";

const meta: Meta<typeof Boxes> = {
  title: "UI Effects/Backgrounds/BackgroundBoxes",
  component: Boxes,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Boxes>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-900">
    <div className="pointer-events-none absolute inset-0 z-20 h-full w-full bg-slate-900 [mask-image:radial-gradient(transparent,white)]" />
    {children}
  </div>
);

/**
 * Default — boxes fill the stage; a radial mask + slate background fade the
 * edges so the boxes look like a hover-reactive hero backdrop.
 */
export const Default: Story = {
  render: () => (
    <Stage>
      <Boxes />
      <h1 className="relative z-30 text-4xl font-semibold text-white md:text-7xl">
        Boxes
      </h1>
      <p className="text-muted-foreground relative z-30 mt-3 max-w-md text-center text-sm">
        Hover anywhere to colour the underlying grid cells.
      </p>
    </Stage>
  ),
};

/**
 * Empty stage — no foreground. Verifies the box grid stretches edge-to-edge
 * and reacts cleanly to hover without surrounding chrome.
 *
 * Note: the boxes component uses heavy skew + scale transforms that extend
 * beyond its parent. It only reads correctly in full-viewport heroes —
 * smaller card-sized containers don't expose enough of the diagonal grid.
 */
export const EmptyStage: Story = {
  render: () => (
    <Stage>
      <Boxes />
    </Stage>
  ),
};
