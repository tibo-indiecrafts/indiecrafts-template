import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento06Section } from "./index";
import { bento06Sample } from "./config";

const meta: Meta<typeof Bento06Section> = {
  title: "Sections/Bento/Bento06",
  component: Bento06Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento06Section>;

export const Default: Story = {
  args: {
    ...bento06Sample,
    id: "story-bento-06",
  } as React.ComponentProps<typeof Bento06Section>,
};
