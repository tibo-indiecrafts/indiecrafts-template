import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Cta03Section } from "./index";
import { cta03Sample } from "./config";

const meta: Meta<typeof Cta03Section> = {
  title: "Sections/Cta/Cta03",
  component: Cta03Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Cta03Section>;

export const Default: Story = {
  args: { ...cta03Sample, id: "story-cta-03" } as React.ComponentProps<
    typeof Cta03Section
  >,
};
