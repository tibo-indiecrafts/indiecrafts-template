import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ClickSpark } from "./index";

const meta: Meta<typeof ClickSpark> = {
  title: "UI Effects/Animations/ClickSpark",
  component: ClickSpark,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ClickSpark>;

export const Showcase: Story = {
  render: () => (
    <div className="h-dvh w-dvw bg-black">
      <ClickSpark
        sparkColor="#ffffff"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-white">
          <h1 className="text-4xl font-bold">Click anywhere</h1>
          <button type="button" className="rounded-md bg-white px-6 py-3 text-black">
            Or this button
          </button>
        </div>
      </ClickSpark>
    </div>
  ),
};

export const Colorful: Story = {
  render: () => (
    <div className="h-dvh w-dvw bg-neutral-900">
      <ClickSpark
        sparkColor="#5227FF"
        sparkSize={18}
        sparkRadius={40}
        sparkCount={14}
        duration={700}
        easing="ease-in-out"
        extraScale={1.2}
      >
        <div className="flex h-full w-full items-center justify-center text-3xl text-white/70">
          Click harder
        </div>
      </ClickSpark>
    </div>
  ),
};
