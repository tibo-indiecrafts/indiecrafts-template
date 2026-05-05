import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento5Section } from "./index";
import { bento5Sample } from "./config";

const meta: Meta<typeof Bento5Section> = {
  title: "Sections/Bento/Bento5",
  component: Bento5Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento5Section>;

export const Default: Story = {
  args: {
    ...bento5Sample,
    id: "story-bento-5",
  } as React.ComponentProps<typeof Bento5Section>,
};
