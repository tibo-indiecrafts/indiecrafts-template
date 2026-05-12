import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento02Section } from "./index";
import { bento02Sample } from "./config";

const meta: Meta<typeof Bento02Section> = {
  title: "Sections/Bento/Bento02",
  component: Bento02Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento02Section>;

export const Default: Story = {
  args: {
    ...bento02Sample,
    id: "story-bento-02",
  } as React.ComponentProps<typeof Bento02Section>,
};
