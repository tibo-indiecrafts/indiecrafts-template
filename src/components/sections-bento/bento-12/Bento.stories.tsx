import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento12Section } from "./index";
import { bento12Sample } from "./config";

const meta: Meta<typeof Bento12Section> = {
  title: "Sections/Bento/Bento12",
  component: Bento12Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento12Section>;

export const Default: Story = {
  args: {
    ...bento12Sample,
    id: "story-bento-12",
  } as React.ComponentProps<typeof Bento12Section>,
};
