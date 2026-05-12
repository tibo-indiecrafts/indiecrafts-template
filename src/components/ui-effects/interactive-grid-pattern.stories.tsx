import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InteractiveGridPattern } from "./interactive-grid-pattern";

const meta: Meta<typeof InteractiveGridPattern> = {
  title: "UI Effects/Backgrounds/InteractiveGridPattern",
  component: InteractiveGridPattern,
  parameters: { layout: "fullscreen" },
  argTypes: {
    width: { control: { type: "range", min: 20, max: 120, step: 5 } },
    height: { control: { type: "range", min: 20, max: 120, step: 5 } },
  },
};
export default meta;

type Story = StoryObj<typeof InteractiveGridPattern>;

const Stage = ({
  cellWidth,
  cellHeight,
  cols,
  rows,
  children,
}: {
  cellWidth: number;
  cellHeight: number;
  cols: number;
  rows: number;
  children: React.ReactNode;
}) => (
  <div className="bg-background flex min-h-[480px] w-full items-center justify-center p-6">
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        width: cellWidth * cols,
        height: cellHeight * rows,
      }}
    >
      {children}
    </div>
  </div>
);

export const Default: Story = {
  args: { width: 40, height: 40, squares: [24, 12] },
  render: (args) => (
    <Stage
      cellWidth={args.width!}
      cellHeight={args.height!}
      cols={args.squares![0]}
      rows={args.squares![1]}
    >
      <InteractiveGridPattern {...args} />
      <div className="relative px-6 text-center">
        <h2 className="text-foreground text-3xl font-semibold">Hover the grid</h2>
        <p className="text-muted-foreground mt-2 max-w-md text-sm">
          Each cell highlights independently as the cursor enters and fades back when it
          leaves.
        </p>
      </div>
    </Stage>
  ),
};

export const Dense: Story = {
  args: { width: 20, height: 20, squares: [60, 16] },
  render: (args) => (
    <Stage
      cellWidth={args.width!}
      cellHeight={args.height!}
      cols={args.squares![0]}
      rows={args.squares![1]}
    >
      <InteractiveGridPattern {...args} />
      <h3 className="text-foreground relative text-2xl font-semibold">
        Dense 20px cells
      </h3>
    </Stage>
  ),
};

export const Loose: Story = {
  args: { width: 80, height: 80, squares: [12, 6] },
  render: (args) => (
    <Stage
      cellWidth={args.width!}
      cellHeight={args.height!}
      cols={args.squares![0]}
      rows={args.squares![1]}
    >
      <InteractiveGridPattern {...args} />
      <h3 className="text-foreground relative text-2xl font-semibold">
        Loose 80px cells
      </h3>
    </Stage>
  ),
};

export const Branded: Story = {
  args: {
    width: 40,
    height: 40,
    squares: [24, 12],
    squaresClassName: "stroke-primary/30 hover:fill-primary/40 [&:hover]:fill-primary/40",
  },
  render: (args) => (
    <Stage
      cellWidth={args.width!}
      cellHeight={args.height!}
      cols={args.squares![0]}
      rows={args.squares![1]}
    >
      <InteractiveGridPattern {...args} />
      <h3 className="text-foreground relative text-2xl font-semibold">
        Brand-tinted hover
      </h3>
    </Stage>
  ),
};

export const WideAspect: Story = {
  args: { width: 24, height: 24, squares: [60, 8] },
  render: (args) => (
    <Stage
      cellWidth={args.width!}
      cellHeight={args.height!}
      cols={args.squares![0]}
      rows={args.squares![1]}
    >
      <InteractiveGridPattern {...args} />
      <h3 className="text-foreground relative text-xl font-semibold">Banner aspect</h3>
    </Stage>
  ),
};
