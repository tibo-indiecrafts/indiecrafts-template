import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TextCursor } from "./index";

const meta: Meta<typeof TextCursor> = {
  title: "UI Effects/Text/TextCursor",
  component: TextCursor,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TextCursor>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <TextCursor
        text="⚛️"
        spacing={80}
        followMouseDirection
        randomFloat
        exitDuration={0.3}
        removalInterval={20}
        maxPoints={10}
      />
    </div>
  ),
};
