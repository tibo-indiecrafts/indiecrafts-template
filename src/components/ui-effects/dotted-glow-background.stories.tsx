import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DottedGlowBackground } from "./dotted-glow-background";

const meta: Meta<typeof DottedGlowBackground> = {
  title: "UI Effects/Backgrounds/DottedGlowBackground",
  component: DottedGlowBackground,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof DottedGlowBackground>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background relative flex h-screen w-full items-center justify-center overflow-hidden">
    {children}
  </div>
);

export const Default: Story = {
  render: () => (
    <Stage>
      <DottedGlowBackground />
      <p className="relative z-10 text-2xl font-medium">Dotted glow background</p>
    </Stage>
  ),
};

export const Sparse: Story = {
  render: () => (
    <Stage>
      <DottedGlowBackground gap={60} radius={2.5} />
      <p className="relative z-10 text-2xl font-medium">gap = 60</p>
    </Stage>
  ),
};

export const Dense: Story = {
  render: () => (
    <Stage>
      <DottedGlowBackground gap={16} radius={1} />
      <p className="relative z-10 text-2xl font-medium">gap = 16</p>
    </Stage>
  ),
};

export const Emerald: Story = {
  render: () => (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-emerald-950">
      <DottedGlowBackground
        color="rgba(16, 185, 129, 0.6)"
        glowColor="rgba(16, 185, 129, 1)"
        backgroundOpacity={0}
      />
      <p className="relative z-10 text-2xl font-medium text-emerald-50">
        Emerald palette
      </p>
    </div>
  ),
};

export const Fast: Story = {
  render: () => (
    <Stage>
      <DottedGlowBackground speedScale={3} />
      <p className="relative z-10 text-2xl font-medium">speedScale = 3</p>
    </Stage>
  ),
};

export const Calm: Story = {
  render: () => (
    <Stage>
      <DottedGlowBackground speedScale={0.3} />
      <p className="relative z-10 text-2xl font-medium">speedScale = 0.3</p>
    </Stage>
  ),
};
