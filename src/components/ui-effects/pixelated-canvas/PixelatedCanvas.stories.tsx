import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PixelatedCanvas } from "./PixelatedCanvas";

const meta: Meta<typeof PixelatedCanvas> = {
  title: "UI Effects/Particles & Effects/PixelatedCanvas",
  component: PixelatedCanvas,
  parameters: { layout: "centered" },
  argTypes: {
    cellSize: { control: { type: "range", min: 2, max: 24, step: 1 } },
    dotScale: { control: { type: "range", min: 0.1, max: 1, step: 0.05 } },
    shape: { control: "inline-radio", options: ["circle", "square"] },
    grayscale: { control: "boolean" },
    interactive: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof PixelatedCanvas>;

const SOURCE = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80";

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex h-[480px] w-[640px] max-w-full items-center justify-center">
    {children}
  </div>
);

/** Decorative — `aria-hidden`. Square dots, default density. */
export const Default: Story = {
  args: { src: SOURCE, width: 600, height: 400, cellSize: 8, shape: "square" },
  render: (args) => (
    <Stage>
      <PixelatedCanvas {...args} />
    </Stage>
  ),
};

/** Circles, grayscale — softer, secondary visual. */
export const CirclesGrayscale: Story = {
  args: {
    src: SOURCE,
    width: 600,
    height: 400,
    cellSize: 6,
    shape: "circle",
    grayscale: true,
  },
  render: (args) => (
    <Stage>
      <PixelatedCanvas {...args} />
    </Stage>
  ),
};

/**
 * Informational — uses the translated `aria-label` (default: "Pixelated
 * visualization"). Use only when the canvas conveys information that's
 * not already captured by surrounding text.
 */
export const Informational: Story = {
  args: { src: SOURCE, width: 600, height: 400, informational: true },
  render: (args) => (
    <Stage>
      <PixelatedCanvas {...args} />
    </Stage>
  ),
};
