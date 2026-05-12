import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FlickeringGrid } from "./flickering-grid";

const meta: Meta<typeof FlickeringGrid> = {
  title: "UI Effects/Backgrounds/FlickeringGrid",
  component: FlickeringGrid,
  parameters: { layout: "fullscreen" },
  argTypes: {
    squareSize: { control: { type: "range", min: 1, max: 24, step: 1 } },
    gridGap: { control: { type: "range", min: 0, max: 20, step: 1 } },
    flickerChance: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    maxOpacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    color: { control: "color" },
  },
};
export default meta;

type Story = StoryObj<typeof FlickeringGrid>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background relative flex h-screen w-full items-center justify-center overflow-hidden">
    {children}
  </div>
);

export const Default: Story = {
  render: () => (
    <Stage>
      <FlickeringGrid className="absolute inset-0 size-full" />
      <p className="relative z-10 text-2xl font-medium">Flickering grid</p>
    </Stage>
  ),
};

export const LargeSquares: Story = {
  render: () => (
    <Stage>
      <FlickeringGrid
        className="absolute inset-0 size-full"
        squareSize={12}
        gridGap={10}
      />
      <p className="relative z-10 text-2xl font-medium">12px squares</p>
    </Stage>
  ),
};

export const RestlessFlicker: Story = {
  render: () => (
    <Stage>
      <FlickeringGrid
        className="absolute inset-0 size-full"
        flickerChance={0.8}
        maxOpacity={0.6}
      />
      <p className="relative z-10 text-2xl font-medium">flicker 0.8</p>
    </Stage>
  ),
};

export const Emerald: Story = {
  render: () => (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-zinc-950">
      <FlickeringGrid
        className="absolute inset-0 size-full"
        color="rgb(16, 185, 129)"
        maxOpacity={0.5}
        flickerChance={0.4}
      />
      <p className="relative z-10 text-2xl font-medium text-emerald-50">
        Emerald flicker
      </p>
    </div>
  ),
};

export const RadialMask: Story = {
  render: () => (
    <Stage>
      <FlickeringGrid
        className="absolute inset-0 size-full [mask-image:radial-gradient(circle_at_center,white,transparent_70%)]"
        maxOpacity={0.4}
      />
      <h2 className="relative z-10 text-4xl font-bold">Indiecrafts</h2>
    </Stage>
  ),
};
