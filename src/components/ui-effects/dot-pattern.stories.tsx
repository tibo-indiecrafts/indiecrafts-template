import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DotPattern } from "./dot-pattern";

const meta: Meta<typeof DotPattern> = {
  title: "UI Effects/Backgrounds/DotPattern",
  component: DotPattern,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof DotPattern>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background relative flex h-screen w-full items-center justify-center overflow-hidden">
    {children}
  </div>
);

export const Default: Story = {
  render: () => (
    <Stage>
      <DotPattern />
      <p className="relative z-10 text-2xl font-medium">Dot pattern backdrop</p>
    </Stage>
  ),
};

export const Glow: Story = {
  render: () => (
    <Stage>
      <DotPattern glow />
      <p className="relative z-10 text-2xl font-medium">Animated glow</p>
    </Stage>
  ),
};

export const Sparse: Story = {
  render: () => (
    <Stage>
      <DotPattern width={32} height={32} cr={1.5} />
      <p className="relative z-10 text-2xl font-medium">32×32 spacing</p>
    </Stage>
  ),
};

export const Dense: Story = {
  render: () => (
    <Stage>
      <DotPattern width={8} height={8} cr={0.8} />
      <p className="relative z-10 text-2xl font-medium">8×8 spacing</p>
    </Stage>
  ),
};

export const RadialMask: Story = {
  render: () => (
    <Stage>
      <DotPattern
        glow
        className="[mask-image:radial-gradient(circle_at_center,white_20%,transparent_70%)]"
      />
      <div className="relative z-10 text-center">
        <h2 className="text-4xl font-bold">Indiecrafts Template</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Radial mask fades the dots toward the edges.
        </p>
      </div>
    </Stage>
  ),
};

export const CustomColor: Story = {
  render: () => (
    <Stage>
      <DotPattern glow className="text-violet-500/60" />
      <p className="relative z-10 text-2xl font-medium">text-violet-500/60</p>
    </Stage>
  ),
};
