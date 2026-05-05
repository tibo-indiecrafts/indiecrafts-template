import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento8Section } from "./index";
import { bento8Sample } from "./config";

const meta: Meta<typeof Bento8Section> = {
  title: "Sections/Bento/Bento8",
  component: Bento8Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento8Section>;

export const Default: Story = {
  args: {
    ...bento8Sample,
    id: "story-bento-8",
  } as React.ComponentProps<typeof Bento8Section>,
};
