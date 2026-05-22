import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GridDistortion } from "./index";

const meta: Meta<typeof GridDistortion> = {
  title: "UI Effects/Backgrounds/GridDistortion",
  component: GridDistortion,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof GridDistortion>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <GridDistortion
        imageSrc="https://picsum.photos/1920/1080?grayscale"
        grid={10}
        mouse={0.25}
        strength={0.15}
        relaxation={0.9}
      />
    </div>
  ),
};
