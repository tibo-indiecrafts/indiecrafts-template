import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero19Section } from "./index";
import { hero19Sample } from "./config";

const meta: Meta<typeof Hero19Section> = {
  title: "Sections/Hero/Hero19",
  component: Hero19Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Hero19Section>;
export const Default: Story = {
  args: { ...hero19Sample, id: "story-hero-19" } as React.ComponentProps<
    typeof Hero19Section
  >,
};
