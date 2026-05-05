import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento11Section } from "./index";
import { bento11Sample } from "./config";

const meta: Meta<typeof Bento11Section> = {
  title: "Sections/Bento/Bento11",
  component: Bento11Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento11Section>;

export const Default: Story = {
  args: {
    ...bento11Sample,
    id: "story-bento-11",
  } as React.ComponentProps<typeof Bento11Section>,
};
