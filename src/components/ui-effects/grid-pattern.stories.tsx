import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GridPattern } from "./grid-pattern";

const meta: Meta<typeof GridPattern> = {
  title: "UI Effects/Backgrounds/GridPattern",
  component: GridPattern,
  parameters: { layout: "fullscreen" },
  argTypes: {
    width: { control: { type: "range", min: 10, max: 120, step: 5 } },
    height: { control: { type: "range", min: 10, max: 120, step: 5 } },
    strokeDasharray: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof GridPattern>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background relative flex min-h-[400px] w-full items-center justify-center overflow-hidden">
    {children}
  </div>
);

/**
 * Default — 40×40 cell SVG grid that fills its `relative` parent. The
 * component is `pointer-events-none absolute inset-0`, so it sits behind
 * the foreground content.
 */
export const Default: Story = {
  args: { width: 40, height: 40 },
  render: (args) => (
    <Stage>
      <GridPattern {...args} />
      <div className="relative px-6 text-center">
        <h2 className="text-foreground text-3xl font-semibold">Grid pattern</h2>
        <p className="text-muted-foreground mt-2 max-w-md text-sm">
          A subtle SVG grid for hero backgrounds and feature sections.
        </p>
      </div>
    </Stage>
  ),
};

/** Dense — 20px cells make a tight technical look. */
export const Dense: Story = {
  args: { width: 20, height: 20 },
  render: (args) => (
    <Stage>
      <GridPattern {...args} />
      <h3 className="text-foreground relative text-2xl font-semibold">Dense 20px grid</h3>
    </Stage>
  ),
};

/** Loose — 80px cells feel more like an architectural layout. */
export const Loose: Story = {
  args: { width: 80, height: 80 },
  render: (args) => (
    <Stage>
      <GridPattern {...args} />
      <h3 className="text-foreground relative text-2xl font-semibold">Loose 80px grid</h3>
    </Stage>
  ),
};

/** Dashed — `strokeDasharray="4 2"` swaps solid lines for dashed strokes. */
export const Dashed: Story = {
  args: { width: 40, height: 40, strokeDasharray: "4 2" },
  render: (args) => (
    <Stage>
      <GridPattern {...args} />
      <h3 className="text-foreground relative text-2xl font-semibold">Dashed strokes</h3>
    </Stage>
  ),
};

/**
 * Highlighted squares — pass an array of `[x, y]` cell coordinates via
 * `squares` to fill specific cells. Useful for product walkthroughs where you
 * want to draw the eye to a particular location on the grid.
 */
export const HighlightedSquares: Story = {
  args: {
    width: 40,
    height: 40,
    squares: [
      [4, 1],
      [6, 2],
      [10, 3],
      [12, 5],
      [3, 6],
      [9, 7],
      [15, 1],
      [18, 4],
    ],
    className: "fill-primary/30 stroke-foreground/20",
  },
  render: (args) => (
    <Stage>
      <GridPattern {...args} />
      <div className="relative px-6 text-center">
        <h2 className="text-foreground text-3xl font-semibold">Highlighted cells</h2>
        <p className="text-muted-foreground mt-2 max-w-md text-sm">
          Pass an array of <code>[x, y]</code> tuples in <code>squares</code> to spotlight
          specific cells.
        </p>
      </div>
    </Stage>
  ),
};
