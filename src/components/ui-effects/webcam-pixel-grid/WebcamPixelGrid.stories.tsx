import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WebcamPixelGrid } from "./WebcamPixelGrid";

const meta: Meta<typeof WebcamPixelGrid> = {
  title: "UI Effects/Particles & Effects/WebcamPixelGrid",
  component: WebcamPixelGrid,
  parameters: { layout: "fullscreen" },
  argTypes: {
    gridCols: { control: { type: "range", min: 8, max: 80, step: 2 } },
    gridRows: { control: { type: "range", min: 6, max: 60, step: 2 } },
    colorMode: { control: "inline-radio", options: ["webcam", "monochrome"] },
    monochromeColor: { control: "color" },
    mirror: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof WebcamPixelGrid>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background relative h-screen w-full">{children}</div>
);

export const Default: Story = {
  render: (args) => (
    <Stage>
      <WebcamPixelGrid {...args} />
    </Stage>
  ),
};

export const Monochrome: Story = {
  args: { colorMode: "monochrome", monochromeColor: "#00ff88" },
  render: (args) => (
    <Stage>
      <WebcamPixelGrid {...args} />
    </Stage>
  ),
};
