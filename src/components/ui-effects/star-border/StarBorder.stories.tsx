import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { StarBorder } from "./index";

const meta: Meta<typeof StarBorder> = {
  title: "UI Effects/Animations/StarBorder",
  component: StarBorder,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof StarBorder>;

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black">
      <StarBorder as="button" type="button" color="#ff00ff" speed="4s" thickness={4}>
        Click me
      </StarBorder>
    </div>
  ),
};

export const AsLink: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black">
      <StarBorder as="a" href="#" color="#5227FF" speed="3s" thickness={2}>
        Go somewhere
      </StarBorder>
    </div>
  ),
};
