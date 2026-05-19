import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Gallery01Section } from "./index";
import { gallery01Sample } from "./config";

const meta: Meta<typeof Gallery01Section> = {
  title: "Sections/Gallery/Gallery01",
  component: Gallery01Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Gallery01Section>;

export const Default: Story = {
  args: {
    ...gallery01Sample,
    id: "story-gallery-01",
  } as React.ComponentProps<typeof Gallery01Section>,
};
