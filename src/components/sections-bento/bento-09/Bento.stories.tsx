import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento09Section } from "./index";
import { bento09Sample } from "./config";

const meta: Meta<typeof Bento09Section> = {
  title: "Sections/Bento/Bento09",
  component: Bento09Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento09Section>;

export const Default: Story = {
  args: {
    ...bento09Sample,
    id: "story-bento-09",
  } as React.ComponentProps<typeof Bento09Section>,
};
