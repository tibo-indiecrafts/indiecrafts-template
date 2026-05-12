import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento04Section } from "./index";
import { bento04Sample } from "./config";

const meta: Meta<typeof Bento04Section> = {
  title: "Sections/Bento/Bento04",
  component: Bento04Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento04Section>;

export const Default: Story = {
  args: {
    ...bento04Sample,
    id: "story-bento-04",
  } as React.ComponentProps<typeof Bento04Section>,
};
