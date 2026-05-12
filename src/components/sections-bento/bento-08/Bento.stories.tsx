import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento08Section } from "./index";
import { bento08Sample } from "./config";

const meta: Meta<typeof Bento08Section> = {
  title: "Sections/Bento/Bento08",
  component: Bento08Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento08Section>;

export const Default: Story = {
  args: {
    ...bento08Sample,
    id: "story-bento-08",
  } as React.ComponentProps<typeof Bento08Section>,
};
