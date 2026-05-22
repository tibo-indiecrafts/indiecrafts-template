import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TargetCursor } from "./index";

const meta: Meta<typeof TargetCursor> = {
  title: "UI Effects/Cursor/TargetCursor",
  component: TargetCursor,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TargetCursor>;

export const Showcase: Story = {
  render: () => (
    <div className="relative flex h-dvh w-dvw flex-col items-center justify-center gap-8 bg-black text-white">
      <TargetCursor spinDuration={2} hideDefaultCursor parallaxOn hoverDuration={0.2} />
      <h1 className="text-4xl font-bold">Hover the elements</h1>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          className="cursor-target rounded-md bg-white px-6 py-3 text-black"
        >
          Click me!
        </button>
        <div className="cursor-target rounded-md border border-white px-6 py-3">
          Hover target
        </div>
        <a href="#" className="cursor-target underline">
          A link
        </a>
      </div>
    </div>
  ),
};
