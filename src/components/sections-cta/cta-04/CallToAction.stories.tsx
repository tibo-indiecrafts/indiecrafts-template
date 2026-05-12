import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Cta04Section } from "./index";
import { cta04Sample } from "./config";

const meta: Meta<typeof Cta04Section> = {
  title: "Sections/Cta/Cta04",
  component: Cta04Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Cta04Section>;
export const Default: Story = {
  args: { ...cta04Sample, id: "story-cta-04" } as React.ComponentProps<
    typeof Cta04Section
  >,
};
