import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento03Section } from "./index";
import { bento03Sample } from "./config";

const meta: Meta<typeof Bento03Section> = {
  title: "Sections/Bento/Bento03",
  component: Bento03Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento03Section>;

export const Default: Story = {
  args: {
    ...bento03Sample,
    id: "story-bento-03",
  } as React.ComponentProps<typeof Bento03Section>,
};
