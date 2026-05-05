import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento1Section } from "./index";
import { bento1Sample } from "./config";

const meta: Meta<typeof Bento1Section> = {
  title: "Sections/Bento/Bento1",
  component: Bento1Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento1Section>;

export const Default: Story = {
  args: {
    ...bento1Sample,
    id: "story-bento-1",
  } as React.ComponentProps<typeof Bento1Section>,
};
