import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento07Section } from "./index";
import { bento07Sample } from "./config";

const meta: Meta<typeof Bento07Section> = {
  title: "Sections/Bento/Bento07",
  component: Bento07Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento07Section>;

export const Default: Story = {
  args: {
    ...bento07Sample,
    id: "story-bento-07",
  } as React.ComponentProps<typeof Bento07Section>,
};
