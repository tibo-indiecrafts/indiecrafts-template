import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento05Section } from "./index";
import { bento05Sample } from "./config";

const meta: Meta<typeof Bento05Section> = {
  title: "Sections/Bento/Bento05",
  component: Bento05Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento05Section>;

export const Default: Story = {
  args: {
    ...bento05Sample,
    id: "story-bento-05",
  } as React.ComponentProps<typeof Bento05Section>,
};
