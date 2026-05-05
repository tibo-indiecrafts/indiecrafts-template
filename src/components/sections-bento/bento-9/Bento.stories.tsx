import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento9Section } from "./index";
import { bento9Sample } from "./config";

const meta: Meta<typeof Bento9Section> = {
  title: "Sections/Bento/Bento9",
  component: Bento9Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento9Section>;

export const Default: Story = {
  args: {
    ...bento9Sample,
    id: "story-bento-9",
  } as React.ComponentProps<typeof Bento9Section>,
};
