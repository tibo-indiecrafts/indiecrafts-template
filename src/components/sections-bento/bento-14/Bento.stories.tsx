import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento14Section } from "./index";
import { bento14Sample } from "./config";

const meta: Meta<typeof Bento14Section> = {
  title: "Sections/Bento/Bento14",
  component: Bento14Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento14Section>;

export const Default: Story = {
  args: {
    ...bento14Sample,
    id: "story-bento-14",
  } as React.ComponentProps<typeof Bento14Section>,
};
