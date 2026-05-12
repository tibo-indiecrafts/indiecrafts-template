import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Cta05Section } from "./index";
import { cta05Sample } from "./config";

const meta: Meta<typeof Cta05Section> = {
  title: "Sections/Cta/Cta05",
  component: Cta05Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Cta05Section>;
export const Default: Story = {
  args: { ...cta05Sample, id: "story-cta-05" } as React.ComponentProps<
    typeof Cta05Section
  >,
};
