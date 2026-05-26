import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Magnet } from "./index";

const meta: Meta<typeof Magnet> = {
  title: "UI Effects/Hover & Interactions/Magnet",
  component: Magnet,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Magnet>;

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black text-white">
      <Magnet padding={50} disabled={false} magnetStrength={50}>
        <p className="text-2xl">Star React Bits on GitHub!</p>
      </Magnet>
    </div>
  ),
};

export const Button: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-neutral-900">
      <Magnet padding={120} magnetStrength={3}>
        <button
          type="button"
          className="rounded-full bg-[#5227FF] px-8 py-4 text-lg font-medium text-white shadow-[0_8px_30px_rgba(82,39,255,0.4)]"
        >
          Hover near me
        </button>
      </Magnet>
    </div>
  ),
};
