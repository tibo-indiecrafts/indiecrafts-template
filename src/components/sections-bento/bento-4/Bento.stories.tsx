import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento4Section } from "./index";
import { bento4Sample } from "./config";

const meta: Meta<typeof Bento4Section> = {
  title: "Sections/Bento/Bento4",
  component: Bento4Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento4Section>;

export const Default: Story = {
  args: {
    ...bento4Sample,
    id: "story-bento-4",
  } as React.ComponentProps<typeof Bento4Section>,
};
