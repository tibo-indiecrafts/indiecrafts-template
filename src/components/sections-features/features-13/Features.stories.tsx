import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features13Section } from "./index";
import { features13Sample } from "./config";

const meta: Meta<typeof Features13Section> = {
  title: "Sections/Features/Features13",
  component: Features13Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features13Section>;

export const Default: Story = {
  args: { ...features13Sample, id: "story-features-13" } as React.ComponentProps<
    typeof Features13Section
  >,
};
