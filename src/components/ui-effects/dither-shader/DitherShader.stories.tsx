import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DitherShader } from "./DitherShader";

const meta: Meta<typeof DitherShader> = {
  title: "UI Effects/Particles & Effects/DitherShader",
  component: DitherShader,
  parameters: { layout: "centered" },
  argTypes: {
    ditherMode: {
      control: "select",
      options: ["bayer", "halftone", "noise", "crosshatch"],
    },
    colorMode: {
      control: "select",
      options: ["original", "grayscale", "duotone", "custom"],
    },
    gridSize: { control: { type: "range", min: 1, max: 16, step: 1 } },
    invert: { control: "boolean" },
    animated: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof DitherShader>;

const SOURCE = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80";

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex h-[480px] w-[640px] max-w-full items-center justify-center">
    {children}
  </div>
);

export const Default: Story = {
  args: { src: SOURCE, ditherMode: "bayer", className: "h-[400px] w-[600px]" },
  render: (args) => (
    <Stage>
      <DitherShader {...args} />
    </Stage>
  ),
};

export const Halftone: Story = {
  args: {
    src: SOURCE,
    ditherMode: "halftone",
    gridSize: 6,
    className: "h-[400px] w-[600px]",
  },
  render: (args) => (
    <Stage>
      <DitherShader {...args} />
    </Stage>
  ),
};
