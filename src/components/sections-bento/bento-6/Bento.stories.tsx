import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento6Section } from "./index";
import { bento6Sample } from "./config";

const meta: Meta<typeof Bento6Section> = {
  title: "Sections/Bento/Bento6",
  component: Bento6Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento6Section>;

export const Default: Story = {
  args: {
    ...bento6Sample,
    id: "story-bento-6",
  } as React.ComponentProps<typeof Bento6Section>,
};
