import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento7Section } from "./index";
import { bento7Sample } from "./config";

const meta: Meta<typeof Bento7Section> = {
  title: "Sections/Bento/Bento7",
  component: Bento7Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento7Section>;

export const Default: Story = {
  args: {
    ...bento7Sample,
    id: "story-bento-7",
  } as React.ComponentProps<typeof Bento7Section>,
};
