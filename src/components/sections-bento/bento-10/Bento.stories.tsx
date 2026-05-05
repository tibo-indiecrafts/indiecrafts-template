import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento10Section } from "./index";
import { bento10Sample } from "./config";

const meta: Meta<typeof Bento10Section> = {
  title: "Sections/Bento/Bento10",
  component: Bento10Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento10Section>;

export const Default: Story = {
  args: {
    ...bento10Sample,
    id: "story-bento-10",
  } as React.ComponentProps<typeof Bento10Section>,
};
