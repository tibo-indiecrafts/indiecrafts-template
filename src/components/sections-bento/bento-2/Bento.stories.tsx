import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento2Section } from "./index";
import { bento2Sample } from "./config";

const meta: Meta<typeof Bento2Section> = {
  title: "Sections/Bento/Bento2",
  component: Bento2Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento2Section>;

export const Default: Story = {
  args: {
    ...bento2Sample,
    id: "story-bento-2",
  } as React.ComponentProps<typeof Bento2Section>,
};
