import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento3Section } from "./index";
import { bento3Sample } from "./config";

const meta: Meta<typeof Bento3Section> = {
  title: "Sections/Bento/Bento3",
  component: Bento3Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento3Section>;

export const Default: Story = {
  args: {
    ...bento3Sample,
    id: "story-bento-3",
  } as React.ComponentProps<typeof Bento3Section>,
};
