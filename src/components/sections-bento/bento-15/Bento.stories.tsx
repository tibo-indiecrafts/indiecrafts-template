import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento15Section } from "./index";
import { bento15Sample } from "./config";

const meta: Meta<typeof Bento15Section> = {
  title: "Sections/Bento/Bento15",
  component: Bento15Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento15Section>;

export const Default: Story = {
  args: {
    ...bento15Sample,
    id: "story-bento-15",
  } as React.ComponentProps<typeof Bento15Section>,
};
