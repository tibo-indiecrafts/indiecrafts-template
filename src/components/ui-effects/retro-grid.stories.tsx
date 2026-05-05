import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RetroGrid } from "./retro-grid";

const meta: Meta<typeof RetroGrid> = {
  title: "UI Effects/Backgrounds/RetroGrid",
  component: RetroGrid,
  parameters: { layout: "fullscreen" },
  argTypes: {
    angle: { control: { type: "range", min: 1, max: 89, step: 1 } },
    cellSize: { control: { type: "range", min: 20, max: 160, step: 5 } },
    opacity: { control: { type: "range", min: 0.1, max: 1, step: 0.05 } },
    lightLineColor: { control: "color" },
    darkLineColor: { control: "color" },
  },
};
export default meta;

type Story = StoryObj<typeof RetroGrid>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background relative h-[500px] w-full overflow-hidden">
    {children}
  </div>
);

const Title = ({ text }: { text: string }) => (
  <div className="relative z-10 flex h-full items-center justify-center">
    <h1 className="text-foreground text-center text-6xl font-bold">{text}</h1>
  </div>
);

/**
 * Default — WebGL-rendered grid that scrolls toward the horizon at 65°.
 * Falls back to a CSS-only animated grid when WebGL is unavailable.
 */
export const Default: Story = {
  args: { angle: 65, cellSize: 60, opacity: 0.5 },
  render: (args) => (
    <Stage>
      <RetroGrid {...args} />
      <Title text="Indiecrafts" />
    </Stage>
  ),
};

/** Wider cells — `cellSize={100}` makes the grid feel more architectural. */
export const WideCells: Story = {
  args: { angle: 65, cellSize: 100, opacity: 0.5 },
  render: (args) => (
    <Stage>
      <RetroGrid {...args} />
      <Title text="Wider grid" />
    </Stage>
  ),
};

/** Steeper angle — `angle={45}` flattens the perspective. */
export const ShallowAngle: Story = {
  args: { angle: 45, cellSize: 80, opacity: 0.4 },
  render: (args) => (
    <Stage>
      <RetroGrid {...args} />
      <Title text="Flatter horizon" />
    </Stage>
  ),
};

/**
 * Brand colour — both line colours read from the `--color-primary` token
 * (light/dark mirror the same brand surface, so we point both at the var
 * and the existing dark variant kicks in at the token level).
 */
export const BrandColor: Story = {
  args: {
    angle: 65,
    cellSize: 60,
    opacity: 0.6,
    lightLineColor: "var(--color-primary)",
    darkLineColor: "var(--color-primary)",
  },
  render: (args) => (
    <Stage>
      <RetroGrid {...args} />
      <Title text="Brand retro" />
    </Stage>
  ),
};

/** Faded — drop `opacity` to 0.2 for a barely-there texture. */
export const Faded: Story = {
  args: { opacity: 0.2 },
  render: (args) => (
    <Stage>
      <RetroGrid {...args} />
      <Title text="Subtle grid" />
    </Stage>
  ),
};
