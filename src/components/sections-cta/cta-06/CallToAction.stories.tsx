import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Cta06Section } from "./index";
import { cta06Sample } from "./config";

const meta: Meta<typeof Cta06Section> = {
  title: "Sections/Cta/Cta06",
  component: Cta06Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Cta06Section>;
export const Default: Story = {
  args: { ...cta06Sample, id: "story-cta-06" } as React.ComponentProps<
    typeof Cta06Section
  >,
};
