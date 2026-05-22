import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Balatro } from "./index";

const meta: Meta<typeof Balatro> = {
  title: "UI Effects/Backgrounds/Balatro",
  component: Balatro,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Balatro>;

export const Showcase: Story = {
  render: () => (
    <div className="h-dvh w-dvw">
      <Balatro
        isRotate={false}
        mouseInteraction
        pixelFilter={745}
        color1="#DE443B"
        color2="#006BB4"
        color3="#162325"
      />
    </div>
  ),
};

export const Rotating: Story = {
  render: () => (
    <div className="h-dvh w-dvw">
      <Balatro
        isRotate
        spinRotation={-2}
        spinSpeed={4}
        color1="#7c3aed"
        color2="#ec4899"
        color3="#0f172a"
      />
    </div>
  ),
};
